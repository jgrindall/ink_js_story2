interface Rect{
    top:number,
    left:number,
    right:number,
    width:number,
    height:number,
    bottom:number
}

const merge = <T>(arr:T[]) : T => {
    return arr.reduce((memo: T, current: T)=>{
        return {
            ...current,
            ...memo
        };
    }, {} as T)
};

const isContained = (rect:Rect | undefined, containerRect: Rect | undefined): boolean => {
    return !!(containerRect && rect && rect.top >= containerRect.top && rect.bottom <= containerRect.bottom);
};

const isContainedIn = (container: HTMLElement)=>{
    const containerRect = container.getBoundingClientRect()
    return (el:HTMLElement)=>{
        return isContained(el.getBoundingClientRect(), containerRect);
    };
};

const getOverlapPercent = (rect:Rect, containerRect: Rect, options :{x:boolean, y:boolean} = {x:false, y:true}): number => {
    const overlap = getOverlap(rect, containerRect);
    let numerator:number;
    let denominator:number;
    if(overlap){
        if(options.x && options.y){
            numerator = overlap.height * overlap.width;
            denominator = rect.width * rect.height;
        }
        else if(options.x && !options.y){
            numerator = overlap.width;
            denominator = rect.width;
        }
        else {
            numerator = overlap.height;
            denominator = rect.height;
        }
        return 100*numerator/denominator;
    }
    return 0;
}

const getOverlapPercentEl = (el:HTMLElement, container: HTMLElement):number =>{
    return getOverlapPercent(el.getBoundingClientRect(), container.getBoundingClientRect());
};

const getOverlap = (rectA:Rect, rectB: Rect): {width:number, height:number} | undefined => {
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
    getOverlapPercentEl,
    getOverlap,
    merge,
    id,
    count
}