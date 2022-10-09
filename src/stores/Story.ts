import { defineStore } from 'pinia'
import {StoryManager} from "../StoryManager";
import type {SaveData, StoryContinueEvent, StoryState, Section} from "../types/types";
import StoryParser from '../StoryParser';

let storyManager: StoryManager;

export const useStore = defineStore('Story', {
    state: (): StoryState => {
        return {
            sections:[],
            choices:{}
        }
    },
    getters: {
        storyItems(state):Section[]{
            return state.sections;
        }
    },
    actions:{
        async load(filename:string = "story/story.ink.json"){
            fetch(filename)
                .then((response) => {
                    return response.text();
                })
                .then((content: Object) => {
                    if(content){
                        storyManager = new StoryManager(content, new StoryParser());
                        storyManager.on("data", (event:StoryContinueEvent)=>{
                            const sections = event.data.sections;
                            const newText = sections.filter(e=>e.type !== "choices");
                            const newChoices = sections.filter(e=>e.type === "choices");
                            this.sections = [
                                ...this.sections,
                                ...newText,
                                ...newChoices
                            ];
                        });
                        storyManager.continue();
                    }
                });
        },
        clearJSON(){
            window.localStorage.removeItem("story");
        },
        saveJSON(){
            const data:SaveData = {
                sections: this.sections,
                choices:{

                },
                storyJSON: storyManager.storyToJSON()
            };
            const dataStr = JSON.stringify(data);
            window.localStorage.setItem("story", dataStr);
        },
        loadJSON(){
            const dataStr:string = window.localStorage.getItem("story") as string;
            const data:SaveData = JSON.parse(dataStr) as SaveData;
            this.sections = data.sections;
            storyManager.setStoryJSON(data.storyJSON);
        },
        divert(itemId:string, choiceIndex:number){
            this.choices[itemId] = choiceIndex;
            storyManager.chooseIndex(choiceIndex);
        },
        continue(){
            storyManager.continue();
        },
        setVariable(varName:string, value: any){
            storyManager.setVariable(varName, value);
        }
    }
})

