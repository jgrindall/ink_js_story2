import type {CheckDefn, CheckerFn, FunctionCallCheckDefn, OutputCheckDefn, VariableValueCheckDefn} from "@/types/types";

const utils_module = {
    f: function (x:any) {
        return x * x + 1;
    }
};

let _id = 0;

const id = ()=>{
    _id++;
    return _id;
}

abstract class Checker{
    protected id:number
    constructor(){
        this.id = id();
    }
    getPythonCode(): string {
        return ``
    }
    abstract check(output: any[], globals:any):boolean
}

class FunctionCallChecker extends Checker{
    private checkerVarName: string;
    constructor(private c:FunctionCallCheckDefn){
        super();
        this.checkerVarName = '__check_function_calls_' + this.id;
    }
    check(output: any[], globals:any): boolean {
        return globals[this.checkerVarName] === this.c.returns;
    }
    getPythonCode(): string {
        return `${this.checkerVarName} = ${this.c.functionname}(${this.c.args.join(", ")})`
    }
}

class OutputChecker extends Checker{
    constructor(private c:OutputCheckDefn){
        super();
    }
    
    check(output: any[], globals:any): boolean {
        return false
    }
    getPythonCode(): string {
        return ``
    }
}

class VariableValueChecker extends Checker{
    constructor(private c:VariableValueCheckDefn){
        super();
    }
    check(output: any[], globals:any): boolean {
        return globals[this.c.variablename] === this.c.value;
    }
}

const getChecker = (c:CheckDefn): Checker=>{
    if(c.type === "functioncall"){
        return new FunctionCallChecker(c);
    }
    else if(c.type === "variablevalue"){
        return new VariableValueChecker(c);
    }
    return new OutputChecker(c);
};

export default class CodeChecker{
    constructor(
        private code:string,
        private outFn: (s:any)=>void,
        private checks?:CheckDefn[]){
    }
    async check():Promise<boolean>{
        const output:any[] = [];
        
        let codeToRun = `import utils_module
${this.code}`;
        
        const loadPyodide = (window as any).loadPyodide;
        let pyodide = await loadPyodide();
        pyodide.registerJsModule("utils_module", utils_module);
        pyodide.globals.set("print", (x:any)=>{
            output.push(x);
            this.outFn(x);
        });
        const checkers = (this.checks || []).map(getChecker)

        checkers.forEach(checker=>{
            codeToRun += `\n${checker.getPythonCode()}\n`
        });
        console.log(codeToRun);
        await pyodide.runPythonAsync(codeToRun);
        const globals = Object.fromEntries(pyodide.globals.toJs());
        const checkerResults = checkers.map(checker=>{
            return checker.check(output, globals)
        })        
        return checkerResults.filter(result => !result).length === 0;
    }
}

