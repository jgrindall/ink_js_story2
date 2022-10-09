<template>
    <div>
        <div ref="elRef" class="code-container" :class="getClass">
            <div class="inner">
                <code-blobs></code-blobs>
                <div ref="code">
                </div>
            </div>
            <button class="run" @click="onRun">RUN</button>
        </div>

        <choices-view
            :item="item.choices"
            :id="item.choices.id"
            :chosen-index="chosenIndex"
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
    import CodeBlobs from './CodeBlobs.vue';

    const code:Ref<HTMLElement | null> = ref<HTMLElement | null>(null);
    const elRef:Ref<HTMLElement | null> = ref(null);

    let editorView: EditorView;

    const props = defineProps({
        item:  {
            type: Object as PropType<Code>,
            required: true
        },
        chosenIndex:{
            type: Number,
            required: true
      }
    });

    const getClass = computed(()=>{
        return {
            "disabled": isDisabled.value
        };
    });

    onMounted(()=>{
        const doc = 'a = 1\ndef my_function():\n\tpass\n\n\n\n';
        
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
        emit('run', props.item.id, elRef.value);
    };

    const emit = defineEmits(['run']);

    const isDisabled = computed(():boolean=>{
        return props.chosenIndex >= 0;
    });

    watch(() => isDisabled.value, () => {
        const nodes:NodeList = (code.value as HTMLElement).querySelectorAll(".cm-content[contenteditable]");
        if(nodes.length === 1){
            const node = nodes.item(0);
            (node as HTMLElement).setAttribute("contenteditable", isDisabled ? "true" : "false");   
        }
    });


</script>

<style lang="scss" scoped>
    $topHeight:24px;
    $padding: 20px;
    .code{
        height: 200px;
        width: 100%;
    }

    .code-container{
        border-radius: 10px;
        position: relative;
        max-width: 1600px;
        height: 300px;
        margin: auto;
        box-sizing: border-box;
        box-shadow: 0 0 20px rgb(0 0 0 / 20%);
        background-color: #272822;

        .inner{
            position: absolute;
            top:calc($padding/2);
            bottom:$padding;
            left:calc($padding/2);
            right:$padding;
            >div:nth-child(2){
                overflow-y: auto;
                width:100%;
                position: absolute;
                height: calc(100% - $topHeight);
                bottom:0;
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
        }
        &.disabled{
            opacity: 0.95;
            filter: grayscale(0.8);
        }
        .blobs{
            height:$topHeight;
            position: absolute;
            top: 0;
            left:6px;
        }
    }
    button.run{
        position: absolute;
        bottom: 0;
        right: 0;
        cursor: pointer;
        font-family: "Bamburgh";
        border: 1px dashed #ccc;
        background: rgba(200, 200, 200, 0.1);
        color: white;
    }
</style>
