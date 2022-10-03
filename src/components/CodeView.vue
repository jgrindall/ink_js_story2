<template>

    <div>

        <div ref="elRef" class="code-container" :class="getClass">
            <div ref="code">
            </div>
            <button class="run" @click="onRun">RUN</button>

        </div>

        <choices-view
            :item="item.choices"
            :id="item.choices.id"
        >
        </choices-view>

    </div>

</template>

<script lang="ts" setup>

    import { onMounted, ref, watch, computed } from 'vue';
    import type {PropType, Ref} from 'vue';
    import type {Code} from "../types/types";
    import {python} from "@codemirror/lang-python"
    import {EditorState} from "@codemirror/state"
    import {EditorView, basicSetup} from "codemirror"
    import { myTheme } from './theme';
    import ChoicesView from './ChoicesView.vue';

    const code:Ref<HTMLElement | null> = ref<HTMLElement | null>(null);
    const elRef:Ref<HTMLElement | null> = ref(null);

    let editorView: EditorView;

    const props = defineProps({
        item:  {
            type: Object as PropType<Code>,
            required: true
        },
        last:{
            type:Boolean,
            required:false
        }
    });

    const getClass = computed(()=>{
        return {
            "disabled": !props.last
        };
    });

    onMounted(()=>{
        const doc = 'a = 1\ndef my_function():\n\tpass\n\n\n\n\n';
        
        let change = EditorView.updateListener.of((v)=> {
            console.log(v);
            return false;
        });

        let state = EditorState.create({
            doc: doc,
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
            doc: doc
        });

    });

    const onRun = ()=>{
        emit('run', elRef.value);
    };

    const emit = defineEmits(['run']);

    watch(() => props.last, (newValue: boolean) => {
        const nodes:NodeList = (code.value as HTMLElement).querySelectorAll(".cm-content[contenteditable]");
        if(nodes.length === 1){
            const node = nodes.item(0);
            (node as HTMLElement).setAttribute("contenteditable", newValue ? "true" : "false");
            
        }
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
        box-sizing: border-box;
        >div{
            border-radius: 20px;
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
                font-family:'Bamburgh';
            }
        }
        &.disabled{
            opacity: 0.5;
        }
    }
    button.run{
        position: absolute;
        bottom: 0;
        right: 0;
    }

    .choices{
        background-color: red;
    }

</style>
