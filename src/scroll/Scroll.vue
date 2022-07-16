<template>

    <div ref="wrapperRef" class="wrapper">
        <div
            v-for="item in items"
            key="id"
            :ref="(el: HTMLElement) => addChild(item, el)"
            :class="getClass(item)"
        >    
            <slot :item="item"></slot>
        </div>
    </div>
</template>

<script lang="ts">
    type Entry = {
        el:HTMLElement,
        showAt: null | number,
        show: boolean,
        id: number
    };
</script>

<script lang="ts" setup>

    import { ref, onMounted, onBeforeUnmount } from 'vue'
    import {isContainedIn} from "../ink/Layout";
    import type { Ref, PropType  } from 'vue'
    import { debounce } from 'underscore';
    import type {ItemInt} from "../ink/types";
    import easyScroll from 'easy-scroll';

    const wrapperRef:Ref<HTMLElement | null> = ref<HTMLElement | null>(null);
    const _data:Ref< Record<string, Entry>> = ref({});
    const scrollingActive: Ref<Boolean> = ref(false);
    let interval:number;

    defineProps({
       items:  {
          type: Object as PropType<ItemInt[]>,
          required: true
       }
    });

    const getEntry = (id:number):Entry => {
        return _data.value[id] as Entry;
    };
    
    const updateVisibility = () => {
        Object.values(_data.value).forEach((entry:Entry)=>{
            entry.show = !!(entry.showAt && entry.showAt <= Date.now());
        })
        if(interval){
            interval = requestAnimationFrame(updateVisibility);
        } 
    }

    const addChild = (item:ItemInt, el: HTMLElement)=>{
        let entry:Entry = getEntry(item.id);
        if(!entry){
            _data.value[item.id] = {
                el,
                showAt: null,
                show: false,
                id:item.id
            }
            setTimeout(()=>{
                scrollTo(el);
            })
        }
        update();
    };

    const scrollTo = (el: HTMLElement)=>{
        const top = el.offsetTop;
        let domEl = wrapperRef?.value as HTMLElement;
        if(scrollingActive.value || !domEl){
            return;
        }
        scrollingActive.value = true;
        easyScroll({
            'scrollableDomEle':domEl,
            'direction': 'bottom',
            'duration':2500,
            'easingPreset': 'easeInQuad',
            'scrollAmount': top,
            'onAnimationCompleteCallback': ()=>{
                scrollingActive.value = false;
            }
        });
    };

    const getClass = (item:ItemInt)=>{
        let entry:Entry = getEntry(item.id);
        return {
            "a": true,
            "show": entry && entry.show
        };
    };

    const update = ()=>{
        if(scrollingActive.value){
            return;
        }
        const show:number[] = [];
        const additional:number[] = [];
        Object.values(_data.value).forEach( (entry:Entry) =>{
            if(isElemVisible(entry.el) && !entry.showAt && !entry.show){
                show.push(entry.id);
            }
        });
        if(show.length >= 1){
            Object.values(_data.value).forEach( (entry:Entry) =>{
                if(entry.id < show[0] && !entry.showAt && !entry.show && !show.includes(entry.id) && !additional.includes(entry.id)){
                    additional.push(entry.id);
                } 
            });
            additional.forEach( (id:number) =>{
                const entry:Entry = getEntry(id);
                entry.showAt = Date.now(); 
            });
            show.forEach( (id:number, i:number) =>{
                const entry:Entry = getEntry(id);
                entry.showAt = Date.now() + 500*i; 
            });
        }
    };

    let onChildren = debounce((mutations : MutationRecord[])=>{
        if(mutations.find(m=>m.type === "childList")){
            setTimeout(update);
        }
    }, 500);

    onMounted(()=>{
        let el = wrapperRef?.value as HTMLElement;
        el.addEventListener("scroll", handleScroll);
        let observer = new MutationObserver(onChildren);
        observer.observe(el, {
            childList: true
        });
        let observer2 = new ResizeObserver(update);
        observer2.observe(el);
        interval = requestAnimationFrame(updateVisibility);
        setTimeout(update);
    });

    onBeforeUnmount(() => {
        wrapperRef?.value?.removeEventListener("scroll", handleScroll);
        cancelAnimationFrame(interval);
    });

    const isElemVisible = (el: HTMLElement): boolean => {
        return wrapperRef.value ? isContainedIn(wrapperRef.value as HTMLElement)(el) : false;
    };

    let handleScroll = debounce(update, 500);

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
        &.show{
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



