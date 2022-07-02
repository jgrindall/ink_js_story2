import { defineStore } from 'pinia'
import {StoryManager} from "./StoryManager";
import type {Choice, Paragraph, StoryContinueEvent} from "./types";

let storyManager: StoryManager;

type StoryState = {
    counter:number,
    name:string,
    isAdmin:boolean,
    paragraphs: Paragraph[],
    choices: Choice[]
}

export const useStore = defineStore('Story', {
    state: (): StoryState => {
        return {
            counter: 0,
            name: 'Eduardo',
            isAdmin: true,
            paragraphs: [],
            choices: []
        }
    },
    getters: {
        gCount(state){
            return state.counter * 10
        },
        entries(state){
            return [
                ...state.paragraphs
            ]
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
                            const paragraphs = event.data.paragraphs

                            //console.log("P", paragraph);

                            this.paragraphs = [
                                ...this.paragraphs,
                                ...paragraphs
                            ];
                            this.choices = event.data.choices;
                            console.log(event.data.variables["name"]);
                        });
                        storyManager.continue();
                    }
                });
        },
        divert(index:number){
            storyManager.chooseIndex(index);
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

