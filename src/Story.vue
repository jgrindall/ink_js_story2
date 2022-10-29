<template>
    
    <toolbar></toolbar>
    
    <canvas-view
        id="canvas"
        ref="canvas"
        :color="color"
        >
    </canvas-view>
    
    <scrolling-story
        :componentFactory="componentFactory"
        :choices="choices"
        :sections="sections"
        :api="api"
        @divert="onDivert"
        @items-visible="onItemsVisible"
        @progress="onProgress"
        ref="scroll"
        >
    </scrolling-story>

    <down-button
        :show="!isAtEnd"
        @click="down"
        >
    </down-button>

</template>

<script lang="ts" setup>
    import ScrollingStory from '@/components/ScrollingStory.vue';
    import Toolbar from "@/components/Toolbar.vue"
    import CanvasView from './components/CanvasView.vue';
    import { SectionType } from './types/enums';
    import TextView from './components/TextView.vue';
    import ImageView from './components/ImageView.vue';
    import ChoicesView from './components/ChoicesView.vue';
    import CodeView from './components/CodeView.vue';
    import DownButton from './components/DownButton.vue';
    import {useStore as useStoryStore} from '@/stores/Story';
    import {useStore as useUIStore} from '@/stores/UI';
    import {useStore as useCodeStore} from '@/stores/Code';
    import { storeToRefs } from 'pinia'
    import {onMounted, ref} from "vue";
    import type { HasId, Section, ICanvas, IScroll } from './types/types';
    import type {Ref} from "vue";
    
    const storyStore = useStoryStore();
    const storyStoreRefs = storeToRefs(storyStore);
    const uiStore = useUIStore();
    const uiStoreRefs = storeToRefs(uiStore);
    const codeStore = useCodeStore();

    const isAtEnd:Ref<boolean> = uiStoreRefs.isAtEnd;
    const color:Ref<string> = uiStoreRefs.bgColor;
    const sections:Ref<Section[]> = storyStoreRefs.storyItems;
    const choices:Ref<any> = storyStoreRefs.choices;
    const canvas:Ref<ICanvas | null> = ref(null);
    const scroll:Ref<IScroll | null> = ref(null);

    const components = {
        [SectionType.CODE]: CodeView,
        [SectionType.TEXT]: TextView,
        [SectionType.IMAGE]: ImageView,
        [SectionType.CHOICES]: ChoicesView
    };

    const api = ()=>{
        
    };

    const componentFactory = (item: HasId):any=>{
        let type = ((item as unknown) as Section).type;
        return components[type];
    };

    onMounted(()=>{
        storyStore.load();
        codeStore.load();
    });

    const onDivert = (itemId:any, choiceIndex:number)=>{
        storyStore.divert(itemId, choiceIndex);
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

    const down = ()=>{
        scroll.value?.scrollToEnd();
    };
    
</script>

<style scoped lang="scss">
    .mm-scroll-wrapper{
        padding-top: 0;
    }
</style>    