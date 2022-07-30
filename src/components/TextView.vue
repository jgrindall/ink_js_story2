<template>

    <div class="text" ref="element">
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

    import { ref } from 'vue';
    import type {PropType} from 'vue';
    import type {Text, TextLinkContent} from "../types/types";

    const props = defineProps({
        item:  {
            type: Object as PropType<Text>,
            required: true
        }
    })

    const emit = defineEmits(['divert', 'disable']);

    const element = ref<HTMLElement | null>(null);

    defineExpose({ element })

    const onClickContents = (content: TextLinkContent)=>{
        //emit('disable', props.entry);
        emit('divert', content.choiceIndex, props.item.id);
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
    }
</style>
