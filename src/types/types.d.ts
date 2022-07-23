export type Choice = {
    text: string,
    id:number,
    type:"choice"
}

export type ParagraphTextContent = {
    numChoices: number,
    text:string,
    type: "text"
};

export type ParagraphImageContent = {
    value:string,
    type: "image"
};

export type ParagraphLinkContent = {
    value:string,
    index:number,
    type: "link",
    text:string
};

export type ParagraphContent = ParagraphTextContent | ParagraphImageContent | ParagraphLinkContent;

export type Paragraph = {
    tags: Tags,
    contents: ParagraphContent[],
    id:number,
    status: string,
    type:"paragraph"
}

export type StorySection = Paragraph | Choice;

export type StoryContinueEvent = {
    data:StoryData
};

export type Tags = Partial<{
    effects: string[],
    delay: number
}>;

export type StoryData = {
    items:any[],
    paragraphs:Paragraph[],
    choices:Choice[],
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
