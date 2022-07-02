export type Choice = {
    text: string,
    id:string,
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
    id:string,
    index:number,
    status: string,
    type:"paragraph"
}

export type StoryContinueEvent = {
    data:StoryData
};

export type Tags = Partial<{
    effects: string[],
    delay: number
}>;

export type StoryData = {
    paragraphs:Paragraph[],
    choices:Choice[],
    variables: any;
};

export interface HasId{
    id: string
}

export type V = {
    visible:boolean,
    everVisible:boolean,
    index:number
};


export type Item = {
    id:string,
    name:string,
    email:string
}