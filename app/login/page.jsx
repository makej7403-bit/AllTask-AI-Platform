"use client";
import dynamic from "next/dynamic";

const GoogleSignIn = dynamic(
  () => import("@/app/components/GoogleSignIn"),
  { ssr: false }
);

export default function LoginPage() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>
      <GoogleSignIn />
    </div>
  );
}
