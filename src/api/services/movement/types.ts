import { DateTime } from "luxon";

// export interface InstructorMovementFrame {
//   timestamp: {
//     begin: DateTime;
//     end: DateTime;
//   };
//   timeDiff: number;
//   frameNumber: {
//     begin: number;
//     avg: number;
//     end: number;
//   };
//   instructor: {
//     avg: {
//       xPos: number;
//       yPos: number;
//     };
//     min: {
//       xPos: number;
//       yPos: number;
//     };
//     max: {
//       xPos: number;
//       yPos: number;
//     };
//   };
// }

export class InstructorMovementFrame {
  timestamp: {
    begin: DateTime;
    end: DateTime;
  };
  timeDiffMinutes: number;
  frameNumber: {
    begin: number;
    avg: number;
    end: number;
  };
  instructor: {
    avg: {
      xPos: number;
      yPos: number;
    };
    min: {
      xPos: number;
      yPos: number;
    };
    max: {
      xPos: number;
      yPos: number;
    };
  };
  constructor(data: any) {
    //Todo add error handling
    this.timestamp = {
      begin: DateTime.fromISO(data.timestamp.begin),
      end: DateTime.fromISO(data.timestamp.end),
    };
    this.timeDiffMinutes = parseInt(data.timeDiff.minutes);
    this.frameNumber = {
      begin: data.frameNumber.begin,
      avg: data.frameNumber.avg,
      end: data.frameNumber.end,
    };
    this.instructor = {
      avg: {
        xPos: data.instructor.avg.xPos,
        yPos: data.instructor.avg.yPos,
      },
      min: {
        xPos: data.instructor.min.xPos,
        yPos: data.instructor.min.yPos,
      },
      max: {
        xPos: data.instructor.max.xPos,
        yPos: data.instructor.max.yPos,
      },
    };
  }
}
