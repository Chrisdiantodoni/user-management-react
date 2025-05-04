import Loader from "@/components/ui/Loader";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <Suspense fallback={<Loader />}>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </Suspense>
  );
}

export default AuthLayout;
