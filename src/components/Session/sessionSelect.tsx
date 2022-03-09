import * as React from "react";
import Cascader, {
  CascaderOptionType,
  CascaderValueType,
} from "antd/lib/cascader";
import Select, { SelectValue } from "antd/lib/select";
import { ISession } from "api/services/sessions/types";
import { LogoutButton } from "components/UserManagment/logoutButton";
import { Tooltip } from "antd";
import { DateTime } from "luxon";

const { Option } = Select;

export interface ISessionSelectProps {
  selectedSession?: ISession;
  isAdmin: boolean;
  cascaderOptions: CascaderOptionType[];
  cascaderDisplayRender: (
    label: string[],
    selectedOptions?: CascaderOptionType[]
  ) => React.ReactNode;
  cascaderLoadData: (selectedOptions?: CascaderOptionType[]) => void;
  cascaderOnChange: (
    value: CascaderValueType,
    selectedOptions?: CascaderOptionType[]
  ) => void;
  selectOptions: {
    label: string;
    value: string;
    dateTime: DateTime;
  }[];
  selectOnChange: (value: SelectValue) => void;
}

export function SessionSelect(props: ISessionSelectProps) {
  return (
    <>
      <div>
        {props.isAdmin ? (
          <>
            <Cascader
              defaultValue={
                props.selectedSession?.id
                  ? [props.selectedSession?.id]
                  : undefined
              } //TODO: Determine if this fixes the issue of cascader being unset sometimes
              options={props.cascaderOptions}
              style={{ width: "200px" }}
              displayRender={props.cascaderDisplayRender}
              loadData={props.cascaderLoadData}
              onChange={props.cascaderOnChange}
            />
          </>
        ) : (
          <Select
            defaultValue={props.selectedSession?.id} //TODO: Determine if this fixes the issue of select being unset sometimes
            // options={props.selectOptions}
            style={{ width: "200px" }}
            onChange={props.selectOnChange}
          >
            {props.selectOptions.map((selectOption) => (
              <Option value={selectOption.value}>
                <Tooltip
                  placement="right"
                  title={selectOption.dateTime.toLocaleString()}
                >
                  {selectOption.label}
                </Tooltip>
              </Option>
            ))}
          </Select>
        )}
      </div>
      <div>
        <LogoutButton type="default" />
      </div>
    </>
  );
}
