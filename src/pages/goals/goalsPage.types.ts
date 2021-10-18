// export class HandRaiseGoalsAndReflections {
//   handRaisesReasonOptions: {
//     label: string;
//     value: string;
//     disabled: boolean;
//     checked: boolean;
//   }[];
//   handRaiseReasonOther: string;
//   satisifedWithHandRaisesValue: string;
//   reasonDissatisfiedWithHandRaises: string;
//   goalNextSessionValue: string;
//   handRaiseGoalOptions: {
//     label: string;
//     value: string;
//     disabled: boolean;
//     checked: boolean;
//   }[];
//   handRaiseGoalOther: string;
//   constructor(data: any) {
//     this.handRaisesReasonOptions = data.handRaisesReasonOptions;
//     this.handRaiseReasonOther = data.handRaiseReasonOther;
//     this.satisifedWithHandRaisesValue = data.satisifedWithHandRaisesValue;
//     this.reasonDissatisfiedWithHandRaises =
//       data.reasonDissatisfiedWithHandRaises;
//     this.goalNextSessionValue = data.goalNextSessionValue;
//     this.handRaiseGoalOptions = data.handRaiseGoalOptions;
//     this.handRaiseGoalOther = data.handRaiseGoalOther;
//   }
// }

export class Reflections {
  _id: string;
  userId: string;
  sessionId: string;
  reflectionSections: ReflectionSection[];

  constructor(data: any) {
    this._id = data._id;
    this.userId = data.userId;
    this.sessionId = data.sessionId;
    this.reflectionSections = data.reflectionSections.map(
      (reflectionSection: any) => new ReflectionSection(reflectionSection)
    );
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

class YNQuestion {
  yes: NestedChoiceQuestionOption;
  no: NestedChoiceQuestionOption;

  constructor(data: any) {
    this.yes = new NestedChoiceQuestionOption(data.yes);
    this.no = new NestedChoiceQuestionOption(data.no);
  }
}

class MultiChoiceQuestion {
  options: NestedChoiceQuestionOption[];
  hasOther?: boolean;
  otherValue?: string;

  constructor(data: any) {
    this.options = data.options.map(
      (option: any) => new NestedChoiceQuestionOption(option)
    );
    this.hasOther = data.hasOther;
    this.otherValue = data.otherValue;
  }
}

class SingleChoiceQuestion {
  options: NestedChoiceQuestionOption[];
  hasOther?: boolean;
  otherValue?: string;

  constructor(data: any) {
    this.options = data.options.map(
      (option: any) => new NestedChoiceQuestionOption(option)
    );
    this.hasOther = data.hasOther;
    this.otherValue = data.otherValue;
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

class NestedChoiceQuestionOption {
  value: string;
  label: string;
  selected: boolean;

  constructor(data: any) {
    this.value = data.value;
    this.label = data.label;
    this.selected = data.selected;
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
