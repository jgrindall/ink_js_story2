import { defineStore } from 'pinia'
import {StoryManager} from "./StoryManager";
import type {Choices, StoryItem, StoryContinueEvent, StoryState} from "../types/types";

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
                            const items = event.data.items;

                            console.log(this.items, items);

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
        getJSON(){
            storyManager.getJSON();
        },
        loadJSON(){
            storyManager.loadJSON();
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

