import { defineStore } from 'pinia'
import type {UIState} from "../types/types";

export const useStore = defineStore('UI', {
    state: (): UIState => {
        return {
            progress:0,
            color:"",
            loading: false
        }
    },
    getters: {
        isAtEnd(state):boolean{
            return state.progress === 1;
        },
        bgColor(state):string{
            return state.color;
        },
        isLoading(state):boolean{
            console.log(state);
            return state.loading
        }
    },
    actions:{
        setLoading(loading:boolean){
            this.loading = loading;   
        },
        setProgress(progress:number){
            this.progress = progress;
        },
        setBg(color:string){
            this.color = color;
        }
    }
})

