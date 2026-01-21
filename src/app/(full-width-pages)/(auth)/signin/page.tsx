import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Astound ai | Intelligent Business Assistant",
};


export default function SignIn() {
  return <SignInForm />;
}
