import { redirect } from "react-router-dom";
export const LogoutAction = () => {
  localStorage.removeItem("user");

  return redirect("/");
};
