<template>
    <scroll v-slot="{ item }" :items="items">
        <component :is="getComponent()" :item="item"></component>
    </scroll>
</template>

<script lang="ts" setup>

    import { ref } from 'vue';
    import Scroll from "./Scroll.vue";
    import Child from "./Child.vue";
    
    const getComponent = () => {
        return Child;
    }

    const items = ref([
        {
            id:"1",
            name:"something1",
            email:"1"
        },
        {
            id:"2",
            name:"something2",
            email:"1"
        },
        {
            id:"3",
            name:"something3",
            email:"1"
        },
        {
            id:"4",
            name:"something4",
            email:"1"
        },
    ]);

</script>

<style>

</style>
