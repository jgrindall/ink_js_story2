<template>

    <van-nav-bar id="toolbar" title="Title">

        <template #left>
            <van-icon name="arrow-down" color="#ee0a24" size="1.5rem"/>
            <van-button icon="arrow-up" color="#7232dd" type="primary">
                Primary
            </van-button>
            <button @click="saveJSON">Save</button>
            <button @click="loadJSON">Load</button>
            <button @click="clearJSON">Clear</button>
            <van-loading />

        </template>

        <template #right>
            <van-button color="#7232dd" type="primary">Primary</van-button>
        </template>

    </van-nav-bar>

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
        font-size: larger;
    }
</style>
