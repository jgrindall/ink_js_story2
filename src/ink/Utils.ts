import { receiveMessageOnPort } from "worker_threads";

const merge = <T>(arr:T[]) : T => {
    return arr.reduce((memo: T, current: T)=>{
        return {
            ...current,
            ...memo
        };
    }, {} as T)
};

const isContained = (rect:DOMRect | undefined, containerRect: DOMRect | undefined): boolean => {
    return !!(containerRect && rect && rect.top >= containerRect.top && rect.bottom <= containerRect.bottom);
};

const isContainedIn = (container: HTMLElement)=>{
    const containerRect = container.getBoundingClientRect()
    return (el:HTMLElement)=>{
        return isContained(el.getBoundingClientRect(), containerRect);
    };
};

const getOverlapPercent = (rect:DOMRect, containerRect: DOMRect): number => {
    const overlap = getOverlap(rect, containerRect);
    return overlap ? 100 * overlap?.height / rect?.height : 0;
}

const getOverlap = (rectA:DOMRect, rectB: DOMRect): {width:number, height:number} | undefined => {
    const x0 = Math.max(rectA.left, rectB.left);
    const x1 = Math.min(rectA.right, rectB.right);
    const y0 = Math.max(rectA.top, rectB.top);
    const y1 = Math.min(rectA.bottom, rectB.bottom);
    if(x0 < x1 && y0 < y1){
        return {
            width:x1 - x0,
            height:y1 - y0
        };
    }
    return undefined;
}

let _id = 0;

const id = ()=>{
    _id++;
    return _id;
};

const count = (s:string, needle:string) => {
    return s.split(needle).length - 1;
};

export {
    isContained,
    isContainedIn,
    getOverlapPercent,
    getOverlap,
    merge,
    id,
    count
}