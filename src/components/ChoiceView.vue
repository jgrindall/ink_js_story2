<template>
   <div class="choice" ref="element" @click="onClickContents">
      <p>
         Choice: {{item.text}} {{last}}
      </p>
   </div>

</template>

<script lang="ts" setup>

    import {ref } from 'vue';
    import type {PropType } from 'vue';
    import type {Choice} from "../types/types";

    const props = defineProps({
       item:  {
          type: Object as PropType<Choice>,
          required: true
       },
       last:{
          type:Boolean,
          required:false
       }
    });

    const element = ref<HTMLElement | null>(null);
    defineExpose({ element })
   const emit = defineEmits(['divert', 'disable']);

   const onClickContents = ()=>{
        //emit('disable', props.entry);
        emit('divert', props.item.choiceIndex, props.item.id);
    };


</script>

<style lang="scss" scoped>
   .choice{
      position: relative;
      cursor: pointer;
      &:hover{
         p{
            background: #222;
         }
      }
      p{
         background: #111;
         margin:40px;
         padding:40px;
      }
   }
</style>

