<template>
    <div>
        <div ref="elRef" class="code-container" :class="getClass">
            <div class="inner">
                <code-blobs></code-blobs>
                <div ref="code"></div>
                <div class="codeOutput">{{codeOutput}}</div>
            </div>
            <van-button :loading="processing" loading-text="Running..." v-if="!isDisabled" class="run" :disabled="isDisabled" @click="onRun">
                Run
            </van-button>
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
    import type {Code, CodeFile, CheckDefn} from "../types/types";
    import {python} from "@codemirror/lang-python"
    import {EditorState, Transaction} from "@codemirror/state"
    import {EditorView, basicSetup} from "codemirror"
    import { myTheme } from './theme';
    import ChoicesView from './ChoicesView.vue';
    import CodeBlobs from './CodeBlobs.vue';
    import { storeToRefs } from 'pinia'
    import {useStore as useCodeStore} from '@/stores/Code';
    import {useStore as useUIStore} from '@/stores/UI';
    import CodeChecker from '@/code/CodeChecker';
    const codeStore = useCodeStore();
    const codeStoreRefs = storeToRefs(codeStore);
    
    const uiStore = useUIStore();
    
    const code:Ref<HTMLElement | null> = ref<HTMLElement | null>(null);
    const elRef:Ref<HTMLElement | null> = ref(null);
    const processing: Ref<boolean> = ref(false);

    let editorView: EditorView;

    const codeOutput:Ref<string> = ref("");

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

    const fileContents = computed(():string=>{
        const codeFile:CodeFile = (codeStoreRefs.allFiles.value || {})[props.item.file];
        return codeFile?.contents || "";
    });

    const fileChecks = computed(():CheckDefn[]=>{
        const codeFile:CodeFile = (codeStoreRefs.allFiles.value || {})[props.item.file];
        return codeFile?.checks || [];
    });

    watch(() => fileContents.value, () => {
        const doc = editorView.state.doc;
        if(fileContents.value && doc.length === 0){
            editorView.dispatch({
                changes: {
                    from: 0,
                    to: 0,
                    insert: fileContents.value
                }
            });
        }
    });

    const filterDisabled = () =>{
        return EditorState.transactionFilter.of((tr: Transaction) => {
            if(isDisabled.value){
                return []
            }
            return tr;
        });
    }

    let changeHandler = () => {
        return EditorView.updateListener.of((v)=> {
            return false;
        });
    }
    
    onMounted(async ()=>{
        const doc = "";
        let change = EditorView.updateListener.of((v)=> {
            return false;
        });

        let state = EditorState.create({
            doc: doc,
            extensions: [
                basicSetup,
                python(),
                myTheme,
                changeHandler(),
                filterDisabled()
            ]
        });

        editorView = new EditorView({
            state: state,
            parent: code.value as HTMLElement,
            doc: doc
        });

    });

    const onRun = async ()=>{
        if(isDisabled.value){
            return;
        }
        const doc = editorView.state.doc.toString();       
        const checker = new CodeChecker(doc, (s:any)=>{
            codeOutput.value += "" + s + '\n';
        }, fileChecks.value);
        uiStore.setLoading(true)
        processing.value = true;
        await checker.init();
        uiStore.setLoading(false)
        const success = await checker.check();
        processing.value = false;
        emit('run', props.item.id, elRef.value, success);
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
    $topHeight:30px;
    $bottomHeight: 120px;
    $padding: 20px;
    $totalHeight:500px;
    .code{
        height: 300px;
        width: 100%;
    }
    .codeOutput{
        background: rgba(200,200,200,0.2);
        height: $bottomHeight;
        position: absolute;
        bottom:0;
        left:0;
        width:100%;
        font-family: monospace, 'Courier New', Courier;
    }
    .choices{
        display: none;
    }

    .code-container{
        border-radius: 10px;
        position: relative;
        max-width: 1600px;
        height: $totalHeight;
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
                height: calc(100% - $topHeight - $bottomHeight);
                bottom:$bottomHeight;
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
        font-family: "Leander";
        border: 1px dashed #ccc;
        background: rgba(200, 200, 200, 0.1);
        color: white;
    }
</style>
