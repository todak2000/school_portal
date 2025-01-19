/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangePassword } from "../onboarding/changePassword";
import { ForgotPassword } from "../onboarding/forgotPassword";
import { ResetPassword } from "../onboarding/resetPassword";
import { SignIn } from "../onboarding/signin";
import UserProfileEdit from "../profile";

export const ModalChild = (
  type: string,
  data?: string | number | unknown | object | Record<string, any>
) => {
  switch (type) {
    case "login":
      return <SignIn />;
    case "forgot":
      return <ForgotPassword />;
    case "reset":
      return <ResetPassword />;
    case "change-password":
      return <ChangePassword />;
    case "profile":
      return <UserProfileEdit data={data as Record<string, any>} />;
    default:
      return (
        <span>
          {type} {data as string}
        </span>
      );
  }
};
