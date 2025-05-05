/* eslint-disable react-hooks/exhaustive-deps */
import { Suspense, useEffect, useState } from "react";
import { LoginForm } from "./components/login-form";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import createStore from "./store";
import Loader from "./components/ui/Loader";
import Adminlayout from "./layout/AdminLayout";
import routes from "./routes";
import { useGetUser } from "./hooks/useGetUser";
import { Toaster } from "./components/ui/sonner";

function App() {
  const { isAuthenticated, handle } = createStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      handle("isAuthenticated", true);
    }
    setIsLoading(false);
  }, []);
  const token = localStorage.getItem("token") as string;
  const navigate = useNavigate();

  useGetUser({ navigate, token });
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route
            path="/auth/login"
            element={isAuthenticated ? <Navigate to="/" /> : <LoginForm />}
          />
        </Route>
        <Route element={<Adminlayout />}>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                <Suspense fallback={<Loader />}>{route.element}</Suspense>
              }
            />
          ))}
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
