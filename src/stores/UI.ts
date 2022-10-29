import { defineStore } from 'pinia'
import type {UIState} from "../types/types";

export const useStore = defineStore('UI', {
    state: (): UIState => {
        return {
            progress:0,
            color:""
        }
    },
    getters: {
        isAtEnd(state):boolean{
            console.log(state.progress);
            return state.progress === 1;
        },
        bgColor(state):string{
            return state.color;
        }
    },
    actions:{
        setProgress(progress:number){
            this.progress = progress;
        },
        setBg(color:string){
            this.color = color;
        }
    }
})

