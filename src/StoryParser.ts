import {last} from "underscore";
import {count} from "./utils/Utils";
import type {Section, Text, TextContent, Code, Choices, Image, IStoryParser} from "./types/types"
import {SectionType, TextContentType} from "./types/enums";
import {id} from "./utils/Utils";

const choiceSeparator = "%choice%";
const tagsSeparator = /^(.*)%tags([^%]*)%$/;

const extractTagsFromText = (text: string) : {text:string, tags?:any}=>{
    const matches = text.match(tagsSeparator);
    if(matches){
        return {
            text: matches[1],
            tags:JSON.parse(matches[2])
        }
    }
    return {
        text
    };
};

export const replaceAll = (section:Section, choices:Choices): boolean=>{
    if(section.type === SectionType.TEXT){
        return replaceText(section, choices);
    }
    else if(section.type === SectionType.CODE){
        return replaceCode(section, choices);
    }
    return false;
};

const replaceCode = (code:Code, choices:Choices): boolean => {
    if(!choices || choices.choices.length !== 2){
        throw new Error("choices mismatch");
    }
    code.choices = choices;
    return true;
};

/**
 * Insert the last choices into the text if possible
 * @param text 
 * @param choices 
 * @returns 
 */
const replaceText = (text:Text, choices:Choices): boolean => {
    const _choices = choices.choices;
    const lastContent:TextContent = last(text.contents) as TextContent;
    const numChoices = count(lastContent.text, choiceSeparator)
    if(lastContent?.type !== TextContentType.TEXT || numChoices === 0){
        return false;
    }
    else if(numChoices != _choices.length){
        throw new Error("choices mismatch");
    }
    const content = lastContent.text.split(choiceSeparator);
    text.contents.pop();
    content.forEach( (c, i)=>{
        text.contents.push({
            type: TextContentType.TEXT,
            text: c
        });
        const choice = _choices[i];
        if(choice){
            text.contents.push({
                type: TextContentType.LINK,
                choiceIndex: i,
                text: choice.text,
                value:""
            });
        }
    });
    return true;
};

const makeImage = (json: any):Image=>{
    return {
        type:SectionType.IMAGE,
        src:json.src,
        id: id(),
        className:json.class
    }
}

const makeCode = (json: any): Code=>{
    return {
        type:SectionType.CODE,
        file:json.file,
        // code has a hidden choices element
        choices:{
            id: id(),
            type:SectionType.CHOICES,
            choices:[]
        },
        id: id()
    }
}

class StoryParser implements IStoryParser{
    
    private json:any = {};

    constructor(){
        this.addJSONTag(SectionType.CODE, makeCode);
        this.addJSONTag(SectionType.IMAGE, makeImage);
    }

    private parseJSON(json:any):Section{
        const action = this.json[json.type];
        if(action){
            return action(json);
        }
        throw new Error("type not found:" + json.type);
    }

    private addJSONTag(type:SectionType, action:(json:any)=>Section){
        this.json[type] = action;
    }

    /**
     * Optionally we can specify that the choices should be inline in
       the last paragraph rather than a list of separate choices.
       We also inject a true/false choices element into any code element
     * @param sections 
     * @param currentChoices 
     * @returns 
     */
    public parseSections(sections: Section[], currentChoices:{text:string, choiceIndex:number}[]):Section[]{
        const lastSection:Section = last(sections) as Section;

        const choices = currentChoices.map((choice: {text: string}, choiceIndex:number) => {
            return {
                text: choice.text,
                choiceIndex
            };
        });
        const choicesSection: Choices = {
            type:SectionType.CHOICES,
            id: id(),
            choices
        };
        const replacedChoices = replaceAll(lastSection, choicesSection);
        if(!replacedChoices){
            sections.push(choicesSection);
        }
        return sections;
    }

    /**
     * Convert a string into a Section
     * @param text 
     * @returns 
     */
    public parseSection(text: string):Section{
        try{
            // try and parse JSON
            const json = JSON.parse(text);
            return this.parseJSON(json)
        }
        catch(e){
            //fail, it is a normal ink element
        }
        const extracted = extractTagsFromText(text);
        return {
            type:SectionType.TEXT,
            tags: extracted.tags,
            contents:[{
                type: TextContentType.TEXT,
                text: extracted.text
            }],
            id: id()
        }
    }
}

export default StoryParser;

