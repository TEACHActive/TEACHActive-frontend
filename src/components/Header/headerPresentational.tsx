import { LoadingOutlined, ReloadOutlined } from "@ant-design/icons";
import { Layout, Cascader, Select } from "antd";
import { LogoutButton } from "components/UserManagment/logoutButton";

import "./header.scss";

const { Header: AntHeader } = Layout;

export interface IHeaderPresentationalProps {
  loadingUsers: boolean;
  reloadUsers: () => void;
}

export function HeaderPresentational(props: IHeaderPresentationalProps) {
  return (
    <AntHeader className="header">
      <div>
        <Cascader />
        {props.loadingUsers ? (
          <LoadingOutlined className="loadIcon" />
        ) : (
          <ReloadOutlined
            className="loadIcon"
            onClick={() => props.reloadUsers()}
          />
        )}
        <Select />
      </div>
      <div>
        <LogoutButton type="default" />
      </div>
    </AntHeader>
  );
}
