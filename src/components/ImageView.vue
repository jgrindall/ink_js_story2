<template>
    <div class="image" :class="item.className">
        <div :style="style">
        </div>
    </div>

</template>

<script lang="ts" setup>

    import {computed, type PropType, type StyleValue} from 'vue';
    import type {Image} from "../types/types";

    const props = defineProps({
        item:  {
            type: Object as PropType<Image>,
            required: true
        }
    });

    const style = computed(() : StyleValue =>{
        return {
            backgroundImage: `url(/images/${props.item.src})`
        };
    })

</script>

<style lang="scss" scoped>
    .image{
        background: transparent;
        position: relative;
        margin:0;
        >div{
            width:100%;
            height:100%;
        }

        &.banner{
            height:60vh;
            & div{
                background-size: cover;
                background-position: center center;
            }
        }
        &.center{
            text-align: center;
            height: 200px;
            width:100%;
            > div{
                width:200px;
                height:200px;
                margin: auto;
                background-size: 100% 100%;
            }
        }
    }
</style>
