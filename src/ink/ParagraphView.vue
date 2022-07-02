<template>

    <div class="paragraph" :class="additionalClasses" ref="element" :style="additionalStyles">
     <span style="font-family:monospace;font-size:12px;color:#888;">{{visible}}</span>
        <div>
            <div class="content" v-for="content in entry.contents">
                <span class="text" v-if="content.type === 'text'">
                    {{ content.text }}
                </span>
                <img v-else-if="content.type === 'image'" :src="'/images/' + content.value"/>
                <span class="button" v-else-if="content.type==='link'" :data-value="content.value" @click="onClickContents(content)">
                    {{ content.text }}
                </span>
            </div>
        </div>
    </div>

</template>

<script lang="ts" setup>

    import {  computed, ref } from 'vue';
    import type {PropType} from 'vue';
    import type {V, Paragraph, ParagraphLinkContent} from "./types";

    const props = defineProps({
        entry:  {
            type: Object as PropType<Paragraph>,
            required: true
        },
        visible:{
            type: Object as PropType<V>,
            required: false
        }
    })

    const additionalClasses = computed((): string[]=>{
        //const classNames = props.paragraph.tags.classNames || [];
        let a = ["banana", "red"];
        if(props.visible?.everVisible){
            a = ["banana", "red"];
        }
        return a;    
    });

    const additionalStyles = computed(()=>{
        return props.visible?.everVisible? {
            "animation": `fading 1s linear ${(props.entry.index)}s 1 normal forwards`
        } : {};
    });

    const emit = defineEmits(['seen', 'divert', 'disable']);

    const element = ref<HTMLElement | null>(null);

    defineExpose({ element })

    const onClickContents = (content: ParagraphLinkContent)=>{
        emit('disable', props.entry);
        emit('divert', content.index);
    };

</script>

<style lang="scss" scoped>
    .paragraph{
        opacity: 0.5;
        background: transparent;
        position: relative;
        margin:8px;
        .content{
            display: inline;
            background: rgba(100,100,250,0.2);
            line-height: 1.666em;
            width: 100%;
            .button{
                padding-left: 20px;
                padding-right:20px;
            }
            img{
                width: 250px;
                height: 250px;
                background: gold;
                margin:8px;
            }
            .button{
                border:1px dashed #ccc;
                cursor: pointer;
                &:hover{
                    background: #444;
                }
            }
        }
        &.red{
            color: #ffaaaa;
        }
    }
</style>
