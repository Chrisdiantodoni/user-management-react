import { lazy } from "react";
import { RouteProps } from "react-router-dom";

const AUTH = {
  LOGIN: lazy(() => import("./pages/auth/Login.tsx")),
};
const DASHBOARD = {
  DASHBOARD: lazy(() => import("./pages/home/Dashboard.tsx")),
};

const USER = {
  USER: lazy(() => import("./pages/user/User.tsx")),
  USERDETAIL: lazy(() => import("./pages/user/detail/User.tsx")),
};

const loginRoutes: RouteProps[] = [
  {
    path: "/auth/login",
    element: <AUTH.LOGIN />,
  },
];

const dashboardRoutes: RouteProps[] = [
  {
    path: "/",
    element: <DASHBOARD.DASHBOARD />,
  },
];

const userRoutes: RouteProps[] = [
  {
    path: "/user-list",
    element: <USER.USER />,
  },
  {
    path: "/user-list/:id",
    element: <USER.USERDETAIL />,
  },
];

const routes = [...dashboardRoutes, ...loginRoutes, ...userRoutes];

export default routes;
