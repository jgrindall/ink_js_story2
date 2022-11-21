<template>
    
    <toolbar></toolbar>
    
    <canvas-view
        id="canvas"
        ref="canvas"
        :color="color"
        >
    </canvas-view>

    <scroll
        v-slot="{ item: item }"
        :items="sections"
        @divert="divert"
        @progress="onProgress"
        @itemsVisible="onItemsVisible"
        ref="scroll"
        >
        <component
            class="item"
            :is="componentFactory(item)"
            :id="item.id"
            :item="item"
            :chosenIndex="getChosenIndex(item)"
            @divert="divert"
            @run="run"
        >
        </component>
    </scroll>

    <down-button
        :show="!isAtEnd"
        @click="scrollToEnd"
        >
    </down-button>

    <loader v-if="loading"/>

</template>

<script lang="ts" setup>
    import Toolbar from "@/components/Toolbar.vue"
    import CanvasView from './components/CanvasView.vue';
    import Loader from './components/Loader.vue';
    import DownButton from './components/DownButton.vue';
    import {useStore as useStoryStore} from '@/stores/Story';
    import {useStore as useUIStore} from '@/stores/UI';
    import {useStore as useCodeStore} from '@/stores/Code';
    import { storeToRefs } from 'pinia'
    import {onMounted} from "vue";
    import type { HasId, Section, ICanvas, IScroll } from './types/types';
    import type {Ref} from "vue";
    import Scroll from "@/scroll/Scroll.vue";
    import { nextTick, ref } from 'vue';
    import useComponentFactory from "@/scroll/componentFactory";

    const { componentFactory } = useComponentFactory()
    const storyStore = useStoryStore();
    const storyStoreRefs = storeToRefs(storyStore);
    const uiStore = useUIStore();
    const uiStoreRefs = storeToRefs(uiStore);
    const codeStore = useCodeStore();

    const isAtEnd:Ref<boolean> = uiStoreRefs.isAtEnd;
    const color:Ref<string> = uiStoreRefs.bgColor;
    const loading:Ref<boolean> = uiStoreRefs.isLoading;
    const sections:Ref<Section[]> = storyStoreRefs.storyItems;
    const choices:Ref<any> = storyStoreRefs.choices;
    const canvas:Ref<ICanvas | null> = ref(null);
    const scroll:Ref<IScroll | null> = ref(null);

    onMounted(()=>{
        storyStore.load();
        codeStore.load();
    });

    const getChosenIndex = (item:HasId): number => {
        const value = choices.value[item.id];
        return typeof(value) === "undefined" ? -1 : value; 
    };

    const run = (itemId:string, element:HTMLElement, success:boolean)=>{
        if(success){
            divert(itemId, 0, element);
        }
    };
    
    const scrollToEnd = ()=>{
        scroll.value?.scrollToEnd();
    };

    const divert = (itemId:string, choiceIndex: number, element:HTMLElement)=>{
        storyStore.divert(itemId, choiceIndex);
        const top = element.offsetTop;
        console.log(element, top);
        nextTick(()=>{
            setTimeout(()=>{
                //move to the one you just clicked on
                scroll.value?.scrollToPosition(top);
            });
        });
    };

    const onItemsVisible = (ids:number[])=>{
        const midpoint = ids[Math.floor(ids.length/2)];
        ids.sort((a:number, b:number)=>{
            const da = Math.abs(a - midpoint);
            const db = Math.abs(b - midpoint);
            return da < db ? -1 : (da > db ? 1 : 0);    
        });
        for(let i = 0; i < ids.length; i++){
            let id = ids[i];
            const item = sections.value.find(item=>item.id === id);
            if(typeof(item) !== "undefined"){
                const tags = (item as any).tags;
                if(tags && tags.type === "bg"){
                    uiStore.setBg(tags.color);
                    break;
                } 
            }
        }
    };

    const onProgress = (progress: number)=>{
        uiStore.setProgress(progress);
    };
    
</script>

<style scoped lang="scss">
    .mm-scroll-wrapper{
        padding-top: 0;
    }
</style>    