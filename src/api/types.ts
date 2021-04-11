import { DateTime } from "luxon";

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

  constructor(data: any) {
    this.id = data.id;
    this.createdAt = this.getCreatedAtFromData(data);
    this.name = this.getNameFromData(data);
  }

  private getCreatedAtFromData(data: any): DateTime {
    switch (typeof data.createdAt) {
      case typeof Number:
        return DateTime.fromSeconds(data.createdAt.unixSeconds);
      case typeof String:
        return DateTime.fromISO(data.createdAt);
      case typeof Object:
        if (data.createdAt.isLuxonDateTime) {
          return data.createdAt;
        } else if (data.createdAt.unixSeconds) {
          return DateTime.fromSeconds(data.createdAt.unixSeconds);
        }
      //else fallthrough
      default:
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
  armpose: "other" | "handRaised" | "armsCrossed" | "handsOnFace" | "error";
  sitStand: "sit" | "stand" | "error" | "other";

  constructor(data: any) {
    this.openposeId = data.openposeId;
    this.trackingId = data.inference ? data.inference.trackingId : -1;
    this.armpose = data.inference ? data.inference.posture.armPose : "error";
    this.sitStand = data.inference ? data.inference.posture.sitStand : "error";
  }
}
