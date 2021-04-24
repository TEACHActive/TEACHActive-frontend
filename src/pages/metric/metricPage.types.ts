import React from "react";

// export class AvgGradeAssignmentResponse {
//   name: string;
//   due: DateTime;
//   averageGrade: number;

//   constructor(data: any) {
//     this.name = data.name;
//     this.due = DateTime.fromISO(data.due);
//     this.averageGrade = data.averageGrade;
//   }
// }

// export class Session {
//   id: string;
//   createdAt: DateTime;
//   metrics?: SessionMetric[];
//   className: string;
//   name: string;
//   sessionHandRaiseData?: SessionHandRaiseData[];

//   constructor(data: any) {
//     console.log("here", data);

//     this.id = data.id;
//     this.createdAt = DateTime.fromISO(data.createdAt);

//     if (data.metrics)
//       this.metrics = data.metrics.map(
//         (metric: any) => new SessionMetric(metric)
//       );
//     this.className = data.className;
//     this.name = data.name;
//     if (data.sessionHandRaiseData) {
//       this.sessionHandRaiseData = data.sessionHandRaiseData.map(
//         (sessionHandRaiseData: SessionHandRaiseData) =>
//           new SessionHandRaiseData(sessionHandRaiseData)
//       );
//     }
//   }
// }

// type ColorKeys = keyof typeof COLOR;
// type ColorValues = typeof COLOR[ColorKeys];

export interface ISessionMetric {
  name: string;
  metricType: SessionMetricType;
  color?: {
    dark: string;
    light: string;
  };
  metric: number;
  metricPrepend: string;
  hasDenominator: boolean;
  denominator: number;
  unit: string;
  trend?: number;
  trend_metric?: number;
  trend_metric_unit?: string;
  help_text: string;
  has_alert: boolean;
  icon: string;
  canEdit: boolean;
  updateMetric: (metricUpdateObject: any) => Promise<boolean>;
  constructMetricUpdateObject: (newMetric: string) => object;
  children?: React.ReactNode;
}

export class SessionMetric implements ISessionMetric {
  name: string;
  metricType: SessionMetricType;
  color?: {
    dark: string;
    light: string;
  };
  metric: number;
  metricPrepend: string;
  hasDenominator: boolean;
  denominator: number;
  unit: string;
  trend?: number;
  trend_metric?: number;
  trend_metric_unit?: string;
  help_text: string;
  has_alert: boolean;
  icon: string;
  canEdit: boolean;
  updateMetric: (metricUpdateObject: any) => Promise<boolean>;
  constructMetricUpdateObject: (newMetric: string) => object;
  children?: React.ReactNode;

  constructor(data: ISessionMetric) {
    this.name = data.name;

    this.metricType = data.metricType;

    if (data.color) {
      this.color = { light: data.color.light, dark: data.color.dark };
    }
    this.metric = data.metric;
    this.metricPrepend = data.metricPrepend;
    this.denominator = data.denominator;
    this.hasDenominator = data.hasDenominator;
    this.unit = data.unit;
    this.trend = data.trend;
    this.trend_metric = data.trend_metric;
    this.trend_metric_unit = data.trend_metric_unit;
    this.help_text = data.help_text;
    this.has_alert = data.has_alert;
    this.icon = data.icon;
    this.canEdit = data.canEdit;
    this.updateMetric = data.updateMetric;
    this.constructMetricUpdateObject = data.constructMetricUpdateObject;
    this.children = data.children;
  }
}

export enum SessionMetricType {
  HandRaises,
  StudentSpeech,
  InstructorSpeech,
  ClassPerformance,
  Attendance,
}

// export class SessionHandRaiseData {
//   frame: number;
//   totalHandsRaised: number;
//   totalArmsCrosses: number;
//   totalHandsOnFace: number;
//   totalOther: number;
//   totalError: number;
//   constructor(data: any) {
//     this.frame = data.frame;
//     this.totalHandsRaised = data.totalHandsRaised;
//     this.totalArmsCrosses = data.totalArmsCrosses;
//     this.totalHandsOnFace = data.totalHandsOnFace;
//     this.totalOther = data.totalOther;
//     this.totalError = data.totalError;
//   }
// }
