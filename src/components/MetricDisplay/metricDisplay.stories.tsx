import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { MetricDisplayPresentational } from "./metricDisplayPresentational";

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
  metric: 5,
  canEdit: false,
  processing: false,
  denominator: "",
  trend_metric: "",
  metricPrepend: "",
  editingMetric: false,
  trend_metric_unit: "",
};
