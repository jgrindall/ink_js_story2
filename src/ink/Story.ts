import { defineStore } from 'pinia'
import {StoryManager} from "./StoryManager";
import type {Choice, Paragraph, StoryContinueEvent} from "../types/types";

let storyManager: StoryManager;

type StoryState = {
    counter:number,
    name:string,
    isAdmin:boolean,
    paragraphs: Paragraph[],
    choices: Choice[],
    items: any[]
}

export const useStore = defineStore('Story', {
    state: (): StoryState => {
        return {
            counter: 0,
            name: 'Eduardo',
            isAdmin: true,
            paragraphs: [],
            choices: [],
            items:[]
        }
    },
    getters: {
        storyItems(state){
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
                            this.items = [
                                ...(this.items || []),
                                ...items
                            ];
                        });
                        storyManager.continue();
                    }
                });
        },
        divert(choiceIndex:number){
            storyManager.chooseIndex(choiceIndex);
        },
        continue(){
            storyManager.continue();
        },
        setVariable(varName:string, value: any){
            storyManager.setVariable(varName, value);
        },
        choose(choice: Choice){
            const ids = this.choices.map( (c: Choice) =>c.id);
            storyManager.chooseIndex(ids.indexOf(choice.id))
        },
        increment(){
            this.counter++
        }
    }
})

