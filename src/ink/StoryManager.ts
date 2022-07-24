import {Story} from "inkjs";
import {EventEmitter} from "@billjs/event-emitter";
import type {Choice, Paragraph, Image, ParagraphContent, StoryData, Tags} from "../types/types";
import {merge, id, count} from "./Utils";
import {last} from "underscore";

const choiceSeparator = "%choice%";

const tagsToJSON = (tags: string[] | null)=>{
    const tagsArray:Tags[] = (tags || []).map((s: string) => JSON.parse(s) as Tags);
    return merge(tagsArray);
};

const replace = (p:Paragraph, choices:any[]): boolean => {
    const paragraphContent:ParagraphContent = last(p.contents) as ParagraphContent;
    if(paragraphContent?.type !== "text" || paragraphContent.numChoices === 0){
        return false;
    }
    else if(paragraphContent.numChoices != choices.length){
        console.log(paragraphContent, choices);
        throw new Error("choices mismatch");
    }
    const content = paragraphContent.text.split(choiceSeparator);
    p.contents.pop();
    content.forEach( (c, i)=>{
        p.contents.push({
            type: "text",
            text: c,
            numChoices: 0
        });
        const choice = choices[i];
        if(choice){
            p.contents.push({
                type: "link",
                index: i,
                text: choice.text,
                value:""
            });
        }
    });
    return true;
};


//BindExternalFunctin
//ObserveVariable
//https://klaudiabronowicka.com/blog/2020-12-15-making-a-visual-novel-with-unity-4-5-variables-and-state-management/

export class StoryManager extends EventEmitter {

    private story: InstanceType<typeof Story>;

    constructor(content: Object){
        super();
        this.story = new Story(content);
        this.story.onChoosePathString = (arg1: string, arg2: any[])=>{
           console.log('onChoosePathString', arg1, arg2);
        };
        this.story.onMakeChoice = (arg1: C)=>{
            console.log('onMakeChoice', arg1);
        };
    }
    public choosePath(path: any){
        this.story.ChoosePath(path);
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
        console.log("TEXT", text);
        try{
            // try and parse JSON
            const parsed = JSON.parse(text);
            console.log(parsed);
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
        const lastParagraph:Paragraph = last(paragraphs) as Paragraph;
        let currentChoices = this.story.currentChoices;
        let choices: Choice[] = [];
        
        /*
        * optionally we can specify that the choices should be inline in
        * the last paragraph rather than a list of separate choices
        */
        if(lastParagraph && !replace(lastParagraph, currentChoices)){
            choices = currentChoices.map((choice: {text: string}) => {
                return {
                    text: choice.text,
                    type: "choice",
                    id: id()
                };
            });
        }
        const variables = this.story.variablesState;
        const items = [
            ...paragraphs,
            ...choices
        ];
        
        return {
            items,
            variables
        };
    }
    public continue(){
        if(this.story.canContinue){
            this.fire("data", this.getContinueStoryData());
        }
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