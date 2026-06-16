import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

export const metadata = { title: "登入 — W-BOX" };

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
