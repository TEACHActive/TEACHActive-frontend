import { Button } from "antd";
import { logoutOfFirebase } from "firebase/authController";
import { SizeType } from "antd/lib/config-provider/SizeContext";

export interface ILogoutButtonProps {
  size?: SizeType;
  type?:
    | "link"
    | "text"
    | "ghost"
    | "primary"
    | "default"
    | "dashed"
    | undefined;
}

export function LogoutButton(props: ILogoutButtonProps) {
  const logout = async () => {
    await logoutOfFirebase();
  };
  return (
    <Button
      danger
      type={props.type || "primary"}
      size={props.size || "small"}
      onClick={logout}
    >
      Logout
    </Button>
  );
}
