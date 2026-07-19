import { SignUpForm } from "~/app/_components/sign-up-form";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-b from-[#2e026d] to-[#15162c] px-4 text-white">
      <h1 className="text-4xl font-extrabold tracking-tight">
        Create an <span className="text-[hsl(280,100%,70%)]">account</span>
      </h1>
      <SignUpForm />
    </main>
  );
}
