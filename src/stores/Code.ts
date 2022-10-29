import { defineStore } from 'pinia'
import type {CodeState, CodeFile} from "../types/types";

export const useStore = defineStore('Code', {
    state: (): CodeState => {
        return {
            files:{
                
            }
        }
    },
    getters: {
        allFiles(state):Record<string, CodeFile>{
            return state.files;
        }
    },
    actions:{
        async load(){
            const fileModule = await import('../code/code.json');
            const fileData = fileModule.default;
            const files = JSON.parse(JSON.stringify(fileData)) as CodeState["files"];
            this.files = files;
        }
    }
})
