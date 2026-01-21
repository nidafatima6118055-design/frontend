import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Astound ai | Intelligent Business Assistant",
};


export default function SignUp() {
  return <SignUpForm />;
}
