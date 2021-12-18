import { DateTime, Duration } from "luxon";

export interface ISession {
  id: string;
  name?: string;
  userUID: string;
  createdAt?: DateTime | undefined;
  createdAtISO: string;
  performance?: number;
}

export class Session implements ISession {
  id: string;
  name?: string;
  userUID: string;
  createdAt: DateTime;
  createdAtISO: string;
  performance?: number;

  constructor(data: any, fps: number) {
    this.id = data.id;
    this.name = data.name;
    this.userUID = data.userUID;
    this.createdAt = DateTime.fromISO(data.createdAt);
    this.createdAtISO = data.createdAt;
    this.performance = data.performance;
  }

  static equal(left: ISession, right: ISession): boolean {
    return left.id === right.id;
  }
}

export class VideoFrame {
  frameNumber: number;
  people: Person[];
  timestamp: DateTime;

  constructor(data: any, initialDateTime: DateTime, fps: number) {
    this.frameNumber = data.frameNumber;
    this.people = data.people.map((person: any) => new Person(person));
    this.timestamp = initialDateTime.plus(
      Duration.fromObject({ seconds: Math.round(this.frameNumber / fps) })
    );
  }

  serialize = () => {
    return {
      ...this,
      people: this.people.map((person) => person.serialize()),
    };
  };
}

export class AudioFrame {
  frameNumber: number;
  timestamp: DateTime;
  amplitude: number;

  constructor(data: any, initialDateTime: DateTime, fps: number) {
    this.frameNumber = data.frameNumber;
    this.amplitude = data.audio.amplitude;
    this.timestamp = initialDateTime.plus(
      Duration.fromObject({ seconds: this.frameNumber / fps })
    );
  }

  serialize = () => {
    return { ...this };
  };
}

export class Person {
  openposeId: number;
  trackingId: number;
  armpose: ArmPose;
  sitStand: SitStand;
  body: Body;

  constructor(data: any) {
    this.openposeId = data.openposeId;
    this.trackingId = data.inference ? data.inference.trackingId : -1;
    this.armpose = data.inference
      ? data.inference.posture.armPose
      : ArmPose.Error;
    this.sitStand = data.inference
      ? data.inference.posture.sitStand
      : SitStand.Error;
    this.body = new Body(data.body);
  }

  serialize = () => {
    return {
      ...this,
      body: this.body.serialize(),
    };
  };
}

export class Body {
  bodyParts: Map<BodyPart, { x: number; y: number; confident: boolean }>;

  constructor(body: number[]) {
    this.bodyParts = new Map();

    for (
      let bodyPartIndex = 0;
      bodyPartIndex < body.length - 2;
      bodyPartIndex += 3
    ) {
      const bodyPartX = body[bodyPartIndex];
      const bodyPartY = body[bodyPartIndex + 1];
      const bodyPartConfidence = body[bodyPartIndex + 2] === 1 ? true : false; // Is either 0 or 1 representing not confident or confident
      this.bodyParts.set(bodyPartIndex / 3, {
        x: bodyPartX,
        y: bodyPartY,
        confident: bodyPartConfidence,
      });
    }
  }

  serialize = () => {
    return JSON.stringify(Array.from(this.bodyParts.entries()));
  };
}

export enum BodyPart {
  Nose = 0,
  Neck = 1,
  RShoulder = 2,
  RElbow = 3,
  RWrist = 4,
  LShoulder = 5,
  LElbow = 6,
  LWrist = 7,
  MidHip = 8,
  RHip = 9,
  RKnee = 10,
  RAnkle = 11,
  LHip = 12,
  LKnee = 13,
  LAnkle = 14,
  REye = 15,
  LEye = 16,
  REar = 17,
  LEar = 18,
  LBigToe = 19,
  LSmallToe = 20,
  LHeel = 21,
  RBigToe = 22,
  RSmallToe = 23,
  RHeel = 24,
  Background = 25,
}

export enum ArmPose {
  Error = "error",
  Other = "other",
  HandsRaised = "handsRaised",
  ArmsCrossed = "armsCrossed",
  HandsOnFace = "handsOnFace",
}

export enum SitStand {
  Sit = "sit",
  Stand = "stand",
  Error = "error",
}

export enum Channel {
  Student = "student",
  Instructor = "instructor",
}

export enum Speaker {
  Student = "student",
  Instructor = "instructor",
  Ambient = "ambient",
}
