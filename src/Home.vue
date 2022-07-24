<template>
    <div id="canvas">
        <CanvasView></CanvasView>
    </div>

    <textarea style="position: fixed;
    right: 0;
    top: 0;
    width: 500px;
    height: 500px;
    z-index: 1000;
    font-size: 14px;
    color: black;">{{items}}</textarea>

    <scroll
        v-slot="{ item: item }"
        :items="items"
        ref="scroll"
        >
        <component
            class="component"
            :is="getComponent(item)"
            :item="item"
            @divert="divert"
        >
        </component>
    
    </scroll>

</template>

<script lang="ts" setup>

    import { nextTick, onMounted, ref } from 'vue';
    import Scroll from "./scroll/Scroll.vue";
    import type { StoryItem, HasId } from '@/types/types';
    import TextView from '@/ink/TextView.vue';
    import ChoiceView from '@/ink/ChoiceView.vue';
    import ImageView from '@/ink/ImageView.vue';
    import CanvasView from './ink/CanvasView.vue';
    import {useStore as useStoryStore} from '@/ink/Story';
    import { storeToRefs } from 'pinia'
    
    const scroll = ref<any | null>(null);
    const storyStore = useStoryStore();
    const storyStoreRefs = storeToRefs(storyStore);

    const items = storyStoreRefs.storyItems;
    
    const getComponent = (item: HasId) => {
        let bookItem =  (item as unknown) as StoryItem;
        console.log(item, bookItem.type);
        return bookItem.type === "text" ? TextView : (bookItem.type === "image" ? ImageView : ChoiceView);
    }

    onMounted(()=>{
        storyStore.load();
    })

    const divert = (id: number)=>{
        //store2.divert(id);
        nextTick(()=>{
            setTimeout(()=>{
                scroll.value.goto(id);
            })
        })
    };    

</script>

<style>

</style>


    