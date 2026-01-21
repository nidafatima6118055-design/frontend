import ChangePassword from "@/components/auth/ChangePassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Astound ai | Intelligent Business Assistant",
};


export default function SignIn() {
  return <ChangePassword />;
}
