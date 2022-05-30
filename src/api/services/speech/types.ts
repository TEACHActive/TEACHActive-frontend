import { DateTime } from "luxon";
import { normalize } from "../../../util";

enum Speaker {
  Instructor = "instructor",
  Student = "student",
  Ambiant = "ambiant",
  Silent = "silent",
}

export class SpeechSessionTotals {
  speakerMap: {
    [Speaker.Instructor]: number;
    [Speaker.Student]: number;
    [Speaker.Ambiant]: number;
    [Speaker.Silent]: number;
  };
  sessionLength: number;
  speakingTime: {
    [Speaker.Student]: number;
    [Speaker.Instructor]: number;
  };
  speakingPercent: {
    [Speaker.Student]: number;
    [Speaker.Instructor]: number;
  };

  constructor(data: any) {
    this.speakerMap = data.speakerMap;
    this.sessionLength = data.sessionLength;
    this.speakingTime = data.speakingTime;
    this.speakingPercent = data.speakingPercent;
  }
}

export class CombinedSpeechFrame {
  timestamp: {
    begin: DateTime;
    end: DateTime;
  };
  timeDiff: {
    minutes: number;
  };
  frameNumber: {
    begin: number;
    avg: number;
    end: number;
  };
  speakerInSeconds: {
    [Speaker.Ambiant]: number;
    [Speaker.Student]: number;
    [Speaker.Instructor]: number;
  };
  maxAmp: number;
  minAmp: number;

  constructor(data: any) {
    //TODO: add error handling
    this.timestamp = {
      begin: DateTime.fromISO(data.timestamp.begin),
      end: DateTime.fromISO(data.timestamp.end),
    };
    this.timeDiff = {
      minutes: parseInt(data.timeDiff.minutes),
    };
    this.frameNumber = {
      begin: data.frameNumber.begin,
      avg: data.frameNumber.avg,
      end: data.frameNumber.end,
    };
    this.speakerInSeconds = {
      [Speaker.Ambiant]: data.speakerInSeconds[Speaker.Ambiant],
      [Speaker.Student]: data.speakerInSeconds[Speaker.Student],
      [Speaker.Instructor]: data.speakerInSeconds[Speaker.Instructor],
    };
    this.maxAmp = data.maxAmp;
    this.minAmp = data.minAmp;
  }
}
