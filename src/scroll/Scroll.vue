<template>

    <div ref="elRef" class="mm-scroll-wrapper">
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
        el:HTMLElement,
        visibleTimestamp: null | number, // time at which it should show
        visible: boolean, // is it shown?
        partialTimestamp: null | number, // time at which it should show
        partial: boolean, // is it shown?
        id: number // required
    };
</script>

<script lang="ts" setup>

    import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
    import {getOverlapPercentEl} from "../utils/Utils";
    import type { Ref, PropType  } from 'vue'
    import { debounce, difference, uniq, max, compact } from 'underscore';
    import type {HasId, IScroll} from "../types/types";
    import easyScroll from 'easy-scroll';

    const elRef:Ref<HTMLElement | null> = ref<HTMLElement | null>(null);
    const mapIdToEntry:Ref< Record<number, Entry>> = ref({});
    const scrollingActive: Ref<Boolean> = ref(false);
    let interval:number;
    let mutationObserver: MutationObserver;
    let resizeObserver: ResizeObserver;

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
           default:500
       },
       scrollSpeed:{
           // how fast relevant elements scroll into view
           type:Number,
           required: false,
           default:1000
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

    const update = ()=>{

        const updateUsing = (percent:number, t1:'visible' | 'partial', t2: 'visibleTimestamp' | 'partialTimestamp')=>{
            const startDates = compact(Object.values(mapIdToEntry.value).map(obj => obj[t2]));
            const maxStartDate = startDates.length >= 1 ? max(startDates) + props.speed : -1;
            let startDate = Math.max(Date.now(), maxStartDate);
            
            const canAddTimestamp = (entry:Entry) => !entry[t2] && !entry[t1];
            
            // entries that are visible now
            let entriesThatBecameVisible = Object.values(mapIdToEntry.value)
                .filter(entry => canAddTimestamp(entry) && isElemVisible(entry.el, percent));
            
            if(entriesThatBecameVisible.length >= 1){
                // if entry 6,7,8 are visible, we make visible elements 0,1,2,3,4,5 as well, so we do not leave gaps
                let previousEntriesToMakeVisible = Object.values(mapIdToEntry.value)
                    .filter(entry => canAddTimestamp(entry) && entry.id < entriesThatBecameVisible[0].id);

                entriesThatBecameVisible = uniq(entriesThatBecameVisible);
                previousEntriesToMakeVisible = difference(uniq(previousEntriesToMakeVisible), entriesThatBecameVisible);

                // elements 0-5 become visible immediately
                previousEntriesToMakeVisible.forEach(entry => entry[t2] = startDate);

                // the elements that just became visible get staggered times

                entriesThatBecameVisible.forEach( (entry:Entry, i:number) =>{
                    entry[t2] = startDate + props.speed*i;
                });
            }
        };

        updateUsing(props.overlapPercent, "visible", "visibleTimestamp");
        updateUsing(0.01, "partial", "partialTimestamp");
    };

    /**
     * when children appear, update the visibility
     */
    let onChildren = (mutations : MutationRecord[])=>{
        const nodesAdded:HTMLElement[] = [];
        mutations.forEach((mutation:MutationRecord)=>{
            if(mutation.type === "childList"){
                mutation.addedNodes.forEach((node:Node)=>{
                    nodesAdded.push(node as HTMLElement);
                });
            }
        });
        nodesAdded.forEach((el:HTMLElement)=>{
            const id:number = parseInt(el.id);
            mapIdToEntry.value[id] = {
                el,
                visibleTimestamp: null,
                visible: false,
                partialTimestamp: null,
                partial: false,
                id
            }
        });
        update();
    };

    onMounted(()=>{
        let el = elRef.value as HTMLElement;
        el.addEventListener("scroll", handleScroll);
        mutationObserver = new MutationObserver(onChildren);
        mutationObserver.observe(el, {
            childList: true,
            attributes:true,
            subtree:true
        });
        resizeObserver = new ResizeObserver(update);
        resizeObserver.observe(el);
        // begin updating each frame
        interval = requestAnimationFrame(updateVisibility);
        setTimeout(update);
    });

    onBeforeUnmount(() => {
        // remove listeners
        elRef.value?.removeEventListener("scroll", handleScroll);
        cancelAnimationFrame(interval);
        mutationObserver.disconnect();
        resizeObserver.disconnect();
    });

    /**
     * Helper function
     * @param el
     */
    const isElemVisible = (el: HTMLElement, percent:number): boolean => {
        const overlapPercent = elRef.value ? getOverlapPercentEl(el, elRef.value as HTMLElement) : 0;
        return overlapPercent >= percent;
    };

    let handleScroll = debounce(update, props.speed);

    const showAll = ()=>{
        Object.values(mapIdToEntry.value).forEach((entry:Entry)=>{
            entry.visible = true;
            entry.partial = true;
        });
    };

    const _expose:IScroll = {
        scrollToPosition,
        scrollToEnd,
        showAll
    };

    defineExpose(_expose)

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
        }
    }
</style>



