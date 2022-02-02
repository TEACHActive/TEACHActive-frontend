import { Form } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { DefaultQuestionProps } from ".";

export interface IFreeResponseQuestionProps {
  setValue: (value: string) => void;
  initialValue: string;
}

export function FreeResponseQuestion(
  props: IFreeResponseQuestionProps & DefaultQuestionProps
) {
  const { _key, prompt, isRequired, isDisabled, saving, setValue } = props;
  return (
    <Form.Item key={_key} label={prompt} required={isRequired}>
      <TextArea
        autoSize
        disabled={isDisabled || saving}
        allowClear
        onChange={(event) => {
          setValue(event.target.value);
        }}
      />
    </Form.Item>
  );
}
