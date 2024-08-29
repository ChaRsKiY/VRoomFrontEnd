import {deDE, enUS} from "@clerk/localizations";
import {ruRU} from "../../locales/clerk/ru";

export const clerkLocalization = (locale: string) => {
    switch (locale) {
        case "ru":
            return ruRU;
        case "en":
            return enUS;
        case "de":
            return deDE
    }
}