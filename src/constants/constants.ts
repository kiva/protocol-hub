// Constants
import * as constants from "./variables.json";
import * as translations from "./translations.json";

import {Constants, MessageMap} from "../ui/interfaces/ConstantInterfaces";

const C: any = constants;
const C_DATA: Constants = C.default;

const TR: any = translations;
const TR_DATA: MessageMap = TR.default;

export const CONSTANTS = C_DATA;
export const translationKeys = TR_DATA;