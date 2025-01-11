import { ChangePassword } from "../onboarding/changePassword";
import { ForgotPassword } from "../onboarding/forgotPassword";
import { ResetPassword } from "../onboarding/resetPassword";
import { SignIn } from "../onboarding/signin";

export const ModalChild = (
  type: string,
  data?: string | number | unknown | object
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
    default:
      return (
        <span>
          {type} {data as string}
        </span>
      );
  }
};
