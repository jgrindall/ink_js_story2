<template>
    <p>app</p>
    <div id="canvas">
        <CanvasView></CanvasView>
    </div>

    <div id="wrapper">
        <ComponentView :msg="name"/>
    </div>

    

</template>

<script lang="ts" setup>

    import ComponentView from "./ComponentView.vue";
    import CanvasView from "./CanvasView.vue";
    import { ref, onMounted } from 'vue'
    import {useStore as useStoryStore} from './Story';

    const name = ref("John1234")
    const store = useStoryStore();

    onMounted(()=>{
        store.load();
    });

</script>

<style>

    ul{
        list-style: none;
        padding: 0;
        margin: 0;
    }
</style>

<style lang="scss">
    #app{
        width: 100%;
        height: 100%;
    }
    #wrapper, #canvas{
        position: fixed;
        width: 100%;
        height: 100%;
        top:0;
        left:0;
    }
    #wrapper{
        z-index: 1;
    }
</style>
