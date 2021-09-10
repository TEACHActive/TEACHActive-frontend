import { DateTime, DurationObjectUnits, DurationUnit } from "luxon";

export class Response<T> {
  success: boolean;
  data: T | null;
  error: string;
  statusCode: number;

  constructor(data: any, private responseType: new (data: any) => T) {
    this.success = data.success;
    this.data = new responseType(data.data);
    this.error = data.error;
    this.statusCode = data.statusCode;
  }
}

export enum ArmPose {
  Other = "other",
  HandsRaised = "handsRaised",
  ArmsCrossed = "armsCrossed",
  HandsOnFace = "handsOnFace",
  Error = "error",
}

export enum SitStand {
  Sit = "sit",
  Stand = "stand",
  Error = "error",
  Other = "other",
}

export class VideoFrame {
  frameNumber: number;
  people: Person[];
  timestamp: DateTime;

  constructor(data: any) {
    this.frameNumber = data.frameNumber;
    this.people = data.people.map((person: any) => new Person(person));
    this.timestamp = DateTime.fromSeconds(data.timestamp.unixSeconds);
  }
}

export class Person {
  openposeId: number;
  trackingId: number;
  armpose: ArmPose;
  sitStand: SitStand;
  body: number[];

  constructor(data: any) {
    this.openposeId = data.openposeId;
    this.trackingId = data.inference ? data.inference.trackingId : -1;
    this.armpose = data.inference
      ? data.inference.posture.armPose
      : ArmPose.Error;
    this.sitStand = data.inference
      ? data.inference.posture.sitStand
      : SitStand.Error;
    this.body = data.body;
  }
}

export class SessionResponse<T extends BaseSession> {
  success: boolean;
  sessions: T[];

  constructor(data: any, private sessionType: new (data: any) => T) {
    this.success = data.success;
    this.sessions = data.sessions.map(
      (session: any) => new sessionType(session)
    );
  }
}

export class BaseSession {
  id: string;
  createdAt: DateTime;
  name: string;
  performance: number;
  keyword?: string;

  constructor(data: any) {
    this.id = data.id;
    this.createdAt = this.getCreatedAtFromData(data);
    this.name = this.getNameFromData(data);
    this.performance = data.performance ?? null;
    this.keyword = data.keyword;
  }

  private getCreatedAtFromData(data: any): DateTime {
    //Accounting for edge case where analysis is done on days after it is first recorded and name is changed
    const nameToDate = DateTime.fromFormat(
      this.getNameFromData(data),
      "L/d/yyyy"
    );
    if (nameToDate.isValid) {
      return nameToDate;
    }
    if (!data.createdAt) {
      return DateTime.fromJSDate(new Date()); //Currently some issue with DateTime.now()?
    } else if (data.createdAt.isLuxonDateTime) {
      return data.createdAt;
    } else if (data.createdAt.unixSeconds) {
      return DateTime.fromSeconds(data.createdAt.unixSeconds);
    } else if (DateTime.fromISO(data.createdAt).isValid) {
      return DateTime.fromISO(data.createdAt);
    } else {
      return DateTime.fromJSDate(new Date()); //Currently some issue with DateTime.now()?
    }
  }

  private getNameFromData(data: any): string {
    if (data.name) {
      return data.name;
    } else if (data.createdAt.isLuxonDateTime) {
      return data.createdAt.toLocaleString();
    } else if (data.createdAt.unixSeconds) {
      return DateTime.fromSeconds(data.createdAt.unixSeconds).toLocaleString();
    } else {
      return data.id;
    }
  }

  static equal(left: BaseSession, right: BaseSession): boolean {
    return left.id === right.id;
  }
}

// export class BaseSessionArray {
//   baseSessions: BaseSession[];

//   constructor(data: any) {
//     this.baseSessions = data.data.map(
//       (baseSession: any) => new BaseSession(baseSession)
//     );
//   }
// }

export class VideoFrameSession extends BaseSession {
  videoFrames: VideoFrame[];

  constructor(data: any) {
    super(data);
    this.videoFrames = data.videoFrames.map(
      (videoFrame: any) => new VideoFrame(videoFrame)
    );
  }

  getArmPoseCount = (
    timestampDurationUnit: DurationUnit | DurationUnit[] = "minutes"
  ) => {
    const initialDateTime = this.videoFrames[0].timestamp;
    return this.videoFrames.map((frame) => {
      return {
        frameNumber: frame.frameNumber,
        timestamp: Math.round(
          frame.timestamp.diff(initialDateTime, timestampDurationUnit).minutes
        ),
        armPoseCount: {
          handsRaised: frame.people
            .map((person) => {
              return {
                pose: person.armpose,
                id: person.openposeId,
              };
            })
            .filter((personPose) => personPose.pose === ArmPose.HandsRaised),
          armsCrossed: 0,
          error: 0,
          handsOnFace: 0,
          other: 0,
        },
        people: frame.people,
      };
    });
  };
}

// export class VideoFrameSessionArray {
//   videoFrameSessions: VideoFrameSession[];

//   constructor(data: any) {
//     this.videoFrameSessions = data.data.map(
//       (videoFrameSession: any) => new VideoFrameSession(videoFrameSession)
//     );
//   }
// }

export class CumulativeArmPoses {
  handsRaised: number;
  armsCrossed: number;
  error: number;
  handsOnFace: number;
  other: number;

  constructor(data: any) {
    const { handsRaised, armsCrossed, error, handsOnFace, other } = data.data;

    this.handsRaised = handsRaised;
    this.armsCrossed = armsCrossed;
    this.error = error;
    this.handsOnFace = handsOnFace;
    this.other = other;
  }
}

export abstract class WithTimeDiff {
  // Could make this a factory like ClassArrayFactory and pass the timeDiff or timestamp as a param
  timeDiff: {
    [unit: string]: keyof DurationObjectUnits;
  };

  constructor(data: any) {
    this.timeDiff = { ...data.timeDiff };
  }
}

export class ArmPosesInFrame extends WithTimeDiff {
  armPoseCount: {
    handsRaised: number;
    armsCrossed: number;
    error: number;
    handsOnFace: number;
    other: number;
  };

  constructor(data: any) {
    super(data);
    const {
      handsRaised,
      armsCrossed,
      error,
      handsOnFace,
      other,
    } = data.armPoseCount;
    this.armPoseCount = {
      handsRaised: handsRaised ?? -1,
      armsCrossed: armsCrossed ?? -1,
      error: error ?? -1,
      handsOnFace: handsOnFace ?? -1,
      other: other ?? -1,
    };
  }
}

// export class ArmPosesInFrameArray {
//   armPosesInFrames: ArmPosesInFrame[];

//   constructor(data: any) {
//     this.armPosesInFrames = data.data.map(
//       (armPosesInFrame: any) => new ArmPosesInFrame(armPosesInFrame)
//     );
//   }
// }

export class StudentAttendenceStats {
  max: number;
  min: number;
  avg: number;
  stdDev: number;

  constructor(data: any) {
    const { max, min, avg, stdDev } = data.data;

    this.max = max;
    this.min = min;
    this.avg = avg;
    this.stdDev = stdDev;
  }
}

export class XPositionInFrame {
  timestamp: {
    [unit: string]: keyof DurationObjectUnits;
  };
  xPos: number;

  constructor(data: any) {
    this.timestamp = { ...data.timestamp };
    this.xPos = data.xPos;
  }
}

export class SitStandInFrame extends WithTimeDiff {
  sitNumber: number;
  standNumber: number;
  errorNumber: number;

  constructor(data: any) {
    super(data);
    const { sitNumber, standNumber, errorNumber } = data.sitStand;
    this.sitNumber = sitNumber;
    this.standNumber = standNumber;
    this.errorNumber = errorNumber;
  }
}

/**
 * To avoid needing to create wrapper classes for all calls that return an array.
 * Ex.
 * new ClassArrayFactory<ArmPosesInFrame>().transformToClass(
 *     ArmPosesInFrame
 * )
 *
 * return response.data?.arr
 */
export class ClassArrayFactory<T> {
  transformToClass = (dataType: new (data: any) => T) =>
    class Inner {
      arr: T[] | undefined;

      constructor(data: any) {
        this.arr = data.data.map((item: any) => new dataType(item));
      }
    };
}

export enum MethodType {
  GET = "get",
  POST = "post",
  PUT = "put",
}

export enum Channel {
  Student = "student",
  Instructor = "instructor",
}
