import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Builder from "./pages/Builder";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster />
    </>
  ),
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Landing,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
});

const builderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/builder/$projectId",
  component: Builder,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  dashboardRoute,
  builderRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
