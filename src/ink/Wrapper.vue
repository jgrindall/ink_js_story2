<template>

    <div ref="wrapperRef" class="wrapper">

        <div class="container"
             :ref="el => addChild(item, el as HTMLElement)"
             v-for="item in items"
             :key="item.id"
             :class="{'seen': visibility[item.id]?.visible}"
             :style="{'animation-delay' : visibility[item.id]?.delay + 's'}"
        >
            <slot :item="item as any" :elapsedTime="visibility[item.id]?.elapsedTime"/>
        </div>


    </div>

</template>

<script lang="ts" setup>
    import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
    import type { Ref  } from 'vue'
    import {isContained} from "./Layout";
    import {debounce} from "underscore";
    import type {HasId} from "./types"

    const props = defineProps<{
        items: HasId[]
    }>();

    type A = {
        visible: boolean,
        delay: number,
        elapsedTime: number,
        start:number
    };

    const visibility : Ref<{[key:string]: A}> = ref({});

    let children: {[key: string] : HTMLElement} = {};

    const addChild = (item:HasId, el:HTMLElement) =>{
        if(!children[item.id]){
            children[item.id] = el;
            updateVis();
        }
    }

    const wrapperRef = ref<HTMLElement | null>(null);

    watch(() => props.items, (items: HasId[]) => {
        let added = false;
        items.forEach((item:HasId) =>{
            if(!visibility.value[item.id]){
                visibility.value[item.id] = {
                    visible: false,
                    delay:0,
                    elapsedTime:0,
                    start:0
                };
                added = true
            }
        });
        if(added){
            updateVis();
        }
    })

    let interval: number = 0;

    const step = () => {
        const ids = Object.keys(visibility.value);
        ids.forEach(id => {
            const value = visibility.value[id];
            if(value.visible){
                value.elapsedTime = Date.now() - value.start;
            }
        });
    };

    const startCounting = ()=>{
        interval = setInterval(step, 1000);
    };

    const stopCounting = ()=>{
        clearInterval(interval);
    };

    onMounted(()=>{
        wrapperRef?.value?.addEventListener("scroll", handleScroll);
        startCounting();
    });

    onBeforeUnmount(() => {
        wrapperRef?.value?.removeEventListener("scroll", handleScroll);
        stopCounting();
    });

    const isElemVisible = (el: HTMLElement): boolean => {
        return isContained(el.getBoundingClientRect(), wrapperRef?.value?.getBoundingClientRect())
    };

    let updateVis = ()=>{
        let d = 0;
        const delay = 500; // ms
        const ids = Object.keys(visibility.value);
        ids.forEach(id => {
            const value = visibility.value[id];
            const alreadyShown = value.visible;
            if(!alreadyShown && children[id] && isElemVisible(children[id])){
                visibility.value[id] = {
                    visible: true,
                    delay: d,
                    elapsedTime: 0,
                    start:Date.now()
                }
                d += delay/1000;
            }
        })
    };

    updateVis = debounce(updateVis, 50);

    let handleScroll = () => {
       updateVis();
    };

    handleScroll = debounce(handleScroll, 50);

</script>


<style scoped lang="scss">
   
</style>

