<template>
    
    <toolbar></toolbar>
    
    <canvas-view
        id="canvas"
        ref="canvas"
        >
    </canvas-view>
    
    <scrolling-story
        :componentFactory="componentFactory"
        :choices="choices"
        :sections="sections"
        @divert="onDivert"
        @tag-hit="onTag"
        @progress="onProgress"
        >
    </scrolling-story>

    <down-button :show=""></down-button>

    <button class="down" :class="{'showDown': showDown}" @click="down">
        <div>
            <span>V</span>
        </div>
    </button>

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
    import {useStore as useStoryStore} from '@/stores/Story';
    import { storeToRefs } from 'pinia'
    import {onMounted, ref} from "vue";
    import type { HasId, Section, ICanvas } from './types/types';
    import type {Ref} from "vue";
    
    const storyStore = useStoryStore();
    const storyStoreRefs = storeToRefs(storyStore);

    const sections:Ref<Section[]> = storyStoreRefs.storyItems;
    const choices:Ref<any> = storyStoreRefs.choices;
    const canvas:Ref<ICanvas | null> = ref(null);
    const showDown = true;

    const components = {
        [SectionType.CODE]: CodeView,
        [SectionType.TEXT]: TextView,
        [SectionType.IMAGE]: ImageView,
        [SectionType.CHOICES]: ChoicesView
    };

    const componentFactory = (item: HasId):any=>{
        let type = ((item as unknown) as Section).type;
        return components[type];
    };

    onMounted(()=>{
        storyStore.load();
    });

    const onDivert = (itemId:any, choiceIndex:number)=>{
        storyStore.divert(itemId, choiceIndex);
    };

    const onTag = (tags:any)=>{
        canvas.value?.update(tags.color);
    };

    const onProgress = ()=>{
        //uiStore.divert(itemId, choiceIndex);
    };
    
</script>

<style scoped lang="scss">
    .mm-scroll-wrapper{
        padding-top: 0;
    }
</style>    