import moment from "moment";

export class Session {
  id: number;
  date: moment.Moment;
  name: string;
  class_name: "HCI 589 - Ethics";
  data: SessionMetric[];

  constructor(obj_data: any) {
    this.id = obj_data.id;
    this.date = moment(obj_data.date);
    this.name = obj_data.name;
    this.class_name = obj_data.class_name;
    this.data = obj_data.data.metrics.map(
      (metric: any) => new SessionMetric(metric)
    );
  }
}

export class SessionMetric {
  name: string;
  icon: string;
  color: string;
  metric: number;
  unit: string;
  trend: number; //Oneof(0,1)
  trend_metric: number; //oneof
  trend_metric_unit: string;
  help_text: string;
  has_alert: boolean;

  constructor(data: any) {
    this.name = data.name;
    this.icon = data.icon;
    this.color = data.color;
    this.metric = data.metric;
    this.unit = data.unit;
    this.trend = data.trend;
    this.trend_metric = data.trend_metric;
    this.trend_metric_unit = data.trend_metric_unit;
    this.help_text = data.help_text;
    this.has_alert = data.has_alert;
  }
}
