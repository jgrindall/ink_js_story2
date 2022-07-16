<template>
    <div class="child" :ref="el => el" :id="item.id" @click="emit('divert')">
        <div class="block">
            <div>
                <a>
                    <p>Name: {{ item.name }}</p>
                </a>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

    import {ref} from "vue";
    import type { PropType} from "vue";
    import type {Item} from "../ink/types";

    const element = ref<HTMLElement | null>(null);

    defineProps({
       item:  {
          type: Object as PropType<Item>,
          required: true
       }
    });

    const info = ref({
        title:"JOHN"
    });

    defineExpose({ element, info })

    const emit = defineEmits(['divert'])



</script>

<style lang="scss" scoped>
    .child{
        background:red;
        margin:20px;
        .block{
            background:red;
            width:500px;
            height:200px;
        }
    }
</style>
