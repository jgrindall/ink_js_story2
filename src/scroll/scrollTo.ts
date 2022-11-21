import {ref, onMounted} from "vue"
import type {Ref} from "vue";
import easyScroll from 'easy-scroll';

export default function useScrollTo(){

    const scrollingActive: Ref<Boolean> = ref(false);

    /**
    * scroll to the bottom
    */
   const scrollToEnd = (el: HTMLElement, scrollSpeed:number)=>{
       const top = el.scrollHeight - el.offsetHeight;
       scrollToPosition(el, top, scrollSpeed);
   };

   /**
    * Scroll to a specific position
    * @param {number} top
    */
   const scrollToPosition = (el: HTMLElement, top: number, scrollSpeed:number)=>{
       if(scrollingActive.value || !el){
           // already scrolling
           return;
       }
       scrollingActive.value = true;
       easyScroll({
           scrollableDomEle:el,
           direction: 'bottom',
           duration:scrollSpeed,
           easingPreset: 'easeInQuad',
           scrollAmount: top - el.scrollTop,
           onAnimationCompleteCallback: ()=>{
               setTimeout(()=>{
                   scrollingActive.value = false;
               });
           }
       });
   };


    return {
        scrollToEnd,
        scrollToPosition
    }
}
