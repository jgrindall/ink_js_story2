<template>

    <div ref="wrapperRef" class="wrapper">
        <div
            v-for="item in items"
            :data-visibleTimestamp="getEntry(item.id)?.visibleTimestamp"
            key="id"
            :ref="(el: HTMLElement) => addChild(item, el)"
            :class="{'visible': getEntry(item.id)?.visible}"
        >    
            <slot :item="item"></slot>
        </div>
    </div>
</template>

<script lang="ts">
    type Entry = {
        el:HTMLElement,
        visibleTimestamp: null | number, // time at which it should show
        visible: boolean, // is it shown?
        id: number // required
    };
</script>

<script lang="ts" setup>

    import { ref, onMounted, onBeforeUnmount } from 'vue'
    import {isContainedIn} from "../ink/Utils";
    import type { Ref, PropType  } from 'vue'
    import { debounce } from 'underscore';
    import type {HasId} from "../types/types";
    import easyScroll from 'easy-scroll';

    const wrapperRef:Ref<HTMLElement | null> = ref<HTMLElement | null>(null);
    const mapIdToEntry:Ref< Record<string, Entry>> = ref({});
    const scrollingActive: Ref<Boolean> = ref(false);
    let interval:number;

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
           default:2000
       }
    });

    const getEntry = (id:number):Entry => mapIdToEntry.value[id];
    

    /**
     * update the value of visible on each entry
     */
    const updateVisibility = () => {
        const now = Date.now();
        Object.values(mapIdToEntry.value).forEach((entry:Entry)=>{
            if(!entry.visible){
                entry.visible = !!(entry.visibleTimestamp && entry.visibleTimestamp <= now);
                if(entry.visible){
                    console.log("VISIBLE");
                }
            }
        })
        if(interval){
            interval = requestAnimationFrame(updateVisibility);
        } 
    }

    /**
     * When a child is added, setup an entry to manage it
     * @param item
     * @param el 
     */
    const addChild = (item:HasId, el: HTMLElement)=>{
        let entry:Entry = getEntry(item.id);
        if(!entry){
            mapIdToEntry.value[item.id] = {
                el,
                visibleTimestamp: null,
                visible: false,
                id:item.id
            }
        }
        update();
    };

    /**
     * Scroll to a specific element
     * @param el
     */
    const scrollTo = (el: HTMLElement)=>{
        const top = el.offsetTop;
        let wrapperEl = wrapperRef?.value as HTMLElement;
        if(scrollingActive.value || !wrapperEl){
            // already scrolling
            return;
        }
        scrollingActive.value = true;
        easyScroll({
            'scrollableDomEle':wrapperEl,
            'direction': 'bottom',
            'duration':props.speed,
            'easingPreset': 'easeInQuad',
            'scrollAmount': top - wrapperEl.scrollTop,
            'onAnimationCompleteCallback': ()=>{
                scrollingActive.value = false;
            }
        });
    };

    const update = ()=>{
        const now = Date.now();
        if(scrollingActive.value){
            return;
        }
        const show:number[] = [];
        const additional:number[] = [];
        Object.values(mapIdToEntry.value).forEach( (entry:Entry) =>{
            if(isElemVisible(entry.el) && !entry.visibleTimestamp && !entry.visible){
                show.push(entry.id);
            }
        });
        if(show.length >= 1){
            Object.values(mapIdToEntry.value).forEach( (entry:Entry) =>{
                if(entry.id < show[0] && !entry.visibleTimestamp && !entry.visible && !show.includes(entry.id) && !additional.includes(entry.id)){
                    additional.push(entry.id);
                } 
            });
            additional.forEach( (id:number) =>{
                const entry:Entry = getEntry(id);
                entry.visibleTimestamp = now; 
            });
            show.forEach( (id:number, i:number) =>{
                const entry:Entry = getEntry(id);
                entry.visibleTimestamp = now + (5000*i);
                console.log(i, now, entry, entry.visibleTimestamp);
            });
        }
    };

    /**
     * when children appear, update the visibility
     */
    let onChildren = debounce((mutations : MutationRecord[])=>{
        if(mutations.find(m=>m.type === "childList")){
            setTimeout(update);
        }
    }, 500);

    onMounted(()=>{
        let el = wrapperRef?.value as HTMLElement;
        el.addEventListener("scroll", handleScroll);
        let mutationObserver = new MutationObserver(onChildren);
        mutationObserver.observe(el, {
            childList: true
        });
        let resizeObserver = new ResizeObserver(update);
        resizeObserver.observe(el);
        // begin updating each frame
        interval = requestAnimationFrame(updateVisibility);
        setTimeout(update);
    });

    onBeforeUnmount(() => {
        // remove listeners
        wrapperRef?.value?.removeEventListener("scroll", handleScroll);
        cancelAnimationFrame(interval);
    });

    /**
     * Helper function
     * @param el
     */
    const isElemVisible = (el: HTMLElement): boolean => {
        return wrapperRef.value ? isContainedIn(wrapperRef.value as HTMLElement)(el) : false;
    };

    let handleScroll = debounce(update, props.speed);

    /**
     * Scroll to a specific id
     * @param id 
     */
    const goto = (id:number)=>{
        const entry = getEntry(id);
        scrollTo(entry.el);
    }

    defineExpose({ goto })

</script>


<style scoped lang="scss">
    .wrapper{
        background: #222;
        position: absolute;
        top:0px;
        width:100%;
        height:100%;
        left:0px;
        overflow-y: auto;
    }
    .a{
        opacity: 0;
         -webkit-transition: opacity 0.5s ease-in-out;
        transition: opacity 0.5s ease-in-out;
        &.visible{
            opacity: 1;
        }
    }
    textarea{
        color: white;
        position: fixed;
        right: 50px;
        top: 0;
        height: 500px;
        width:300px;
        background: orange;
        z-index: 100000000;
        font-size: 13px;
        font-family: monospace;
    }
</style>



