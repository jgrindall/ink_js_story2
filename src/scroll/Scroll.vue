<template>

    <div ref="wrapperRef" class="mm-scroll-wrapper">
        <div
            v-for="item in items"
            key="id"
            :ref="(el: HTMLElement) => addChild(item, el)"
            class="mm-scroll-item"
            :class="{'mm-scroll-visible': getEntry(item.id)?.visible}"
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
    import {getOverlapPercentEl} from "../ink/Utils";
    import type { Ref, PropType  } from 'vue'
    import { debounce, difference, uniq, max, pluck, compact } from 'underscore';
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
           default:500
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
            console.log('add', item.id);
        }
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
            'duration':props.speed * 0.99,
            'easingPreset': 'easeInQuad',
            'scrollAmount': top - wrapperEl.scrollTop,
            'onAnimationCompleteCallback': ()=>{
                setTimeout(()=>{
                    scrollingActive.value = false;
                });
            }
        });
    };

    const update = ()=>{
        const startDates = compact(pluck(Object.values(mapIdToEntry.value), "visibleTimestamp"));
        const maxStartDate = startDates.length >= 1 ? max(startDates) + props.speed : -1;
        let startDate = Math.max(Date.now(), maxStartDate);
        
        if(scrollingActive.value){
            return;
        }
        const canAddTimestamp = (entry:Entry) => !entry.visibleTimestamp && !entry.visible;
        
        // entries that are visible now
        let entriesThatBecameVisible = Object.values(mapIdToEntry.value)
            .filter(entry => canAddTimestamp(entry) && isElemVisible(entry.el));
        
        if(entriesThatBecameVisible.length >= 1){
            // if entry 6,7,8 are visible, we make visible elements 0,1,2,3,4,5 as well, so we do not leave gaps
            let previousEntriesToMakeVisible = Object.values(mapIdToEntry.value)
                .filter(entry => canAddTimestamp(entry) && entry.id < entriesThatBecameVisible[0].id);

            entriesThatBecameVisible = uniq(entriesThatBecameVisible);
            previousEntriesToMakeVisible = difference(uniq(previousEntriesToMakeVisible), entriesThatBecameVisible);

            // elements 0-5 become visible immediately
            console.log('previousEntriesToMakeVisible', previousEntriesToMakeVisible.map(e=>e.id));
            previousEntriesToMakeVisible.forEach(entry => entry.visibleTimestamp = startDate);

            // the elements that just became visible get staggered times

            console.log('entriesThatBecameVisible', entriesThatBecameVisible.map(e=>e.id));

            entriesThatBecameVisible.forEach( (entry:Entry, i:number) =>{
                entry.visibleTimestamp = startDate + props.speed*i;
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
        return wrapperRef.value ? getOverlapPercentEl(el, wrapperRef.value as HTMLElement) >= 50: false;
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
            &.mm-scroll-visible{
                opacity: 1;
            }
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



