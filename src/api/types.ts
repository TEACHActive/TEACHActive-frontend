import { DateTime, DurationUnit } from "luxon";

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

  constructor(data: any) {
    this.id = data.id;
    this.createdAt = this.getCreatedAtFromData(data);
    this.name = this.getNameFromData(data);
    this.performance = data.performance ?? null;
  }

  private getCreatedAtFromData(data: any): DateTime {
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
    const armPoseZero = {
      handsRaised: 0,
      armsCrossed: 0,
      error: 0,
      handsOnFace: 0,
      other: 0,
    };
    const initialDateTime = this.videoFrames[0].timestamp;
    return this.videoFrames.map((frame) => {
      const armPoseCntObj = frame.people.map((person) => person.armpose);
      // .reduce((tally: typeof armPoseZero, armPose: string) => {
      //   // if (armPose === ArmPose.HandsRaised) cnt++;
      //   if (tally.handsRaised === 0) console.log("===========");

      //   tally.handsRaised += armPose === ArmPose.HandsRaised ? 1 : 0;
      //   tally.armsCrossed += armPose === ArmPose.ArmsCrossed ? 1 : 0;
      //   tally.error += armPose === ArmPose.Error ? 1 : 0;
      //   tally.handsOnFace += armPose === ArmPose.HandsOnFace ? 1 : 0;
      //   tally.other += armPose === ArmPose.Other ? 1 : 0;
      //   return tally;
      // }, armPoseZero);
      //Todo: fix this reduce

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
