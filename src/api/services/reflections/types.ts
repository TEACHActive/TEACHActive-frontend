export class NestedChoiceQuestionOption {
  value: string;
  label: string;
  selected: boolean;

  constructor(data: any) {
    this.value = data.value || "";
    this.label = data.label || "";
    this.selected = data.selected || false;
  }
}

export class YNQuestion {
  yes: NestedChoiceQuestionOption;
  no: NestedChoiceQuestionOption;

  constructor(data: any) {
    this.yes = new NestedChoiceQuestionOption(data.yes);
    this.no = new NestedChoiceQuestionOption(data.no);
  }
}

export class MultiChoiceQuestion {
  options: NestedChoiceQuestionOption[];
  hasOther?: boolean;
  otherValue?: string;
  otherSelected?: boolean;

  constructor(data: any) {
    this.options = data.options
      ? data.options.map(
          (option: any) => new NestedChoiceQuestionOption(option)
        )
      : [];
    this.hasOther = data.hasOther;
    this.otherValue = data.otherValue;
    this.otherSelected = data.otherSelected;
  }
}

export class SingleChoiceQuestion {
  options: NestedChoiceQuestionOption[];
  hasOther?: boolean;
  otherValue?: string;
  otherSelected?: boolean;

  constructor(data: any) {
    this.options = data.options.map(
      (option: any) => new NestedChoiceQuestionOption(option)
    );
    this.hasOther = data.hasOther;
    this.otherValue = data.otherValue;
    this.otherSelected = data.otherSelected;
  }
}

class FreeResponseQuestion {
  feild: string;

  constructor(data: any) {
    this.feild = data.feild;
  }
}

class LikertQuestion {
  value: number;
  minValue?: number;
  maxValue?: number;

  constructor(data: any) {
    this.value = data.value;
    this.minValue = data.minValue;
    this.maxValue = data.maxValue;
  }
}

export class ReflectionSectionQuestionOnSelected {
  prompt: string;
  questionType: string;
  ynQuestion: YNQuestion | null;
  multiChoiceQuestion: MultiChoiceQuestion | null;
  singleChoiceQuestion: SingleChoiceQuestion | null;
  freeResponseQuestion: FreeResponseQuestion | null;
  likertQuestion: LikertQuestion | null;

  constructor(data: any) {
    this.prompt = data.prompt ?? "<No Prompt>";
    this.questionType = data.questionType ?? QuestionType.None;
    this.ynQuestion =
      data.ynQuestion &&
      data.questionType === QuestionType.ynQuestion.toString()
        ? new YNQuestion(data.ynQuestion)
        : null;
    this.multiChoiceQuestion =
      data.multiChoiceQuestion &&
      data.questionType === QuestionType.multiChoiceQuestion.toString()
        ? new MultiChoiceQuestion(data.multiChoiceQuestion)
        : null;
    this.singleChoiceQuestion =
      data.singleChoiceQuestion &&
      data.questionType === QuestionType.singleChoiceQuestion.toString()
        ? new SingleChoiceQuestion(data.singleChoiceQuestion)
        : null;
    this.freeResponseQuestion =
      data.freeResponseQuestion &&
      data.questionType === QuestionType.freeResponseQuestion.toString()
        ? new FreeResponseQuestion(data.freeResponseQuestion)
        : null;
    this.likertQuestion =
      data.likertQuestion &&
      data.questionType === QuestionType.likertQuestion.toString()
        ? new LikertQuestion(data.likertQuestion)
        : null;
  }
}

export class ReflectionSectionQuestion {
  id: string;
  value: string;
  priority: number;
  selected: boolean;
  required: boolean;
  placeHolder: string;
  onSelected: ReflectionSectionQuestionOnSelected;
  constructor(data: any) {
    this.id = data.id;
    this.value = data.value;
    this.priority = data.priority;
    this.selected = data.selected;
    this.required = data.required || false;
    this.placeHolder = data.placeHolder || "";

    this.onSelected = new ReflectionSectionQuestionOnSelected(data.onSelected);
  }
}

export class ReflectionSection {
  _id: string;
  name: string;
  title: string;
  questions: ReflectionSectionQuestion[];

  constructor(data: any) {
    this._id = data._id;
    this.name = data.name;
    this.title = data.title;
    this.questions = data.questions.map(
      (question: any) => new ReflectionSectionQuestion(question)
    );
  }
}

export class Reflection {
  id: string;
  userId: string;
  sessionId: string;
  reflectionSections: ReflectionSection[];

  constructor(data: any) {
    this.id = data.id;
    this.userId = data.userId;
    this.sessionId = data.sessionId;
    this.reflectionSections = data.reflectionSections.map(
      (section: any) => new ReflectionSection(section)
    );
  }
}

export enum QuestionType {
  None = "None",
  ynQuestion = "ynQuestion",
  multiChoiceQuestion = "multiChoiceQuestion",
  singleChoiceQuestion = "singleChoiceQuestion",
  freeResponseQuestion = "freeResponseQuestion",
  likertQuestion = "likertQuestion",
}
