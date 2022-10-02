import { defineStore } from 'pinia'
import {StoryManager} from "./StoryManager";
import type {SaveData, StoryItem, StoryContinueEvent, StoryState} from "../types/types";

let storyManager: StoryManager;

export const useStore = defineStore('Story', {
    state: (): StoryState => {
        return {
            items:[]
        }
    },
    getters: {
        storyItems(state):StoryItem[]{
            return state.items;
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

                            console.log(event.data.tags);

                            const items = event.data.items;
                            const currentText = this.items.filter(e=>e.type !== "choices");
                            const newText = items.filter(e=>e.type !== "choices");
                            const newChoices = items.filter(e=>e.type === "choices");

                            this.items = [
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
            const items = this.items;
            const storyJSON = storyManager.storyToJSON();
            const data:SaveData = {
                items,
                storyJSON
            };
            const dataStr = JSON.stringify(data);
            window.localStorage.setItem("story", dataStr);
        },
        loadJSON(){
            const dataStr:string = window.localStorage.getItem("story") as string;
            const data:SaveData = JSON.parse(dataStr) as SaveData;
            this.items = data.items;
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

