import { YNQuestion } from "./ynQuestion";
import { LikertQuestion } from "./likertQuestion";
import { FreeResponseQuestion } from "./freeResponseQuestion";
import { MultiChoiceQuestion } from "./multiChoiceQuestion";
import { SingleChoiceQuestion } from "./singleChoiceQuestion";

export interface DefaultQuestionProps {
  _key: string | number;
  prompt: string;
  isRequired: boolean;
  isDisabled: boolean;
  saving: boolean;
}

export {
  YNQuestion,
  LikertQuestion,
  MultiChoiceQuestion,
  FreeResponseQuestion,
  SingleChoiceQuestion,
};
