<template>
    <div class="text" :class="getClass" ref="elRef">
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
    import {ref, computed} from "vue";

    const elRef:Ref<HTMLElement | null> = ref(null);

    const getClass = computed(()=>{
        return {
            "disabled": props.chosenIndex >= 0
        };
    });
    
    const props = defineProps({
        item:  {
            type: Object as PropType<Text>,
            required: true
        },
        chosenIndex:{
            type: Number,
            required: true
        }
    })

    const emit = defineEmits(['divert']);

    const onClickContents = (content: TextLinkContent)=>{
        if(props.chosenIndex === -1){
            emit('divert', props.item.id, content.choiceIndex, elRef.value);
        }
    };

</script>

<style lang="scss" scoped>
    .text{
        background: transparent;
        position: relative;
        padding-left:10px;
        padding-right:10px;
        max-width: 800px;
        margin:auto;
        text-align: center;
        .content{
            display: inline;
            line-height: 1.666em;
            width: 100%;
            .button{
                padding-top:6px;
                padding-bottom: 6px;
                padding-left: 20px;
                padding-right:20px;
                border:1px dashed #ccc;
                cursor: pointer;
                &:hover{
                    background: #444;
                }
            }
        }
        &.disabled{
            opacity: 0.95;
            filter: grayscale(0.8);
        }
    }
</style>
