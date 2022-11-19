import { SectionType, TextContentType } from "./enums"

export interface IScroll{
    showAll:()=>void,
    scrollToPosition:(top:number)=>void,
    scrollToEnd:()=>void
}

export interface ICanvas{
    update:(a:any)=>void
}

export type Choice  = {
    text: string,
    choiceIndex:number
}

export type Choices = {
    choices:Choice[]
    id:number,
    tags?:any,
    type:SectionType.CHOICES
}

export type TextPlainContent = {
    text:string,
    type: TextContentType.TEXT
};

export type TextLinkContent = {
    value:string,
    choiceIndex:number,
    type: TextContentType.LINK,
    text:string
};

export type TextContent = TextLinkContent | TextPlainContent;

export type Text = {
    contents: TextContent[],
    id:number,
    tags?:any,
    type:SectionType.TEXT
}

export type Image = {
    type:SectionType.IMAGE,
    id:number,
    tags?:any,
    src:string,
    className?:string
};

export type Code = {
    type:SectionType.CODE,
    id:number,
    tags?:any,
    file:string,
    choices:Choices
};

export type Section = Text | Image | Code | Choices;

export type StoryState = {
    sections: Section[],
    choices:any
}

export type UIState = {
    progress:number,
    color:string
}

export type OutputCheckDefn = {
    type: "output",
    match: any
} 

export type FunctionCallCheckDefn = {
    type: "functioncall",
    args:any[],
    functionname: string,
    returns: any
} 

export type VariableValueCheckDefn = {
    type: "variablevalue",
    variablename: string,
    value: any
} 

export type CheckDefn = OutputCheckDefn | FunctionCallCheckDefn | VariableValueCheckDefn

export type CheckerFn = ()=>boolean;

export type CodeFile = {
    contents: string,
    checks?:CheckDefn[]
};

export type CodeState = {
    files: Record<string, CodeFile>   
}

export type StoryContinueEvent = {
    data:StoryData
};

export type StoryData = {
    sections:Section[],
    variables: any;
};

export interface HasId{
    id:number
}

export type SaveData = {
    sections:Section[],
    choices:any,
    storyJSON:string
};

export interface IStoryParser{
    parseSections(sections: Section[], currentChoices:{text:string}[]):Section[]
    parseSection(text: string):Section
};