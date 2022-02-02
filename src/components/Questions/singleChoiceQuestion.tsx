import { DefaultQuestionProps } from ".";
import { Form, Input, Select } from "antd";
import React from "react";
import { SelectValue } from "antd/lib/select";

const { Option } = Select;

export interface ISingleChoiceQuestionProps {
  key: string;
  hasOther: boolean;
  otherInitialValue: string;
  setOtherValue: (value: string) => void;
  placeHolder: string;
  options: {
    value: string;
    label: string;
    selected: boolean;
  }[];
  setValue: (value: string) => void;
  initialValue: string;
}

export function SingleChoiceQuestion(
  props: ISingleChoiceQuestionProps & DefaultQuestionProps
) {
  const [otherSelected, setOtherSelected] = React.useState<boolean>(false);
  const {
    key,
    prompt,
    isRequired,
    isDisabled,
    saving,
    hasOther,
    placeHolder,
    options,
    otherInitialValue,
  } = props;
  return (
    <Form.Item key={key} label={prompt} required={isRequired}>
      <Select
        disabled={isDisabled || saving}
        placeholder={placeHolder}
        allowClear
        options={
          hasOther ? [...options, { label: "Other", value: "other" }] : options
        }
        onChange={(value: SelectValue) => {
          const otherChecked = value == "other";
          setOtherSelected(!!otherChecked);
        }}
      >
        {/* {options.map((option, i) => (
          <Option key={i} value={option.value || option.label || i}>
            {option.value || option.label || i}
          </Option>
        ))} */}
      </Select>
      {hasOther && otherSelected && (
        <Form.Item label={"Other"} required={hasOther}>
          <Input
            onChange={(e) => {}}
            disabled={isDisabled || saving}
            value={otherInitialValue}
          />
        </Form.Item>
      )}
    </Form.Item>
  );
}
