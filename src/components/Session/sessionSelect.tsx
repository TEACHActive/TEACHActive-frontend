import Cascader, {
  CascaderOptionType,
  CascaderValueType,
} from "antd/lib/cascader";
import Select, { SelectValue } from "antd/lib/select";
import { LogoutButton } from "components/UserManagment/logoutButton";
import * as React from "react";

export interface ISessionSelectProps {
  isAdmin: boolean;
  cascaderOptions: CascaderOptionType[];
  cascaderDisplayRender: (
    label: string[],
    selectedOptions?: CascaderOptionType[] | undefined
  ) => React.ReactNode;
  cascaderLoadData: (
    selectedOptions?: CascaderOptionType[] | undefined
  ) => void;
  cascaderOnChange: (
    value: CascaderValueType,
    selectedOptions?: CascaderOptionType[] | undefined
  ) => void;
  selectOptions: {
    label: string;
    value: string;
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
              options={props.cascaderOptions}
              style={{ width: "200px" }}
              displayRender={props.cascaderDisplayRender}
              loadData={props.cascaderLoadData}
              onChange={props.cascaderOnChange}
            />
          </>
        ) : (
          <Select
            options={props.selectOptions}
            style={{ width: "200px" }}
            onChange={props.selectOnChange}
          />
        )}
      </div>
      <div>
        <LogoutButton type="default" />
      </div>
    </>
  );
}
