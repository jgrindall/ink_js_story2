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

const getOverlapPercent = (rect:DOMRect | undefined, containerRect: DOMRect | undefined): number => {
    return 50;
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
    merge,
    id,
    count
}