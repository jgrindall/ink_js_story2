<template>
    <div class="text" ref="elRef">
        <div class="content" v-for="content in item.contents">
            <span
                class="text"
                v-if="content.type === 'text'"
            >
                {{ content.text }}
            </span>
            <span 
                class="button"
                v-else-if="content.type==='link'"
                @click="onClickContents(content)"
            >
                {{ content.text }}
            </span>
        </div>
    </div>

</template>

<script lang="ts" setup>

    import type {PropType, Ref} from 'vue';
    import type {Text, TextLinkContent} from "../types/types";
    import {ref} from "vue";

    const elRef:Ref<HTMLElement | null> = ref(null);

    const props = defineProps({
        item:  {
            type: Object as PropType<Text>,
            required: true
        },
        last:{
            type:Boolean,
            required:false
        }
    })

    const emit = defineEmits(['divert']);

    const onClickContents = (content: TextLinkContent)=>{
        if(props.last){
            emit('divert', content.choiceIndex, elRef.value);
        }
    };

</script>

<style lang="scss" scoped>
    .text{
        background: transparent;
        position: relative;
        margin:10px;
        .content{
            display: inline;
            background: rgba(100,100,250,0.2);
            line-height: 1.666em;
            width: 100%;
            .button{
                padding-left: 20px;
                padding-right:20px;
                border:1px dashed #ccc;
                cursor: pointer;
                &:hover{
                    background: #444;
                }
            }
        }
        &:not(.last){
            .button{
                background-color: black !important;
                pointer-events: none;
                opacity: 0.2;
            }
        }
    }
</style>
