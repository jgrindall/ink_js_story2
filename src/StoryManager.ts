import {Story} from "inkjs";
import {EventEmitter} from "@billjs/event-emitter";
import type {Section, StoryData, IStoryParser} from "./types/types"

//import savedState from "../persistence/savedState.json";
//let s = JSON.stringify(savedState).replace(/\n/g, "");
//s = '{"flows":{"DEFAULT_FLOW":{"callstack":{"threads":[{"callstack":[{"exp":false,"type":0}],"threadIndex":1,"previousContentObject":"cont.0.26"}],"threadCounter":4},"outputStream":["^You can  %choice% or if you decide to get dry as quickly as possible you can  %choice%. CHoose quickly!","\\n"],"choiceThreads":{"2":{"callstack":[{"cPath":"cont.0","idx":19,"exp":false,"type":0}],"threadIndex":2,"previousContentObject":"cont.0.18"},"3":{"callstack":[{"cPath":"cont.0","idx":25,"exp":false,"type":0}],"threadIndex":3,"previousContentObject":"cont.0.24"},"4":{"callstack":[{"cPath":"cont.0","idx":26,"exp":false,"type":0}],"threadIndex":4,"previousContentObject":"cont.0.25"}},"currentChoices":[{"text":"walk","index":0,"originalChoicePath":"cont.0.19","originalThreadIndex":2,"targetPath":"cont.0.c-0"},{"text":"ring","index":1,"originalChoicePath":"cont.0.25","originalThreadIndex":3,"targetPath":"cont.0.c-1"},{"text":"","index":0,"originalChoicePath":"cont.0.26","originalThreadIndex":4,"targetPath":"cont.0.c-2"}]}},"currentFlowName":"DEFAULT_FLOW","variablesState":{},"evalStack":[],"visitCounts":{"":1,"start":1,"start.0.c-0":1,"cont":1},"turnIndices":{},"turnIdx":0,"storySeed":84,"previousRandom":0,"inkSaveVersion":9,"inkFormatVersion":20}';
//let testSavedState = '{"flows":{"DEFAULT_FLOW":{"callstack":{"threads":[{"callstack":[{"exp":false,"type":0}],"threadIndex":1,"previousContentObject":"test1.0.29"}],"threadCounter":6},"outputStream":["^b"],"choiceThreads":{"4":{"callstack":[{"cPath":"test1.0","idx":17,"exp":false,"type":0}],"threadIndex":4,"previousContentObject":"test1.0.16"},"5":{"callstack":[{"cPath":"test1.0","idx":23,"exp":false,"type":0}],"threadIndex":5,"previousContentObject":"test1.0.22"},"6":{"callstack":[{"cPath":"test1.0","idx":29,"exp":false,"type":0}],"threadIndex":6,"previousContentObject":"test1.0.28"}},"currentChoices":[{"text":"end1","index":0,"originalChoicePath":"test1.0.17","originalThreadIndex":4,"targetPath":"test1.0.c-0"},{"text":"end2","index":1,"originalChoicePath":"test1.0.23","originalThreadIndex":5,"targetPath":"test1.0.c-1"},{"text":"end3","index":2,"originalChoicePath":"test1.0.29","originalThreadIndex":6,"targetPath":"test1.0.c-2"}]}},"currentFlowName":"DEFAULT_FLOW","variablesState":{},"evalStack":[],"visitCounts":{"":1,"start":1,"start.0.c-0":1,"test1":1},"turnIndices":{},"turnIdx":0,"storySeed":16,"previousRandom":0,"inkSaveVersion":9,"inkFormatVersion":20}';
//testSavedState = testSavedState.replace(/\n/g, "");


//BindExternalFunctin
//ObserveVariable
//https://klaudiabronowicka.com/blog/2020-12-15-making-a-visual-novel-with-unity-4-5-variables-and-state-management/

export class StoryManager extends EventEmitter {

    private story: InstanceType<typeof Story>;
    private parser: IStoryParser;

    constructor(content: Object, parser:IStoryParser){
        super();
        this.parser = parser;
        this.story = new Story(content);

        this.story.onChoosePathString = (arg1: string, arg2: any[])=>{
           console.log('onChoosePathString', arg1, arg2);
        };
        this.story.onMakeChoice = (arg1: any)=>{
            console.log('onMakeChoice', arg1);
        };
    }
    public choosePath(path: any){
        this.story.ChoosePath(path);
    }
    public storyToJSON(): string{
        return this.story.state.toJson();
    }
    public setStoryJSON(json:string):void{
        this.story.state.LoadJson(json);
    }
    public chooseIndex(index:number){
        this.story.ChooseChoiceIndex(index);
        this.continue();
    }
    public divert(knotName: string){
        this.story.ChoosePathString(knotName);
        this.continue();
    }

    private getContinueStoryData(): StoryData{
        let sections: Section[] = [];
        while(this.story.canContinue){
            const text:string = (this.story.Continue() || "").trim();
            const section:Section = this.parser.parseSection(text)
            sections.push({
                ...section
            });
        }
        sections = this.parser.parseSections(sections, this.story.currentChoices);
        return {
            sections,
            variables: this.story.variablesState
        };
    }
    public continue(){
        let data;
        if(this.story.canContinue){
            data = this.getContinueStoryData();
        }
        this.fire("data", data);
    }
    public setVariable(varName:string, value: any){
        this.story.EvaluateFunction("changeName", [value]);
    }
}
