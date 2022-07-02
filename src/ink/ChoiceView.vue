<template>

   <div class="choice" :class="additionalClasses" ref="element">
      <p>
         {{entry.id}} {{visible}}

         Choice: {{entry.text}} {{visible}}
      </p>
   </div>

</template>

<script lang="ts" setup>

    import {ref, computed } from 'vue';
    import type {PropType } from 'vue';
    import type {Choice} from "./types";

    const props = defineProps({
       entry:  {
          type: Object as PropType<Choice>,
          required: true
       },
       visible:{
          type: Boolean,
          required: true
       }
    });

    const additionalClasses = computed((): string[]=>{
       //const classNames = props.choice.tags.classNames || [];
       const a = ["animate", "fading", "banana", "red"];
       return [
          ...a
       ];
    });

    const element = ref<HTMLElement | null>(null);
    defineExpose({ element })

</script>

<style lang="scss" scoped>
   .choice{
      opacity: 0.1;
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

