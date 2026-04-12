import LoginForm from "./LoginForm";

export const metadata = {
  title: "Admin — HanziUz",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
        <h1 className="text-xl font-semibold mb-1">HanziUz Admin</h1>
        <p className="text-sm text-neutral-500 mb-6">
          Boshqaruv paneliga kirish
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
