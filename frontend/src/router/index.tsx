import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense, type ReactNode } from "react";
import { DashboardLayout } from "../components/layouts/DashboardLayout";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Portfolio = lazy(() => import("../pages/Portfolio"));
const Predictions = lazy(() => import("../pages/Predictions"));
const Journal = lazy(() => import("../pages/Journal"));
const Training = lazy(() => import("../pages/Training"));
const DataControl = lazy(() => import("../pages/DataControl"));
const TickerDetail = lazy(() => import("../pages/TickerDetail"));

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: (
          <LazyPage>
            <Dashboard />
          </LazyPage>
        ),
      },
      {
        path: "portfolio",
        element: (
          <LazyPage>
            <Portfolio />
          </LazyPage>
        ),
      },
      {
        path: "predictions",
        element: (
          <LazyPage>
            <Predictions />
          </LazyPage>
        ),
      },
      {
        path: "predictions/:ticker",
        element: (
          <LazyPage>
            <TickerDetail />
          </LazyPage>
        ),
      },
      {
        path: "journal",
        element: (
          <LazyPage>
            <Journal />
          </LazyPage>
        ),
      },
      {
        path: "training",
        element: (
          <LazyPage>
            <Training />
          </LazyPage>
        ),
      },
      {
        path: "data",
        element: (
          <LazyPage>
            <DataControl />
          </LazyPage>
        ),
      },
    ],
  },
]);
