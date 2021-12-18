import { DateTime } from "luxon";
import { ArmPose } from "../sessions/types";
export class ArmPoseStats {
  [ArmPose.ArmsCrossed]: ArmPoseStat;
  [ArmPose.Error]: ArmPoseStat;
  [ArmPose.HandsOnFace]: ArmPoseStat;
  [ArmPose.HandsRaised]: ArmPoseStat;
  [ArmPose.Other]: ArmPoseStat;
  avgFrameNumber: number;
  timestamp: {
    begin: DateTime;
    end: DateTime;
  };
  timeDiff: {
    minutes: number;
  };

  constructor(data: any) {
    this[ArmPose.ArmsCrossed] = data[ArmPose.ArmsCrossed];
    this[ArmPose.Error] = data[ArmPose.Error];
    this[ArmPose.HandsOnFace] = data[ArmPose.HandsOnFace];
    this[ArmPose.HandsRaised] = data[ArmPose.HandsRaised];
    this[ArmPose.Other] = data[ArmPose.Other];
    this.avgFrameNumber = data.avgFrameNumber;
    this.timestamp = {
      begin: data.timestamp.begin,
      end: data.timestamp.end,
    };
    this.timeDiff = {
      minutes: parseInt(data.timeDiff.minutes),
    };
  }
}

export class ArmPoseTotalsStats {
  [ArmPose.ArmsCrossed]: number;
  [ArmPose.Error]: number;
  [ArmPose.HandsOnFace]: number;
  [ArmPose.HandsRaised]: number;
  [ArmPose.Other]: number;

  constructor(data: any) {
    this[ArmPose.ArmsCrossed] = data[ArmPose.ArmsCrossed];
    this[ArmPose.Error] = data[ArmPose.Error];
    this[ArmPose.HandsOnFace] = data[ArmPose.HandsOnFace];
    this[ArmPose.HandsRaised] = data[ArmPose.HandsRaised];
    this[ArmPose.Other] = data[ArmPose.Other];
  }
}

interface ArmPoseStat {
  max: number;
  min: number;
  avg: number;
}
