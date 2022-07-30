
import {last} from "underscore";
import {merge} from "./Utils";
import type {Tags, Text, TextContent} from "@/types/types";

export const choiceSeparator = "%choice%";

export const tagsToJSON = (tags: string[] | null)=>{
    const tagsArray:Tags[] = (tags || []).map((s: string) => JSON.parse(s) as Tags);
    return merge(tagsArray);
};

export const replace = (text:Text, choices:any[]): boolean => {
    const lastContent:TextContent = last(text.contents) as TextContent;
    if(lastContent?.type !== "text" || lastContent.numChoices === 0){
        return false;
    }
    else if(lastContent.numChoices != choices.length){
        throw new Error("choices mismatch");
    }
    const content = lastContent.text.split(choiceSeparator);
    text.contents.pop();
    content.forEach( (c, i)=>{
        text.contents.push({
            type: "text",
            text: c,
            numChoices: 0
        });
        const choice = choices[i];
        if(choice){
            text.contents.push({
                type: "link",
                choiceIndex: i,
                text: choice.text,
                value:""
            });
        }
    });
    return true;
};