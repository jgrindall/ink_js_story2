import {ref, onMounted} from "vue"
import type {Ref} from "vue";

function useCounter(num:number){
    const counter:Ref<number> = ref(num);

    onMounted(()=>{
        alert('mounted')
    })

    function add(){
        counter.value += 2;
    }

    function get(){
        return counter.value;
    }

    return {
        add, get
    }
}

export default useCounter;