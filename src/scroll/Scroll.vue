<template>
    <div ref="wrapperRef" class="wrapper">
        <div v-for="item in items" key="id" :ref="(el: HTMLElement) => { addChild(item, el) }">
            <slot :item="item"></slot>
        </div>
    </div>
</template>

<script lang="ts" setup>

    //https://stackblitz.com/edit/vue3-scoped-slots?file=src%2Fcomponents%2FList.vue

    import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
    import type {Item} from "../ink/types";
    import {isContainedIn} from "../ink/Layout";
    import type { Ref, PropType  } from 'vue'

    const wrapperRef:Ref<HTMLElement | null> = ref<HTMLElement | null>(null);

    let interval:any;

    let raf:any;

    type Entry = {
        el:HTMLElement,
        visible: null | boolean,
        wasVisible: null | boolean,
        showAt: null | number
    };

    const divs:Ref< Record<string, Entry>> = ref({});

    const getInfo = (id:string)=>{
        const entry = divs.value[id];
        return "info " + (entry ? entry.visible : "nope");
    };

    const props = defineProps({
       items:  {
          type: Object as PropType<Item[]>,
          required: true
       }
    });
    
    const repeatOften = () => {
        console.log("raf");
         Object.keys(divs.value).forEach( (id:string) =>{
            const entry = divs.value[id];
            if(entry.showAt){
                
            }
         });
    }

    const startCounting = ()=>{
        interval = requestAnimationFrame(repeatOften);
    };

    const addChild = (item:Item, el: HTMLElement)=>{
        console.log('addChild', item, el);
        const now = Date.now();
        let entry:Entry = divs.value[item.id] as Entry;
        if(entry){
            
        }
        else{
            divs.value[item.id] = {
                el,
                visible: null,
                wasVisible: null,
                showAt: null
            }
        }
        update();
    };

    const stopCounting = ()=>{
        cancelAnimationFrame(interval);
    };

    const update = ()=>{
        const newlyVisible:Entry[] = [];
        Object.keys(divs.value).forEach( (id:string) =>{
            const entry = divs.value[id];
            const vis = isElemVisible(entry.el);
            if(vis === true && entry.visible !== true){
                newlyVisible.push(entry);
            }
            entry.visible = vis;
            entry.wasVisible = entry.wasVisible || vis; // wasVisible never becomes false
        });
        console.log(newlyVisible);
        newlyVisible.forEach( (entry:Entry, i:number) =>{
            entry.showAt = Date.now() + 1000*i; 
        });
    };

    const onChildren = (mutations : {type:string}[])=>{
        let childList = false;
        for (let mutation of mutations) {
            if (mutation.type === 'childList') {
                console.log('Mutation Detected: A child node has been added or removed.');
                childList = true;
            }
        }
        if(childList){
            update();
        }
    };

    onMounted(()=>{
        let el = wrapperRef?.value as HTMLElement;
        el.addEventListener("scroll", handleScroll);
        startCounting();
        let observer = new MutationObserver(onChildren);
        observer.observe(el, {
            childList: true
        });
        update();
    });

    onBeforeUnmount(() => {
        wrapperRef?.value?.removeEventListener("scroll", handleScroll);
        stopCounting();
    });

    const isElemVisible = (el: HTMLElement): boolean => {
        return wrapperRef.value ? isContainedIn(wrapperRef.value as HTMLElement)(el) : false;
    };

    let updateVis = ()=>{
      
    };

    let handleScroll = () => {
       update();
    };

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
</style>



