<template>
    <div class="child" :ref="(el) => el" :id="item.id" @click="emit('divert')">
        <div class="block">
            <div>
                <a :href="`/contacts/${item.id}`">
                    <p>Name: {{ item.name }}</p>
                </a>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

    import {ref, onMounted, onBeforeUnmount, computed, defineProps, PropType} from "vue";
    import type {Ref} from "vue";
    import { storeToRefs } from 'pinia';
    import type {Item} from "../ink/types";

    const element = ref<HTMLElement | null>(null);

     const props = defineProps({
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
