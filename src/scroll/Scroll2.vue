<template>

    <div ref="elRef" class="mm-scroll-wrapper">
        <div class="leftright">
            <div id="left1"></div>
            <div id="left2"></div>
            <div id="left3"></div>
        </div>


        <div
            v-for="item in items"
            key="id"
            class="mm-scroll-item"
            :id="'' + item.id"
            :class="{
                'mm-scroll-visible': getEntry(item.id)?.visible,
                'mm-scroll-partial': getEntry(item.id)?.partial
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
        partial: boolean, // is it shown?
        visibleTimestamp: null | number, // time at which it should show
        partialTimestamp: null | number, // time at which it should show
        
    };
</script>

<script lang="ts" setup>

    import { ref, onMounted, onBeforeUnmount, watchEffect } from 'vue'
    import {getAddedNodes, getRemovedNodes} from "../utils/Utils";
    import type { Ref, PropType  } from 'vue'
    import {max, compact } from 'underscore';
    import type {HasId} from "../types/types";
    import easyScroll from 'easy-scroll';

    const elRef:Ref<HTMLElement | null> = ref<HTMLElement | null>(null);
    const mapIdToEntry:Ref< Record<number, Entry>> = ref({});
    const scrollingActive: Ref<Boolean> = ref(false);
    let interval:number;

    // are these rectaive? they shouldnt be
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
           default:250
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
            if(!entry.partial && entry.partialTimestamp){
                entry.partial = entry.partialTimestamp <= now;
            }
        })
        if(interval){
            interval = requestAnimationFrame(updateVisibility);
        } 
    }

    /**
     * scroll to the bottom
     */
    const scrollToEnd = ()=>{
        const el = elRef.value as HTMLElement;
        const top = el.scrollHeight - el.offsetHeight;
        scrollToPosition(top);
    };

    /**
     * Scroll to a specific position
     * @param {number} top
     */
    const scrollToPosition = (top: number)=>{
        const el = elRef.value as HTMLElement;
        if(scrollingActive.value || !el){
            // already scrolling
            return;
        }
        scrollingActive.value = true;
        easyScroll({
            'scrollableDomEle':el,
            'direction': 'bottom',
            'duration':props.scrollSpeed,
            'easingPreset': 'easeInQuad',
            'scrollAmount': top - el.scrollTop,
            'onAnimationCompleteCallback': ()=>{
                setTimeout(()=>{
                    scrollingActive.value = false;
                });
            }
        });
    };

    watchEffect(() => {
        props.items.forEach( (item:HasId) =>{
            addId(item.id);
        });
    });

    const addId = (id:number, el?:HTMLElement)=>{
        //TODO - not when eg. code mirror changes
        const entry = mapIdToEntry.value[id];
        if(entry){
            entry.el = el || null;
        }
        else{
            mapIdToEntry.value[id] = {
                el:el || null,
                id,
                visible: false,
                partial: false,
                visibleTimestamp: null,
                partialTimestamp: null
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
        console.log("mutations", mutations);
        const nodesAdded = getAddedNodes(mutations);
        const nodesRemoved = getRemovedNodes(mutations);
        nodesAdded.forEach((el:HTMLElement)=>{
            addId(parseInt(el.id), el);
        });
        nodesRemoved.forEach((el:HTMLElement)=>{
            removeId(parseInt(el.id));
        });
    };

    /**
     when elements move into viewport, update visibility
     */
     const onIntersectChanged = (intersectionEntries : IntersectionObserverEntry[])=>{

        const toMakeVisible:Entry[] = [];
        const toMakePartial:Entry[] = [];
        
        intersectionEntries.forEach(intersectionEntry=>{
            const entry = getEntry(parseInt(intersectionEntry.target.id))
            if(entry){
                if(!entry.partial && intersectionEntry.intersectionRatio >= 0.10){
                    toMakePartial.push(entry);
                }
                if(!entry.visible && intersectionEntry.intersectionRatio >= 0.1){
                    toMakeVisible.push(entry);
                }
            }
        });

        const startDates = compact(Object.values(mapIdToEntry.value).map(obj => obj.visibleTimestamp));
        const maxStartDate = startDates.length >= 1 ? max(startDates) + props.speed : -1;
        let startDate = Math.max(Date.now(), maxStartDate);

        toMakeVisible.forEach((entry:Entry, i:number)=>{
            entry.visibleTimestamp = startDate + props.speed*i;
        });
    };

    let handleScroll = ()=>{
        let el = elRef.value as HTMLElement;
        console.log("onIntersectChanged", el.scrollHeight, el.clientHeight, el.scrollTop, el.scrollHeight === el.clientHeight + el.scrollTop);
        emit('scroll', el.scrollHeight === el.clientHeight + el.scrollTop);
    };

    onMounted(()=>{
        let el = elRef.value as HTMLElement;

        el.addEventListener("scroll", handleScroll);

        console.log(el);

        // listen to children being added
        mutationObserver = new MutationObserver(onChildrenChanged);
        mutationObserver.observe(el, {
            childList: true,
            attributes:true,
            subtree:false
        });

       intersectionObsever = new IntersectionObserver(onIntersectChanged, {
            root: elRef.value,
            threshold: [
                0,
                0.1,
                0.9, 1.0]
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
        elRef.value?.removeEventListener("scroll", handleScroll);
    });

    const showAll = ()=>{
        const now = Date.now();
        Object.values(mapIdToEntry.value)
            .forEach((entry:Entry)=>{
                entry.partial = true;
                entry.visible = true;
                entry.visibleTimestamp = now;
                entry.partialTimestamp = now;
            });
    };

    const emit = defineEmits(['scroll']);

    defineExpose({
        scrollToPosition,
        scrollToEnd,
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
        .mm-scroll-item{
            opacity: 0;
            -webkit-transition: opacity 0.5s ease-in-out;
            transition: opacity 0.5s ease-in-out;
            &.mm-scroll-partial{
                opacity: 0.1;
            }
            &.mm-scroll-visible{
                opacity: 1;
            }
            &:nth-child(n + 3){
                margin-top:20px;
            }
            &:nth-child(n + 2){
                margin-bottom:20px;
            }
        }
    }
</style>
