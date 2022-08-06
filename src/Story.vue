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
            class="item"
            :class="{'last': item === lastItem}"
            :is="getComponent(item)"
            :id="item.id"
            :item="item"
            :last="item === lastItem"
            @divert="divert"
        >
        </component>
    
    </scroll>

    <button style="position: fixed; top:0;right:0;z-index: 1000;" @click="saveJSON">Save</button>
    <button style="position: fixed; top:60px;right:0;z-index: 1000;" @click="loadJSON">Load</button>
    <button style="position: fixed; top:120px;right:0;z-index: 1000;" @click="clearJSON">Clear</button>

</template>

<script lang="ts" setup>

    import { nextTick, onMounted, ref, computed } from 'vue';
    import type {Ref} from "vue";
    import Scroll from "./scroll/Scroll.vue";
    import type { StoryItem, HasId, IScroll } from '@/types/types';
    import TextView from '@/components/TextView.vue';
    import ChoicesView from '@/components/ChoicesView.vue';
    import ImageView from '@/components/ImageView.vue';
    import CanvasView from '@/components/CanvasView.vue';
    import {useStore as useStoryStore} from '@/stores/Story';
    import { storeToRefs } from 'pinia'
    import { last } from 'underscore';

    const scroll = ref<IScroll | null>(null);
    const storyStore = useStoryStore();
    const storyStoreRefs = storeToRefs(storyStore);

    const items:Ref<StoryItem[]> = storyStoreRefs.storyItems;

    const hash = {
        "text": TextView,
        "image": ImageView,
        "choices": ChoicesView
    };

    const getComponent = (item: HasId): typeof TextView | typeof ImageView | typeof ChoicesView => {
        let type = ((item as unknown) as StoryItem).type;
        return hash[type];
    }

    onMounted(()=>{
        storyStore.load();
    });

    const lastItem = computed(() => {
      return last(items.value);
    });

    const saveJSON = ()=>{
        storyStore.saveJSON();
    };

    const loadJSON = ()=>{
        storyStore.loadJSON();
        nextTick(()=>{
            setTimeout(()=>{
                scroll.value?.showAll();
                scroll.value?.scrollToEnd();
            })
        })
    };

    const clearJSON = ()=>{
        storyStore.clearJSON();
    }; 

    const divert = (choiceIndex: number, element:HTMLElement)=>{
        const top = element.offsetTop;
        storyStore.divert(choiceIndex);
        nextTick(()=>{
            setTimeout(()=>{
                //move to the one you just clicked on
                (scroll.value as IScroll).scrollToPosition(top);
            });
        });
    };

</script>

<style scoped lang="scss">
    #canvas{
        width:100%;
        height: 100%;
    }
    button{
        cursor: pointer;
    }
</style>    