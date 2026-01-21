import ForgotPassword from "@/components/auth/ForgotPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Astound ai | Intelligent Business Assistant",
};


export default function SignIn() {
  return <ForgotPassword />;
}
