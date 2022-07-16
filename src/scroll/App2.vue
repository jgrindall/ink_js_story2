<template>
    <scroll v-slot="{ item }" :items="items">
        <component :is="getComponent()" :item="item" @divert="divert"></component>
    </scroll>

    <button @click="add" style="position:fixed;top:0;left:0;">add</button>
</template>

<script lang="ts" setup>

    import { ref } from 'vue';
    import Scroll from "./Scroll.vue";
    import Child from "./Child.vue";
    
    const getComponent = () => {
        return Child;
    }

    const divert = ()=>{
        const r = Math.ceil(Math.random() * 1000) + 1000;
        items.value.push({
            id:700,
            name:"something" + r,
            email:"1"
        });
    };

    const add = ()=>{
        alert('add');
        for(let i = 0; i < 10; i++){
            items.value.push(
                {
                    id: (i + 20),
                    name:"something new" + i,
                    email:"new" + i
                }
            );
        }
    };

    const items = ref([
        {
            id:0,
            name:"something1",
            email:"1"
        },
        {
            id:1,
            name:"something2",
            email:"1"
        },
        {
            id:2,
            name:"something3",
            email:"1"
        },
        {
            id:3,
            name:"something4",
            email:"1"
        },
        {
            id:4,
            name:"something5",
            email:"1"
        },
        {
            id:5,
            name:"something6",
            email:"1"
        },
        {
            id:6,
            name:"something7",
            email:"1"
        },
        {
            id:7,
            name:"something8",
            email:"1"
        }
    ]);

</script>

<style>

</style>
