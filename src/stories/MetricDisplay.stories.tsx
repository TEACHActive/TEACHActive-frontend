import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import "antd/dist/antd.css";

import MetricDisplay, {
  IMetricDisplayProps,
} from "../pages/session/MetricDisplay/metricDisplay";
import COLOR from "../constants/colors";

export default {
  title: "Metric Display",
  component: MetricDisplay,
  //   argTypes: {
  //     backgroundColor: { control: 'color' },
  //   },
} as Meta;

const Template: Story<IMetricDisplayProps> = (args) => (
  <MetricDisplay {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  color: COLOR.RED,
  //   label: 'Button',
};
