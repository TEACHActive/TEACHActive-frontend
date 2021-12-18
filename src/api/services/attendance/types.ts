export class AttendanceStats {
  max: number;
  min: number;
  avg: number;

  constructor(data: any) {
    this.max = data.max;
    this.min = data.min;
    this.avg = data.avg;
  }
}
