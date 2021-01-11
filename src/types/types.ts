import { DateTime } from "luxon";
import COLOR from "../constants/colors";

type ColorKeys = keyof typeof COLOR;
type ColorValues = typeof COLOR[ColorKeys];

export class SessionMetric {
  name: string;
  icon: string;
  color: {
    dark: string;
    light: string;
  };
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
    if (data.color) {
      this.color = { light: data.color.light, dark: data.color.dark };
    }
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
