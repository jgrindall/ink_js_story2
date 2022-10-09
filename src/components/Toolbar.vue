<template>

    <div id="toolbar">
        <button @click="saveJSON">Save</button>
        <button @click="loadJSON">Load</button>
        <button @click="clearJSON">Clear</button>
    </div>

</template>

<script lang="ts" setup>

    import { nextTick, onMounted, ref } from 'vue';
    import {useStore as useStoryStore} from '@/stores/Story';
    
    const storyStore = useStoryStore();
    
    const saveJSON = ()=>{
        storyStore.saveJSON();
    };

    const loadJSON = ()=>{
        storyStore.loadJSON();
        nextTick(()=>{
            setTimeout(()=>{
                //scroll.value?.showAll();
                //scroll.value?.scrollToEnd();
            })
        })
    };

    const clearJSON = ()=>{
        storyStore.clearJSON();
    }; 


</script>

<style scoped lang="scss">
    #toolbar{
        min-height: 60px;
        z-index: 12;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(200,200,200,0.25);
        width: 100%;
    }
</style>    