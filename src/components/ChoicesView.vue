<template>
   <div class="choices" ref="elRef">
      <div class="choice" v-for="choice in item.choices" @click="onClickContents(choice)">
         <p>
            Choice: {{choice.text}} {{last}}
         </p>
      </div>
   </div>
</template>

<script lang="ts" setup>

   import type {PropType, Ref} from 'vue'; 
   import type {Choices, Choice} from "../types/types";
   import {ref} from "vue";
   
   const elRef:Ref<HTMLElement | null> = ref(null);

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

   const onClickContents = (choice:Choice)=>{
      if(props.last){
         emit('divert', choice.choiceIndex, elRef.value);
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