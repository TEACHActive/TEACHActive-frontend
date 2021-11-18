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
