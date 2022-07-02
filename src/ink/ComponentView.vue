<template>
    <div class="wrapper" ref="wrapperRef">
        <div class="scroll" ref="scrollRef">
            <div class="scrollable" ref="scrollableRef" :style="scrollableStyle">
                <component
                        v-for="entry in entries"
                        :is="getComponent(entry)"
                        :entry="entry"
                        :visible="visible[entry.id]"
                        @seen="onSeen"
                        @divert="store2.divert"
                        :ref="(el: HasElement) => addChild(entry, el)"
                >
                </component>
            </div>
        </div>
        <button @click="scrollDown" class="more" v-show="canScroll">Scroll</button>
        <input id="as" type="checkbox"/>
        <label for="as">Auto scroll</label>
    </div>
</template>

<script lang="ts" setup>

    import {ref, onMounted, onBeforeUnmount, computed} from "vue";
    import type {Ref} from "vue";
    import { storeToRefs } from 'pinia'
    import {useStore as useCounterStore} from './Counter';
    import {useStore as useStoryStore} from './Story';
    import ChoiceView from "./ChoiceView.vue";
    import ParagraphView from "./ParagraphView.vue";
    import type {Paragraph, Choice, V} from "./types";
    import {isContained} from "./Layout";
    //@ts-ignore
    import easyScroll from 'easy-scroll';

    const props = defineProps({
        msg:  {
            type: String,
            required: true
        }
    });

    type HasElement = {
        element: HTMLElement
    };

    const store = useCounterStore();
    const store2 = useStoryStore();

    const wrapperRef:Ref<HTMLElement | null> = ref<HTMLElement | null>(null);
    const scrollRef:Ref<HTMLElement | null> = ref<HTMLElement | null>(null);
    const scrollableRef:Ref<HTMLElement | null> = ref<HTMLElement | null>(null);
    const visible : Ref<{[key:string]: V}> = ref({});

    const { name, counter } = storeToRefs(store);
    const { entries } = storeToRefs(store2);

    const getComponent = (entry: Paragraph | Choice)=>{
        return entry.type === "paragraph" ? ParagraphView : ChoiceView;
    };

    const onSeen = ()=>{
        store2.continue();
    };

    const minHeight = ref(0);

    const canScroll:Ref<boolean> = ref(false);

    const autoScroll: Ref<Boolean> = ref(true);

    const scrollingActive: Ref<Boolean> = ref(false);

    const testScroll = ()=>{
        updateVis();
        
        const el = scrollRef.value as HTMLElement;
        el.scrollTop += 1;
        requestAnimationFrame(testScroll);
    };

    onMounted(()=>{
        //scrollRef?.value?.addEventListener("scroll", handleScroll);
        //@ts-ignore
        //const resizeObserver = new ResizeObserver( (entries:any) => {
            //for (let entry of entries) {
                //minHeight.value = Math.max(minHeight.value, entry.contentRect.height);
            //}
        //});
        //resizeObserver.observe(scrollableRef.value as HTMLElement);
        requestAnimationFrame(testScroll);

    });

    const scrollDown = ()=>{
        // scroll to the bottom of the
        let ids = Object.keys(children);
        const lastVisibleId:string | undefined =  (ids.slice().reverse()).find(id=>visible.value[id]);
        if(lastVisibleId && children[lastVisibleId]){
            const rect = children[lastVisibleId].getBoundingClientRect();
            scrollingActive.value = true;
            easyScroll({
                'scrollableDomEle': scrollRef.value as HTMLElement,
                'direction': 'bottom',
                'duration':500,
                'easingPreset': 'easeInQuad',
                'scrollAmount': 10,
                'onAnimationCompleteCallback': ()=>{
                    scrollingActive.value = false;
                }
            });
        }
    };

    onBeforeUnmount(() => {
        scrollRef?.value?.removeEventListener("scroll", handleScroll);
    });

    let children: {[key: string] : HTMLElement} = {};

    const addChild = (item: {id: string}, el:HasElement) =>{
        if(!children[item.id] && el.element){
            children[item.id] = el.element;
        }
    };

    const scrollableStyle = computed(()=>{
        return {
            "background":"rgba(200,200,200,0.1)"
        };
    });

    const isElemVisible = (el: HTMLElement): boolean => {
        return isContained(el.getBoundingClientRect(), wrapperRef?.value?.getBoundingClientRect())
    };

    const updateVis = ()=>{
        const el = scrollRef?.value as Element;
        if(el){
            const s = (el.scrollHeight - el.scrollTop - el.clientHeight < 1);
            canScroll.value = !s;
        }
        let i = 0;
        Object.keys(children).forEach((id: string)=>{
            const visibleNow = isElemVisible(children[id]);
            const currentValue = visible.value[id];
            visible.value[id] = {
                visible: visibleNow,
                index:i,
                everVisible:currentValue?.visible || currentValue?.everVisible || visibleNow 
            };
            if(visibleNow){
                i++;
            }
        })
    };

    let st = 0;

    const handleScroll = (e:any) => {
        console.log(e);
        const el = scrollRef?.value as Element;
        console.log(el.scrollTop, st);
        if(el.scrollTop < st){
            //alert("up")
        }
        st = el.scrollTop;
    };

</script>

<style lang="scss" scoped>

    .debug{
        width:450px;
        font-size:smaller;
        font-family:Courier, Arial, sans-serif;
    }

    .wrapper{
        color:#ccc;
        position: absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        .scroll{
            overflow-y: auto;
            position: absolute;
            top: 0;
            height: 100%;
            left: 0;
            width: 100%;
            .scrollable{
                max-width:600px;
                margin:auto;
            }
        }
        .more{
            position: absolute;
            bottom: 0;
            right: 0;
        }
    }
</style>


