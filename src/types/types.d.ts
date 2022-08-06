export type Choice  = {
    text: string,
    choiceIndex:number
}

export type Choices = {
    choices:Choice[]
    id:number,
    type:"choices"
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

export type StoryItem = Paragraph | Choices;

export type StoryState = {
    items: StoryItem[]
}

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

export type SaveData = {
    items:StoryItem[],
    storyJSON:string
};
