import {
  Button,
  Checkbox,
  Form,
  Input,
  Radio,
  Select,
  Slider,
  Spin,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import apiHandler from "api/handler";
import * as React from "react";
import {
  MultiChoiceQuestion,
  NestedChoiceQuestionOption,
  QuestionType,
  ReflectionSection,
  ReflectionSectionQuestion,
  ReflectionSectionQuestionOnSelected,
  SingleChoiceQuestion,
} from "./goalsPage.types";

const { Option } = Select;

export interface ISectionFormProps {
  section: ReflectionSection;
  metricDisplay?: React.ReactNode;
  comment: React.ReactNode;
  sessionId: string;
  userUID: string;
}

export function SectionForm(props: ISectionFormProps) {
  const [updateMap, setUpdateMap] = React.useState(
    new Map<string, ReflectionSectionQuestion>()
  );
  const [saving, setSaving] = React.useState(false);
  const [initialValues, setInitialValues] = React.useState<any>(null);

  const [sectionQuestions, setSectionQuestions] = React.useState<
    ReflectionSectionQuestion[]
  >([]);

  React.useEffect(() => {
    setSectionQuestions([...props.section.questions]);
    fillInitialValues([...props.section.questions]);
  }, []);

  const onSave = async (values: any) => {
    setSaving(true);

    const updateMapObj = Object.fromEntries(updateMap);

    // console.log(Object.keys(updateMapObj).map((key) => updateMapObj[key]));

    let response = await apiHandler.updateReflections(
      props.sessionId,
      props.userUID,
      Object.keys(updateMapObj).map((key) => updateMapObj[key])
    );
    setSaving(false);
  };
  const onSaveFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const fillInitialValues = (questions: ReflectionSectionQuestion[]) => {
    let initialValues: Map<string, any> = new Map<string, any>();
    const newQuestions = questions.map((question) => {
      switch (question.onSelected.questionType) {
        case QuestionType.multiChoiceQuestion:
          let multipleSelectedCheckboxes: string[] = [];
          multipleSelectedCheckboxes =
            question.onSelected.multiChoiceQuestion?.options
              .filter((option) => option.selected)
              .map((option) => option.label) || [];

          if (
            question.onSelected.multiChoiceQuestion?.hasOther &&
            question.onSelected.multiChoiceQuestion?.otherSelected
          ) {
            multipleSelectedCheckboxes.push("other"); ///Todo?
          }

          initialValues.set(question.id, {
            base: [...multipleSelectedCheckboxes],
            other: question.onSelected.multiChoiceQuestion?.otherValue,
          });

          // if (question.onSelected.multiChoiceQuestion?.hasOther) {
          //   initialValues.set(
          //     question.id + "-other",
          //     question.onSelected.multiChoiceQuestion?.otherValue
          //   );
          // }

          break;
        case QuestionType.freeResponseQuestion:
          initialValues.set(
            question.id,
            question.onSelected.freeResponseQuestion?.feild
          );

          break;
        case QuestionType.likertQuestion:
          initialValues.set(
            question.id,
            question.onSelected.likertQuestion?.value
          );
          break;
        case QuestionType.singleChoiceQuestion:
          const singleSelectedCheckboxes = question.onSelected.singleChoiceQuestion?.options
            .filter((option) => option.selected)
            .map((option) => option.value);

          initialValues.set(question.id, singleSelectedCheckboxes);

          if (question.onSelected.singleChoiceQuestion?.hasOther) {
            initialValues.set(
              question.id + "-other",
              question.onSelected.singleChoiceQuestion?.otherValue
            );
          }

          break;
        case QuestionType.ynQuestion:
          if (question.onSelected.ynQuestion?.no.selected) {
            initialValues.set(question.id, "no");
          } else if (question.onSelected.ynQuestion?.yes.selected) {
            initialValues.set(question.id, "yes");
          }

          break;
        default:
          break;
      }

      let multiChoiceQuestionOptionsWithOther;
      if (question.onSelected.multiChoiceQuestion) {
        multiChoiceQuestionOptionsWithOther =
          question.onSelected.multiChoiceQuestion.options;

        if (
          question.onSelected.multiChoiceQuestion &&
          question.onSelected.multiChoiceQuestion.hasOther &&
          question.onSelected.multiChoiceQuestion.options.findIndex(
            (option) => (option.label ?? option.value).toLowerCase() === "other"
          ) === -1 //Dont add "other" if it already exists
        ) {
          multiChoiceQuestionOptionsWithOther.push(
            new NestedChoiceQuestionOption({
              value: "Other",
              label: "Other",
              selected: question.onSelected.multiChoiceQuestion.otherSelected,
            })
          );
        } else if (
          question.onSelected.multiChoiceQuestion &&
          question.onSelected.multiChoiceQuestion.hasOther &&
          question.onSelected.multiChoiceQuestion.options.findIndex(
            (option) => (option.label ?? option.value).toLowerCase() === "other"
          ) !== -1
        ) {
          //Somehow other already exists, set Selected val
          multiChoiceQuestionOptionsWithOther.map((option) => {
            if ((option.label ?? option.value).toLowerCase() === "other") {
              return {
                ...option,
                selected:
                  question.onSelected.multiChoiceQuestion?.otherSelected,
              };
            }
            return option;
          });
        }
      }

      let singleChoiceQuestionOptionsWithOther;
      if (question.onSelected.singleChoiceQuestion) {
        singleChoiceQuestionOptionsWithOther =
          question.onSelected.singleChoiceQuestion.options;
        if (
          question.onSelected.singleChoiceQuestion &&
          question.onSelected.singleChoiceQuestion.hasOther &&
          question.onSelected.singleChoiceQuestion.options.findIndex(
            (option) => (option.label ?? option.value).toLowerCase() === "other"
          ) === -1 //Dont add "other" if it already exists
        ) {
          singleChoiceQuestionOptionsWithOther.push(
            new NestedChoiceQuestionOption({
              value: "Other",
              label: "Other",
              selected: question.onSelected.singleChoiceQuestion.otherSelected,
            })
          );
        } else if (
          question.onSelected.singleChoiceQuestion &&
          question.onSelected.singleChoiceQuestion.hasOther &&
          question.onSelected.singleChoiceQuestion.options.findIndex(
            (option) => (option.label ?? option.value).toLowerCase() === "other"
          ) !== -1
        ) {
          //Somehow other already exists, set Selected val
          singleChoiceQuestionOptionsWithOther.map((option) => {
            if ((option.label ?? option.value).toLowerCase() === "other") {
              return {
                ...option,
                selected:
                  question.onSelected.singleChoiceQuestion?.otherSelected,
              };
            }
            return option;
          });
        }
      }

      const reflectionSectionData = {
        ...question,
        onSelected: {
          ...question.onSelected,
          ynQuestion: question.onSelected.ynQuestion,
          multiChoiceQuestion: question.onSelected.multiChoiceQuestion
            ? new MultiChoiceQuestion({
                options: multiChoiceQuestionOptionsWithOther,
                hasOther: question.onSelected.multiChoiceQuestion?.hasOther,
                otherValue: question.onSelected.multiChoiceQuestion?.otherValue,
                otherSelected:
                  question.onSelected.multiChoiceQuestion?.otherSelected,
              })
            : null,
          singleChoiceQuestion: question.onSelected.singleChoiceQuestion
            ? new SingleChoiceQuestion({
                options: singleChoiceQuestionOptionsWithOther,
                hasOther: question.onSelected.singleChoiceQuestion?.hasOther,
                otherValue:
                  question.onSelected.singleChoiceQuestion?.otherValue,
                otherSelected:
                  question.onSelected.singleChoiceQuestion?.otherSelected,
              })
            : null,
          freeResponseQuestion: question.onSelected.freeResponseQuestion,
          likertQuestion: question.onSelected.likertQuestion,
        },
      };

      return new ReflectionSectionQuestion(reflectionSectionData);
    });

    setSectionQuestions(newQuestions);
    setInitialValues(Object.fromEntries(initialValues));
  };

  if (initialValues === null) return <Spin />;

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2em" }}>
      <Form
        name="sectionForm"
        initialValues={initialValues}
        onFinish={onSave}
        onFinishFailed={onSaveFailed}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        {props.metricDisplay && <Form.Item>{props.metricDisplay}</Form.Item>}
        {props.comment && <Form.Item>{props.comment}</Form.Item>}
        {sectionQuestions
          .sort((q1, q2) => q1.priority - q2.priority)
          .map((question, i) => {
            if (!question.onSelected) return null;
            let currQuestion;
            switch (question.onSelected.questionType) {
              case QuestionType.freeResponseQuestion:
                return (
                  <Form.Item
                    key={i}
                    label={question.onSelected.prompt}
                    name={question.id}
                    required={question.required}
                  >
                    <TextArea
                      autoSize
                      disabled={saving}
                      allowClear
                      onChange={(event) => {
                        setUpdateMap(
                          new Map(
                            updateMap.set(question.id, {
                              ...question,
                              onSelected: {
                                ...question.onSelected,
                                freeResponseQuestion: {
                                  ...question.onSelected?.freeResponseQuestion,
                                  feild: event.target.value,
                                },
                              },
                            })
                          )
                        );
                      }}
                    />
                  </Form.Item>
                );
              case QuestionType.likertQuestion:
                currQuestion = question.onSelected.likertQuestion;

                let qMinValue = currQuestion?.minValue || 1;
                let qMaxValue = currQuestion?.maxValue || 5;
                if (qMaxValue < qMinValue) {
                  //flip them if the wrong way around
                  const temp = qMaxValue;
                  qMaxValue = qMinValue;
                  qMinValue = temp;
                }
                //Calculate marks
                var marks = [];
                for (
                  let markIndex = qMinValue;
                  markIndex <= qMaxValue;
                  markIndex++
                ) {
                  marks.push(markIndex);
                }

                return (
                  <Form.Item
                    key={i}
                    label={question.onSelected.prompt}
                    name={question.id}
                    required={question.required}
                  >
                    <Slider
                      disabled={saving}
                      style={{ width: `${marks.length * 50}px` }}
                      marks={marks.reduce(
                        (o, key) => ({ ...o, [key]: key.toString() }),
                        {}
                      )}
                      min={currQuestion?.minValue || 1}
                      max={currQuestion?.maxValue || 5}
                      value={currQuestion?.value || 1}
                      onAfterChange={(value: number) => {
                        setUpdateMap(
                          new Map(
                            updateMap.set(question.id, {
                              ...question,
                              onSelected: {
                                ...question.onSelected,
                                likertQuestion: {
                                  ...question.onSelected.likertQuestion,
                                  value: value,
                                },
                              },
                            })
                          )
                        );
                      }}
                    />
                  </Form.Item>
                );
              case QuestionType.multiChoiceQuestion:
                currQuestion = question.onSelected.multiChoiceQuestion;

                let questionOptions = currQuestion?.options;

                return (
                  <React.Fragment key={i}>
                    <Form.Item
                      label={question.onSelected.prompt}
                      name={[question.id, "base"]}
                      required={question.required}
                    >
                      <Checkbox.Group
                        disabled={saving}
                        style={{ display: "flex", flexDirection: "column" }}
                        options={questionOptions}
                        onChange={(checkedValues) => {
                          setUpdateMap(
                            new Map(
                              updateMap.set(question.id, {
                                ...question,
                                onSelected: {
                                  ...question.onSelected,
                                  multiChoiceQuestion: {
                                    ...question.onSelected?.multiChoiceQuestion,
                                    options: question.onSelected
                                      .multiChoiceQuestion
                                      ? question.onSelected.multiChoiceQuestion?.options
                                          .map((option) => {
                                            return {
                                              label: option.label,
                                              value: option.label,
                                              selected:
                                                checkedValues.findIndex(
                                                  (value) =>
                                                    value.valueOf() ===
                                                    option.label
                                                ) !== -1,
                                            };
                                          })
                                          .filter(
                                            (option) =>
                                              (
                                                option.label ?? option.value
                                              ).toLowerCase() !== "other"
                                          )
                                      : [],
                                    otherSelected:
                                      checkedValues.findIndex(
                                        (value) =>
                                          value.toString().toLowerCase() ===
                                          "other"
                                      ) !== -1,
                                  },
                                },
                              })
                            )
                          );
                          const newQuestions = sectionQuestions.map(
                            (sectionQuestion) => {
                              if (sectionQuestion.id !== question.id) {
                                return sectionQuestion;
                              }

                              return {
                                ...sectionQuestion,
                                onSelected: {
                                  ...sectionQuestion.onSelected,
                                  multiChoiceQuestion: {
                                    ...sectionQuestion.onSelected
                                      .multiChoiceQuestion,
                                    options: question.onSelected
                                      .multiChoiceQuestion
                                      ? question.onSelected.multiChoiceQuestion?.options.map(
                                          (option) => {
                                            return {
                                              label: option.label,
                                              value: option.label,
                                              selected:
                                                checkedValues.findIndex(
                                                  (value) =>
                                                    value.valueOf() ===
                                                    option.label
                                                ) !== -1,
                                            };
                                          }
                                        )
                                      : [],
                                  },
                                },
                              };
                            }
                          );
                          setSectionQuestions(newQuestions);
                        }}
                      />
                    </Form.Item>
                    {question.onSelected.multiChoiceQuestion?.hasOther &&
                      currQuestion?.options.find(
                        (option) =>
                          (option.label ?? option.value).toLowerCase() ===
                          "other"
                      )?.selected && (
                        <Form.Item
                          label={"Other"}
                          name={[question.id, "other"]}
                          required={
                            question.onSelected.multiChoiceQuestion?.hasOther
                          }
                        >
                          <Input
                            onChange={(e) => {
                              setUpdateMap(
                                new Map(
                                  updateMap.set(question.id, {
                                    ...question,
                                    onSelected: {
                                      ...question.onSelected,
                                      multiChoiceQuestion: {
                                        ...question.onSelected
                                          .multiChoiceQuestion,
                                        options:
                                          question.onSelected
                                            .multiChoiceQuestion?.options ?? [],
                                        otherValue: e.target.value,
                                      },
                                    },
                                  })
                                )
                              );
                            }}
                          />
                        </Form.Item>
                      )}
                  </React.Fragment>
                );
              case QuestionType.singleChoiceQuestion:
                currQuestion = question.onSelected.singleChoiceQuestion;

                return (
                  <Form.Item
                    key={i}
                    label={question.onSelected.prompt}
                    name={question.id}
                    required={question.required}
                  >
                    <Select
                      disabled={saving}
                      placeholder={question.placeHolder}
                      allowClear
                      onChange={(value) => {
                        setUpdateMap(
                          new Map(
                            updateMap.set(question.id, {
                              ...question,
                              onSelected: {
                                ...question.onSelected,
                                singleChoiceQuestion: {
                                  ...question.onSelected?.singleChoiceQuestion,
                                  options: question.onSelected
                                    .singleChoiceQuestion
                                    ? question.onSelected.singleChoiceQuestion?.options
                                        .map((option) => {
                                          let selected;
                                          if (Array.isArray(value)) {
                                            selected =
                                              value.findIndex(
                                                (a: any) =>
                                                  a.valueOf() === option.value
                                              ) !== -1;
                                          } else {
                                            //A single number
                                            selected = value === option.value;
                                          }
                                          return {
                                            label: option.value,
                                            value: option.value,
                                            selected: selected,
                                          };
                                        })
                                        .filter(
                                          (option) =>
                                            (
                                              option.label ?? option.value
                                            ).toLowerCase() !== "other"
                                        )
                                    : [],
                                  otherSelected: value
                                    ? value.toString().toLowerCase() === "other"
                                    : false,
                                },
                              },
                            })
                          )
                        );
                      }}
                    >
                      {currQuestion?.options.map((option, i) => (
                        <Option
                          key={i}
                          value={option.value || option.label || i}
                        >
                          {option.value || option.label || i}
                        </Option>
                      ))}
                    </Select>
                    {question.onSelected.singleChoiceQuestion?.hasOther &&
                      currQuestion?.options.find(
                        (option) =>
                          (option.label ?? option.value).toLowerCase() ===
                          "other"
                      )?.selected && (
                        <Form.Item
                          label={"Other"}
                          name={[question.id, "other"]}
                          required={
                            question.onSelected.singleChoiceQuestion?.hasOther
                          }
                        >
                          <Input
                            onChange={(e) => {
                              setUpdateMap(
                                new Map(
                                  updateMap.set(question.id, {
                                    ...question,
                                    onSelected: {
                                      ...question.onSelected,
                                      singleChoiceQuestion: {
                                        ...question.onSelected
                                          .singleChoiceQuestion,
                                        options:
                                          question.onSelected
                                            .singleChoiceQuestion?.options ??
                                          [],
                                        otherValue: e.target.value,
                                      },
                                    },
                                  })
                                )
                              );
                            }}
                          />
                        </Form.Item>
                      )}
                  </Form.Item>
                );
              case QuestionType.ynQuestion:
                currQuestion = question.onSelected.ynQuestion;

                return (
                  <Form.Item
                    key={i}
                    label={question.onSelected.prompt}
                    name={question.id}
                    required={question.required}
                  >
                    <Radio.Group
                      disabled={saving}
                      onChange={(event) => {
                        setUpdateMap(
                          new Map(
                            updateMap.set(question.id, {
                              ...question,
                              onSelected: {
                                ...question.onSelected,
                                ynQuestion: {
                                  ...question.onSelected.ynQuestion,
                                  yes: {
                                    ...question.onSelected.ynQuestion?.yes,
                                    value: "",
                                    label: "",
                                    selected: event.target.value === "yes",
                                  },
                                  no: {
                                    ...question.onSelected?.ynQuestion?.no,
                                    value: "",
                                    label: "",
                                    selected: event.target.value === "no",
                                  },
                                },
                              },
                            })
                          )
                        );
                      }}
                    >
                      <Radio value="yes" checked={currQuestion?.yes.selected}>
                        Yes
                      </Radio>
                      <Radio value="no" checked={currQuestion?.no.selected}>
                        No
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                );
              default:
                return null;
            }
          })}
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={saving}
            disabled={saving}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
