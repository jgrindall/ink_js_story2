<template>
    <div id="scroller" ref="scroller">

        <div class="step" data-step="a"></div>
        <div class="step" data-step="b"></div>
        <div class="step" data-step="c"></div>
        <div class="step" data-step="a"></div>
        <div class="step" data-step="b"></div>
        <div class="step" data-step="c"></div>
        <div class="step" data-step="a"></div>
        <div class="step" data-step="b"></div>
        <div class="step" data-step="c"></div>
        <div class="step" data-step="a"></div>
        <div class="step" data-step="b"></div>
        <div class="step" data-step="c"></div>
        <div class="step" data-step="a"></div>
        <div class="step" data-step="b"></div>
        <div class="step" data-step="c"></div>
        <div class="step" data-step="a"></div>
        <div class="step" data-step="b"></div>
        <div class="step" data-step="c"></div>
    </div>
    
</template>

<script lang="ts" setup>

    import { nextTick, onMounted, ref, computed } from 'vue';
    import type {Ref} from "vue";
    import { last } from 'underscore';
    import scrollama from "scrollama";
    
    const scroller = ref(null);

    onMounted(()=>{
        const scroller = scrollama();

        scroller
            .setup({
                step: ".step",
                offset:0,
                progress: true,
                debug:true
            })
            .onStepEnter((response) => {
                console.log(response)
                // { element, index, direction }
            })
            .onStepExit((response) => {
                console.log(response)
                // { element, index, direction }
            });
    });

</script>

<style scoped lang="scss">
   #scroller{
        background:whitesmoke;
        .step{
            width:500px;
            height:250px;
            background:grey;
            margin:10px;
            padding:10px;
            border:1px solid black;
        }
   }
</style>


