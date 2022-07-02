export const merge = <T>(arr:T[]) : T => {
    return arr.reduce((memo: T, current: T)=>{
        return {
            ...current,
            ...memo
        };
    }, {} as T)
};