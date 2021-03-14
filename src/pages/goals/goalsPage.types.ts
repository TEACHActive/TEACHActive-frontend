export class HandRaiseGoalsAndReflections {
  handRaisesReasonOptions: {
    label: string;
    value: string;
    disabled: boolean;
    checked: boolean;
  }[];
  handRaiseReasonOther: string;
  satisifedWithHandRaisesValue: string;
  reasonDissatisfiedWithHandRaises: string;
  goalNextSessionValue: string;
  handRaiseGoalOptions: {
    label: string;
    value: string;
    disabled: boolean;
    checked: boolean;
  }[];
  handRaiseGoalOther: string;
  constructor(data: any) {
    this.handRaisesReasonOptions = data.handRaiseGoalOther;
    this.handRaiseReasonOther = data.handRaiseGoalOther;
    this.satisifedWithHandRaisesValue = data.handRaiseGoalOther;
    this.reasonDissatisfiedWithHandRaises = data.handRaiseGoalOther;
    this.goalNextSessionValue = data.handRaiseGoalOther;
    this.handRaiseGoalOptions = data.handRaiseGoalOther;
    this.handRaiseGoalOther = data.handRaiseGoalOther;
  }
}
