<template>
   <div class="choices">
      <div class="choice" v-for="choice in item.choices" @click="onClickContents(choice)">
         <p>
            Choice: {{choice.text}} {{last}}
         </p>
      </div>
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

   const emit = defineEmits(['divert', 'disable']);

   const onClickContents = (choice:{choiceIndex:number})=>{
      if(props.last){
         emit('divert', choice.choiceIndex, props.item.id);
      }
   };


</script>

<style lang="scss" scoped>
   .choices{
      &:not(.last){
         display: none;
         background-color: green;
      }
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
   }
</style>

