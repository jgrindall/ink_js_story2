import {Story} from "inkjs";
import {EventEmitter} from "@billjs/event-emitter";
import type {Choices, Paragraph, StoryData, StoryItem} from "../types/types";
import {id, count} from "../utils/Utils";
import {last} from "underscore";
import savedState from "../persistence/savedState.json";
import {tagsToJSON, choiceSeparator, replace} from "../utils/StoryUtils";

let s = JSON.stringify(savedState).replace(/\n/g, "");

s = '{"flows":{"DEFAULT_FLOW":{"callstack":{"threads":[{"callstack":[{"exp":false,"type":0}],"threadIndex":1,"previousContentObject":"cont.0.26"}],"threadCounter":4},"outputStream":["^You can  %choice% or if you decide to get dry as quickly as possible you can  %choice%. CHoose quickly!","\\n"],"choiceThreads":{"2":{"callstack":[{"cPath":"cont.0","idx":19,"exp":false,"type":0}],"threadIndex":2,"previousContentObject":"cont.0.18"},"3":{"callstack":[{"cPath":"cont.0","idx":25,"exp":false,"type":0}],"threadIndex":3,"previousContentObject":"cont.0.24"},"4":{"callstack":[{"cPath":"cont.0","idx":26,"exp":false,"type":0}],"threadIndex":4,"previousContentObject":"cont.0.25"}},"currentChoices":[{"text":"walk","index":0,"originalChoicePath":"cont.0.19","originalThreadIndex":2,"targetPath":"cont.0.c-0"},{"text":"ring","index":1,"originalChoicePath":"cont.0.25","originalThreadIndex":3,"targetPath":"cont.0.c-1"},{"text":"","index":0,"originalChoicePath":"cont.0.26","originalThreadIndex":4,"targetPath":"cont.0.c-2"}]}},"currentFlowName":"DEFAULT_FLOW","variablesState":{},"evalStack":[],"visitCounts":{"":1,"start":1,"start.0.c-0":1,"cont":1},"turnIndices":{},"turnIdx":0,"storySeed":84,"previousRandom":0,"inkSaveVersion":9,"inkFormatVersion":20}';

let testSavedState = '{"flows":{"DEFAULT_FLOW":{"callstack":{"threads":[{"callstack":[{"exp":false,"type":0}],"threadIndex":1,"previousContentObject":"test1.0.29"}],"threadCounter":6},"outputStream":["^b"],"choiceThreads":{"4":{"callstack":[{"cPath":"test1.0","idx":17,"exp":false,"type":0}],"threadIndex":4,"previousContentObject":"test1.0.16"},"5":{"callstack":[{"cPath":"test1.0","idx":23,"exp":false,"type":0}],"threadIndex":5,"previousContentObject":"test1.0.22"},"6":{"callstack":[{"cPath":"test1.0","idx":29,"exp":false,"type":0}],"threadIndex":6,"previousContentObject":"test1.0.28"}},"currentChoices":[{"text":"end1","index":0,"originalChoicePath":"test1.0.17","originalThreadIndex":4,"targetPath":"test1.0.c-0"},{"text":"end2","index":1,"originalChoicePath":"test1.0.23","originalThreadIndex":5,"targetPath":"test1.0.c-1"},{"text":"end3","index":2,"originalChoicePath":"test1.0.29","originalThreadIndex":6,"targetPath":"test1.0.c-2"}]}},"currentFlowName":"DEFAULT_FLOW","variablesState":{},"evalStack":[],"visitCounts":{"":1,"start":1,"start.0.c-0":1,"test1":1},"turnIndices":{},"turnIdx":0,"storySeed":16,"previousRandom":0,"inkSaveVersion":9,"inkFormatVersion":20}';

testSavedState = testSavedState.replace(/\n/g, "");

//BindExternalFunctin
//ObserveVariable
//https://klaudiabronowicka.com/blog/2020-12-15-making-a-visual-novel-with-unity-4-5-variables-and-state-management/

export class StoryManager extends EventEmitter {

    private story: InstanceType<typeof Story>;

    constructor(content: Object){
        super();
        this.story = new Story(content);

        //this.story.state.LoadJson(testSavedState);

        /*console.log(this.story.currentText);
        console.log(this.story.currentChoices);

        setInterval(()=>{
            console.log(this.story.currentText);
            console.log(this.story.currentChoices);
        }, 2000)*/

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
    public loadJSON(){
        const s = JSON.stringify(savedState);
        this.story.state.LoadJson(s);
    }
    public getJSON(){
        const s1:string = this.story.state.toJson();
        console.log(s1);
    }
    public chooseIndex(index:number){
        this.story.ChooseChoiceIndex(index);
        this.continue();
    }
    public divert(knotName: string){
        this.story.ChoosePathString(knotName);
        this.continue();
    }
    private getCurrentParagraph(): Paragraph{
        const text:string = (this.story.Continue() || "").trim();
        try{
            // try and parse JSON
            const parsed = JSON.parse(text);
            return {
                type:"image",
                src:parsed.src,
                tags: tagsToJSON(this.story.currentTags),
                id: id()
            };
        }
        catch(e){
            //fail, it is a normal ink element
        }
        return {
            type:"text",
            tags: tagsToJSON(this.story.currentTags),
            contents:[{
                type: "text",
                text: text,
                numChoices: count(text, choiceSeparator)
            }],
            id: id()
        }
    }
    private getContinueStoryData(): StoryData{
        const paragraphs: Paragraph[] = [];
        while(this.story.canContinue){
            paragraphs.push({
                ...this.getCurrentParagraph()
            });
        }

        let items:StoryItem[] = [
            ...paragraphs
        ];

        const lastParagraph:Paragraph = last(paragraphs) as Paragraph;
        let currentChoices = this.story.currentChoices;
        
        /*
        * optionally we can specify that the choices should be inline in
        * the last paragraph rather than a list of separate choices
        */

        if(lastParagraph && lastParagraph.type === "text" && !replace(lastParagraph, currentChoices)){
            const choices = currentChoices.map((choice: {text: string}, choiceIndex:number) => {
                return {
                    text: choice.text || "choice",
                    choiceIndex
                };
            });
            items.push({
                type:"choices",
                id: id(),
                choices
            });
        }
        
        return {
            items,
            variables: this.story.variablesState
        };
    }
    public continue(){
        const currentText = this.story.currentText;
        const currentChoices = this.story.currentChoices;
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







/**

 VAR x = 20
 VAR y = 20
 VAR water = 20

 The desert was vast. My steps were erased soon after I placed them, but I had to continue. I knew that with every movement on the map, I would drink water — and I was quickly running out.
 -> Choices

 === Choices ===

 { water < 1: -> Out_Of_Water }

 + [Keep going]
 -> Choices

 === Out_Of_Water ===
 I shook my canteen, but could tell it was empty. This… this was the last step in my journey.
 -> DONE

 === function goNorth() ===
 { setY(y – 1) }
 { drinkWater() }

 === function goSouth() ===
 { setY(y + 1) }
 { drinkWater() }

 === function goWest() ===
 { setX(x – 1) }
 { drinkWater() }

 === function goEast() ===
 { setX(x + 1) }
 { drinkWater() }

 === function setX(newX) ===
 {

    – newX > 100:
        ~ x = 100
    – newX < 0:
        ~ x = 0
    – else:
        ~ x = newX
}

 === function setY(newY) ===
 {
    – newY > 100:
        ~ y = 100
    – newY < 0:
        ~ y = 0
    – else:
        ~ y = newY
}

 === function currentPosition() ===
 (Currently at {x} and {y}.)

 === function drinkWater() ===
 ~ water = water – 1

 === function currentWater() ===
 (Remaining water {water})

 **/