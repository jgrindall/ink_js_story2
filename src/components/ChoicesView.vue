<template>
   <div v-for="choice in item.choices" class="choice" ref="element" @click="onClickContents(choice)">
      <p>
         Choice: {{choice.text}} {{last}}
      </p>
   </div>

</template>

<script lang="ts" setup>

   import {ref } from 'vue';
   import type {PropType } from 'vue';
   import type {Choices} from "../types/types";

   const props = defineProps({
      item:  {
         type: Object as PropType<Choices>,
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

   const onClickContents = (choice:{choiceIndex:number})=>{
         emit('divert', choice.choiceIndex, props.item.id);
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

