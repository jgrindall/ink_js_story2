<template>
    <div class="text" ref="element">
        <img :src="'/images/' + item.src"/>
    </div>

</template>

<script lang="ts" setup>

    import {  computed, ref } from 'vue';
    import type {PropType} from 'vue';
    import type {Image} from "../types/types";

    const props = defineProps({
        item:  {
            type: Object as PropType<Image>,
            required: true
        }
    })

    const element = ref<HTMLElement | null>(null);

    defineExpose({ element })

</script>

<style lang="scss" scoped>
    .text{
        background: transparent;
        position: relative;
        margin:8px;
        
        img{
            width: 250px;
            height: 250px;
            background: gold;
            margin:8px;
        }
    }
</style>
