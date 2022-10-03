import { defineStore } from 'pinia'
import {StoryManager} from "./StoryManager";
import type {SaveData, StoryContinueEvent, StoryState, Section} from "../types/types";

let storyManager: StoryManager;

export const useStore = defineStore('Story', {
    state: (): StoryState => {
        return {
            sections:[]
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
                        storyManager = new StoryManager(content);
                        storyManager.on("data", (event:StoryContinueEvent)=>{

                            console.log("tags", event.data.tags);

                            const items = event.data.sections;
                            const currentText = this.sections.filter(e=>e.type !== "choices");
                            const newText = items.filter(e=>e.type !== "choices");
                            const newChoices = items.filter(e=>e.type === "choices");

                            this.sections = [
                                ...currentText,
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
            const sections = this.sections;
            const storyJSON = storyManager.storyToJSON();
            const data:SaveData = {
                sections,
                storyJSON
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
        divert(choiceIndex:number){
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

