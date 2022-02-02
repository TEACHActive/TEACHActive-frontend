import React from "react";
import { Form, Slider } from "antd";
import { DefaultQuestionProps } from ".";

export interface ILikertQuestionProps {
  minValue?: number;
  maxValue?: number;
  setValue: (value: number) => void;
  initialValue: number;
}

export function LikertQuestion(
  props: ILikertQuestionProps & DefaultQuestionProps
) {
  const {
    _key,
    minValue,
    maxValue,
    prompt,
    isRequired,
    isDisabled,
    initialValue,
    saving,
    setValue,
  } = props;

  const [sliderValue, setSliderValue] = React.useState(initialValue || 1);

  let qMinValue = minValue || 1;
  let qMaxValue = maxValue || 5;
  if (qMaxValue < qMinValue) {
    //flip them if the wrong way around
    const temp = qMaxValue;
    qMaxValue = qMinValue;
    qMinValue = temp;
  }
  //Calculate marks
  var marks = [];
  for (let markIndex = qMinValue; markIndex <= qMaxValue; markIndex++) {
    marks.push(markIndex);
  }

  return (
    <Form.Item key={_key} label={prompt} required={isRequired}>
      <Slider
        disabled={isDisabled || saving}
        style={{ width: `${marks.length * 50}px` }}
        marks={marks.reduce((o, key) => ({ ...o, [key]: key.toString() }), {})}
        min={qMinValue}
        max={qMaxValue}
        value={sliderValue}
        onAfterChange={(value: number) => {
          setValue(value);
        }}
      />
    </Form.Item>
  );
}
