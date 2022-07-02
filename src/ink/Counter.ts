import { defineStore } from 'pinia'

type CState = {
    counter:number,
    name:string,
    isAdmin:boolean
}

export const useStore = defineStore('Counter', {
    state: (): CState => {
        return {
            counter: 0,
            name: 'Eduardo',
            isAdmin: true,
        }
    },
    getters: {
        gCount(state){
            return state.counter * 10
        }
    },
    actions:{
        increment(){
            this.counter++
        }
    }
})
