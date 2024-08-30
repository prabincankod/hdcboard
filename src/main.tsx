import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "@/styles/globals.css";
import Loginpage from "./screens/Loginpage.tsx";
import Categorypage from "./screens/Categorypage.tsx";

const baseRouter = createBrowserRouter([
  { path: "/", element: <App /> },

  { path: "/login", element: <Loginpage /> },
  {
    path: "/class/:slug/",
    element: <Categorypage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={baseRouter} />
  </React.StrictMode>
);
