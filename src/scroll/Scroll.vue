<template>
    <div ref="elRef" class="mm-scroll-wrapper">
        <div
            v-for="item in items"
            key="id"
            :id="'' + item.id"
            :class="{
                'mm-scroll-item': true,
                'mm-scroll-visible': getEntry(item.id)?.visible
            }"
        >    
            <slot :item="item"></slot>
        </div>
    </div>

</template>

<script lang="ts">
    type Entry = {
        el:HTMLElement | null,
        id: number, // required
        visible: boolean, // is it shown?
        visibleTimestamp: null | number, // time at which it should show       
    };
</script>

<script lang="ts" setup>

    import { ref, onMounted, onBeforeUnmount, watchEffect } from 'vue'
    import {getAddedNodes, getRemovedNodes, min} from "../utils/Utils";
    import type { Ref, PropType  } from 'vue'
    import {max, compact } from 'underscore';
    import type {HasId} from "../types/types";
    import useScrollTo from "./scrollTo"
    
    const elRef:Ref<HTMLElement | null> = ref<HTMLElement | null>(null);
    const mapIdToEntry:Ref< Record<number, Entry>> = ref({});
    const scrollingActive: Ref<Boolean> = ref(false);
    
    let interval:number;
    let mutationObserver: MutationObserver;
    let intersectionObsever: IntersectionObserver;

    const props = defineProps({
       items:  {
           // list of items
          type: Object as PropType<HasId[]>,
          required: true
       },
       speed:{
           // how fast elements appear (one by one)
           type:Number,
           required: false,
           default:100
       },
       scrollSpeed:{
           // how fast relevant elements scroll into view
           type:Number,
           required: false,
           default:500
       },
       overlapPercent:{
           // how to detect whether an element is visible or not
           type:Number,
           required: false,
           default:33
       }
    });

    const getEntry = (id:number):Entry => mapIdToEntry.value[id];

    /**
     * update the value of visible on each entry
     */
     const updateVisibility = () => {
        const now = Date.now();
        Object.values(mapIdToEntry.value).forEach((entry:Entry)=>{
            if(!entry.visible && entry.visibleTimestamp){
                entry.visible = entry.visibleTimestamp <= now;
            }
        })
        if(interval){
            interval = requestAnimationFrame(updateVisibility);
        } 
    }

    watchEffect(() => {
        props.items.forEach( (item:HasId) =>{
            addId(item.id);
        });
    });

    const addId = (id:number, el?:HTMLElement)=>{
        const entry = mapIdToEntry.value[id];
        if(entry){
            entry.el = el || null;
        }
        else{
            mapIdToEntry.value[id] = {
                el:el || null,
                id,
                visible: false,
                visibleTimestamp: null
            };
        }
        if(el){
            intersectionObsever.observe(el);
        }
    };

    const removeId = (id:number)=>{
        delete mapIdToEntry.value[id];
        const el:HTMLElement | null = (mapIdToEntry.value[id] && mapIdToEntry.value[id].el) ? mapIdToEntry.value[id].el : null;
        if(el){
            intersectionObsever.unobserve(el);
        }
    };

    /**
     * when children appear, update the visibility
     */
    const onChildrenChanged = (mutations : MutationRecord[])=>{
        const nodesAdded = getAddedNodes(mutations);
        const nodesRemoved = getRemovedNodes(mutations);
        nodesAdded.forEach((el:HTMLElement)=>{
            addId(parseInt(el.id), el);
        });
        nodesRemoved.forEach((el:HTMLElement)=>{
            removeId(parseInt(el.id));
        });
    };

    const visible:Record<number, boolean> = {};

    /**
     when elements move into viewport, update visibility
     */
     const onIntersectChanged = (intersectionEntries : IntersectionObserverEntry[])=>{
        
        const toMakeVisible:Entry[] = [];
        const minRatio = 0.1;
    
        intersectionEntries.forEach(intersectionEntry=>{
            visible[parseInt(intersectionEntry.target.id)] = intersectionEntry.isIntersecting;
            const entry = getEntry(parseInt(intersectionEntry.target.id))
            if(entry){
                if(!entry.visible && intersectionEntry.intersectionRatio >= minRatio){
                    toMakeVisible.push(entry);
                }
            }
        });

        if(toMakeVisible.length >= 1){
            const startDates = compact(Object.values(mapIdToEntry.value).map(obj => obj.visibleTimestamp));
            const maxStartDate = startDates.length >= 1 ? max(startDates) + props.speed : -1;
            let startDate = Math.max(Date.now(), maxStartDate);
            const ids = toMakeVisible.map(entry=>entry.id);
            const minId = min(ids);
            let prevVisible: Entry[] = Object.values(mapIdToEntry.value).filter(entry => entry.id < minId);

            toMakeVisible.forEach((entry:Entry, i:number)=>{
                if(!entry.visibleTimestamp){
                    entry.visibleTimestamp = startDate + props.speed*i;
                }
            });

            prevVisible.forEach((entry:Entry)=>{
                if(!entry.visibleTimestamp){
                    entry.visibleTimestamp = startDate;
                }
            });
        }

        const visibleIds = Object.keys(visible)
            .filter(id => visible[parseInt(id)])
            .map(id=> parseInt(id));
        visibleIds.sort((a:number, b:number)=>{
            return a < b ? -1 : (a > b ? 1 : 0);    
        });
        emit('items-visible', visibleIds);
    };

    let handleScroll = ()=>{
        let el = elRef.value as HTMLElement;
        const max =  el.scrollHeight - el.clientHeight;
        const progress = el.scrollTop/max;
        emit('progress', progress);
    };

    onMounted(()=>{
        let el = elRef.value as HTMLElement;
        el.addEventListener("scroll", handleScroll);
        
        // listen to children being added
        mutationObserver = new MutationObserver(onChildrenChanged);
        mutationObserver.observe(el, {
            childList: true,
            attributes:true,
            subtree:false
        });

        //listen to scrolling
        intersectionObsever = new IntersectionObserver(onIntersectChanged, {
            root: elRef.value,
            threshold: [
                0,
                0.1,
                0.5,
                0.9,
                1.0
            ]
        });
      
        // begin updating each frame
        interval = requestAnimationFrame(updateVisibility);
    });

    /**
     * remove listeners
     */
    onBeforeUnmount(() => {
        cancelAnimationFrame(interval);
        mutationObserver.disconnect();
        intersectionObsever.disconnect();
        elRef.value?.removeEventListener("scroll", handleScroll);
    });

    const showAll = ()=>{
        const now = Date.now();
        Object.values(mapIdToEntry.value)
            .forEach((entry:Entry)=>{
                entry.visible = true;
                entry.visibleTimestamp = now;
            });
    };

    const emit = defineEmits([
        'progress',
        'items-visible'
    ]);

    const { scrollToEnd, scrollToPosition } = useScrollTo()

    defineExpose({
        scrollToPosition: (top: number)=>{
            scrollToPosition(elRef.value as HTMLElement, top, props.scrollSpeed);
        },
        scrollToEnd:()=>{
            scrollToEnd(elRef.value as HTMLElement, props.scrollSpeed);
        },
        showAll
    })

</script>

<style scoped lang="scss">
    .mm-scroll-wrapper{
        position: absolute;
        top:0;
        width:100%;
        height:100%;
        left:0;
        overflow-y: auto;
        overflow-x: hidden;
        .mm-scroll-item{
            opacity: 0;
            -webkit-transition: opacity 0.5s ease-in-out;
            transition: opacity 0.5s ease-in-out;
            &.mm-scroll-visible{
                opacity: 1;
            }
            &:nth-child(n + 2){
                margin-top:20px;
            }
            &:nth-child(n + 1){
                margin-bottom:20px;
            }
        }
    }
</style>
