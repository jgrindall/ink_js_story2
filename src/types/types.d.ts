export type Choice = {
    text: string,
    id:number,
    choiceIndex:number,
    type:"choice"
}

export type TextPlainContent = {
    numChoices: number,
    text:string,
    type: "text"
};

export type TextLinkContent = {
    value:string,
    choiceIndex:number,
    type: "link",
    text:string
};

export type TextContent = TextLinkContent | TextPlainContent;

export type Text = {
    tags: Tags,
    contents: TextContent[],
    id:number,
    type:"text"
}

export type Image = {
    type:"image",
    id:number,
    tags:Tags,
    src:string
};

export type Paragraph = Text | Image;

export type StoryItem = Paragraph | Choice;

export type StoryContinueEvent = {
    data:StoryData
};

export type Tags = Partial<{
    effects: string[],
    delay: number
}>;

export type StoryData = {
    items:StoryItem[],
    variables: any;
};

export type Item = {
    id:number,
    name:string,
    email:string
}

export interface HasId{
    id:number
}
