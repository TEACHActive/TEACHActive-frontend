import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { MetricDisplayPresentational } from "./metricDisplayPresentational";
import { MetricNumberType } from "./metricDisplay.types";

export default {
  title: "Component/metrics/MetricDisplayPresentational",
  component: MetricDisplayPresentational,
} as ComponentMeta<typeof MetricDisplayPresentational>;

const Template: ComponentStory<typeof MetricDisplayPresentational> = (args) => (
  <MetricDisplayPresentational {...args} />
);

export const Base = Template.bind({});
Base.args = {
  unit: "",
  icon: "hands",
  metric: new MetricNumberType(5),
  canEdit: false,
  processing: false,
  denominator: 0,
  trend_metric: 0,
  metricPrepend: "",
  editingMetric: false,
  trend_metric_unit: "",
};
