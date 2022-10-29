<template>

    <div ref="elRef" :class="getClass">
        <canvas></canvas>
    </div>

</template>

<script lang="ts" setup>

    import { ref, computed, defineProps } from 'vue'
    import type { Ref } from 'vue'

    const props = defineProps({
        'color': {
            type: String,
            required: true
        }
    });

    const getClass = computed(()=>{
        return props.color;
    });

</script>

<style scoped lang="scss">
    #canvas{
        width:100%;
        height: 100%;
    }
    div, canvas{
        width:100%;
        height:100%;
    }
    .red{
        background-color: red;
    }
    .green{
        background-color: green;
    }
    .blue{
        background-color: blue;
    }
    .yellow{
        background-color: yellow;
    }
    canvas{
        background: #333;
        background-image: url("../images/bg.png");
        background-repeat: no-repeat;
        background-size: cover;
        opacity: 0.5;
    }
</style>