<template>
    <div class="code-container">
        <div ref="code">
          
        </div>
        
    </div>

</template>

<script lang="ts" setup>

    import { onMounted, ref } from 'vue';
    import type {PropType, Ref} from 'vue';
    import type {Code} from "../types/types";
    import {python} from "@codemirror/lang-python"
    import {EditorState} from "@codemirror/state"
    import {EditorView, basicSetup} from "codemirror"
    import { myTheme } from './theme';
    //import {javascript} from "@codemirror/lang-javascript"

    const code:Ref<HTMLElement | null> = ref<HTMLElement | null>(null);

    let editorView: EditorView;

    const props = defineProps({
        item:  {
            type: Object as PropType<Code>,
            required: true
        }
    })

    onMounted(()=>{

        
        let change = EditorView.updateListener.of((v)=> {
            console.log(v);
        });

        let state = EditorState.create({
            doc:"a = 1\ndef my_function():\n\tpass",
            extensions: [
                basicSetup,
                python(),
                myTheme,
                change   
            ]
        });

        editorView = new EditorView({
            state: state,
            parent: code.value as HTMLElement,
            doc: "a = 1\ndef my_function():\n\tpass"
        });

    });

</script>

<style lang="scss" scoped>
    .code-container{
        border-radius: 20px;
        border:10px solid black;
        position: relative;
        height: 300px;
        width: 100%;
        max-width: 1600px;
        margin: auto;
        >div{
            overflow-y: auto;
            width:100%;
            position: absolute;
            height: 100%;
            top:0;
            left:0;
            .cm-editor{
                position: absolute;
                top:0;
                left:0;
                width:100%;
                height: 100%;
            }
        }
    }

</style>
