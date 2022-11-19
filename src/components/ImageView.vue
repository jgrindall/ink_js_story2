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
        $img_height:300px;
        &.center{
            text-align: center;
            height: $img_height;
            width:100%;
            border-image-slice: 6.8965517241% 7.8636959371% 7.0993914807% 0 fill;
            border-image-source: url(/images/bg.svg);
            border-width: 2.125rem 3.75rem 2.1875rem 0;
            border-style: solid;
            max-width: 600px;
            margin: auto;
            > div{
                width:$img_height;
                height:$img_height;
                margin: auto;
                background-size: 100% 100%;
            }
        }
    }
</style>
