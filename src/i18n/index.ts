import {zh} from "./zh";
import {en} from "./en";
import {getLanguage} from "../utils/Language";

const language: string = getLanguage();
export const translate = (key: string) => {
    switch (language) {
        case 'zh':
            return zh.get(key) || key;
        default:
            return en.get(key) || key;
    }
}
