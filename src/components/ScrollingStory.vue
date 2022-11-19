<template> 
    <scroll
        v-slot="{ item: item }"
        :items="sections"
        @scroll = "onScroll"
        @items-visible = "onItemsVisible"
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
   
</template>

<script lang="ts" setup>

    import { nextTick, ref } from 'vue';
    import type {PropType} from "vue";
    import Scroll from "@/scroll/Scroll.vue";
    import type { HasId, IScroll, Section} from '@/types/types';
    
    const scroll = ref<IScroll | null>(null);
    
    const props = defineProps({
        sections:  {
            type: Object as PropType<Section[]>,
            required: true
        },
        choices:{
            type: Object,
            required: true
        },
        componentFactory:{
            type: Function,
            required: true
        }
    });

    const showDown = ref<boolean>(false);

    const onScroll = (progress: number)=>{
        emit("progress", progress);
    };

    const onItemsVisible = (ids:number[])=>{
        emit("items-visible", ids);
    };

    const scrollToEnd = ()=>{
        scroll.value?.scrollToEnd();
    };
   
    const getChosenIndex = (item:HasId): number => {
        const value = props.choices[item.id];
        if (typeof(value) === "undefined"){
            return -1;
        }
        return value;
    };

    const run = (itemId:string, element:HTMLElement, success:boolean)=>{
        if(success){
            divert(itemId, 0, element);
        }
    };

    const divert = (itemId:string, choiceIndex: number, element:HTMLElement)=>{
        emit('divert', itemId, choiceIndex);
        const top = element.offsetTop;
        nextTick(()=>{
            setTimeout(()=>{
                //move to the one you just clicked on
                scroll.value?.scrollToPosition(top);
            });
        });
    };

    const emit = defineEmits([
        'divert',
        'tag-hit',
        'progress',
        'items-visible'
    ]);

    defineExpose({
        scrollToEnd
    });

</script>

<style scoped lang="scss">
    .mm-scroll-wrapper{
        padding-top: 0;
    }
</style>    