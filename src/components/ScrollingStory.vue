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
        showDown.value = (progress < 1);
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
            const item = props.sections.find(item=>item.id === id);
            if(typeof(item) !== "undefined"){
                const tags = (item as any).tags;
                if(tags && tags.type === "bg"){
                    emit('tag-hit', tags);                    
                    break;
                } 
            }
        }
    };

    const down = ()=>{
        scroll.value?.scrollToEnd();
    };
   
    const getChosenIndex = (item:HasId): number => {
        const value = props.choices[item.id];
        if (typeof(value) === "undefined"){
            return -1;
        }
        return value;
    };

    const run = (itemId:string, element:HTMLElement)=>{
        //TODO - always True
        divert(itemId, 0, element);
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

    const emit = defineEmits(['divert', 'tag-hit', 'progress']);

</script>

<style scoped lang="scss">
    .mm-scroll-wrapper{
        padding-top: 0;
    }
</style>    