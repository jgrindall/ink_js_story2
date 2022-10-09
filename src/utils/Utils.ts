import { uniq } from 'underscore';

let _id = 0;

const id = ()=>{
    _id++;
    return _id;
};

const count = (s:string, needle:string) => {
    return s.split(needle).length - 1;
};

const getAllNodes = (mutations: MutationRecord[], filter:(mutation:MutationRecord)=>NodeList)=>{
    const els:HTMLElement[] = [] as HTMLElement[];
    mutations.forEach((mutation:MutationRecord)=>{
        if(mutation.type === "childList"){
            filter(mutation).forEach((n:Node)=>{
                els.push(n as HTMLElement);
            })
        }
    });
    return uniq(els);
}

const getAddedNodes = (mutations: MutationRecord[]) : HTMLElement[]=>{
    return getAllNodes(mutations, (mutation:MutationRecord)=>mutation.addedNodes);
};

const getRemovedNodes = (mutations: MutationRecord[]) : HTMLElement[]=>{
    return getAllNodes(mutations, (mutation:MutationRecord)=>mutation.removedNodes);
};

export {
    id,
    count,
    getAddedNodes,
    getRemovedNodes
}