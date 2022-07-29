<template>
    <div id="canvas">
        <CanvasView></CanvasView>
    </div>

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
        let type = ((item as unknown) as StoryItem).type;
        return type === "text"
            ? TextView
            : (type === "image"
                ? ImageView
                : ChoiceView
            );
    }

    onMounted(()=>{
        storyStore.load();
    })

    const divert = (choiceIndex: number, entryId:number)=>{
        storyStore.divert(choiceIndex);
        nextTick(()=>{
            setTimeout(()=>{
                scroll.value.goto(entryId);
            })
        })
    };    

</script>

<style scoped lang="scss">
    #canvas{
        width:100%;
        height: 100%;
    }
</style>    