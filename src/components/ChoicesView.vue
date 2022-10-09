<template>
   <div class="choices" :class="getClass" ref="elRef">
      <div class="choice" v-for="(choice, i) in item.choices" @click="onClickContents(choice)">
         <p>
            Choice: {{choice.text}}
         </p>
         <span class="blob" v-if="i === chosenIndex"></span>
      </div>
   </div>
</template>

<script lang="ts" setup>

   import type {PropType, Ref} from 'vue'; 
   import type {Choices, Choice} from "../types/types";
   import {ref, computed} from "vue";
   
   const elRef:Ref<HTMLElement | null> = ref(null);

   const props = defineProps({
      item:  {
         type: Object as PropType<Choices>,
         required: true
      },
      chosenIndex:{
         type: Number,
         required: true
      }
   });

   const isDisabled = computed(():boolean=>{
        return props.chosenIndex >= 0;
   });
   
   const getClass = computed(()=>{
        return {
            "disabled": isDisabled.value
        };
    });

   const emit = defineEmits([
      'divert',
      'disable'
   ]);

   const onClickContents = (choice:Choice)=>{
      if(props.chosenIndex === -1){
         emit('divert', props.item.id, choice.choiceIndex, elRef.value);
      }
   };

</script>

<style lang="scss" scoped>
   .choices{
      &.disabled{
         opacity: 0.95;
         filter: grayscale(0.8);
      }
      .choice{
         position: relative;
         cursor: pointer;
         max-width: 800px;
         margin: auto;
         text-align: center;
         border:1px dashed #ccc;
         margin-bottom:12px;
         font-family: "Bamburgh", Georgia, "Times New Roman", Times, serif;
         color:#ccc;
         &:hover{
            background: rgba(200,200,200,0.25);
         }
         p{
            margin:8px;
            padding:6px;
         }
      }
      .blob{
         $size:20px;
         width:$size;
         height:$size;
         border-radius: 50%;
         background: white;
         position: absolute;
         right: 10px;
         top: 50%;
         margin-top: -1 * calc($size / 2);

      }
   }
</style>