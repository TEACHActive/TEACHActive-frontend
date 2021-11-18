export const TREND = {
  INC: 1,
  DEC: -1,
  STABLE: 0,
};

export enum SessionMetricType {
  HandRaises = "handRaises",
  StudentSpeech = "studentSpeech",
  InstructorSpeech = "instructorSpeech",
  ClassPerformance = "classPerformance",
  Attendance = "attendance",
}

export interface IMetricTypeDisplayable {
  getValue(): number | undefined;
  getValueNode(): React.ReactNode;
}

export class MetricNumberType implements IMetricTypeDisplayable {
  value?: number;

  getValue = (): number | undefined => {
    if (!this.value) return undefined;
    return parseFloat(this.value.toFixed(2));
  };
  getValueNode = (): React.ReactNode => {
    if (this.value === undefined) {
      return "-";
    }
    return this.getValue() || "-";
  };

  constructor(value?: number) {
    this.value = value;
  }
}

// export class MetricMaxMinAvgNumberType implements IMetricTypeDisplayable {
//   maxValue?: number;
//   minValue?: number;
//   avgValue?: number;

//   getValue = (): number | undefined => {
//     return parseFloat(this.avgValue?.toFixed(2) || "-");
//   };
//   getValueNode = (): React.ReactNode => {
//     // return (
//     //   <div>
//     //     <span>{parseFloat(this.minValue?.toFixed(2) || "-")}</span>
//     //     <span>/</span>
//     //     <span>{parseFloat(this.avgValue?.toFixed(2) || "-")}</span>
//     //     <span>/</span>
//     //     <span>{parseFloat(this.maxValue?.toFixed(2) || "-")}</span>
//     //   </div>
//     // );
//     return this.getValue();
//   };

//   constructor(maxValue?: number, minValue?: number, avgValue?: number) {
//     this.maxValue = maxValue;
//     this.minValue = minValue;
//     this.avgValue = avgValue;
//   }
// }
