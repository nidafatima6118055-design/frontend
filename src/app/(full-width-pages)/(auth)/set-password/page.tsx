import SetPassword from "@/components/auth/SetPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Astound ai | Intelligent Business Assistant",
};


export default function SignIn() {
  return <SetPassword />;
}
