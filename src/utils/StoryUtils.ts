
import {last} from "underscore";
import {merge, count} from "./Utils";
import type {Section, Tags, Text, TextContent, Code, Choices} from "@/types/types";

export const choiceSeparator = "%choice%";

export const tagsToJSON = (tags: string[] | null)=>{
    const tagsArray:Tags[] = (tags || []).map((s: string) => JSON.parse(s) as Tags);
    return merge(tagsArray);
};

export const replaceAll = (section:Section, choices:Choices): boolean=>{
    if(section.type === "text"){
        return replaceText(section, choices);
    }
    else if(section.type === "code"){
        return replaceCode(section, choices);
    }
    return false;
};

const replaceCode = (code:Code, choices:Choices): boolean => {
    code.choices = choices;
    return true;
};

const replaceText = (text:Text, choices:Choices): boolean => {
    const _choices = choices.choices;
    const lastContent:TextContent = last(text.contents) as TextContent;
    const numChoices = count(lastContent.text, choiceSeparator)
    if(lastContent?.type !== "text" || numChoices === 0){
        return false;
    }
    else if(numChoices != _choices.length){
        throw new Error("choices mismatch");
    }
    const content = lastContent.text.split(choiceSeparator);
    text.contents.pop();
    content.forEach( (c, i)=>{
        text.contents.push({
            type: "text",
            text: c
        });
        const choice = _choices[i];
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