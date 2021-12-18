import { DateTime } from "luxon";

enum Speaker {
  Instructor = "instructor",
  Student = "student",
  Ambiant = "ambiant",
}

export class SpeechSessionTotals {
  [Speaker.Instructor]: number;
  [Speaker.Student]: number;
  [Speaker.Ambiant]: number;

  constructor(data: any) {
    this[Speaker.Instructor] = data[Speaker.Instructor];
    this[Speaker.Student] = data[Speaker.Student];
    this[Speaker.Ambiant] = data[Speaker.Ambiant];
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

  constructor(data: any) {
    //TODO add error handling
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
  }
}
