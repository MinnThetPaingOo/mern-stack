import React from "react";
import About from "../pages/About.jsx";
import Home from "../pages/Home.jsx";
import Contact from "../pages/Contact.jsx";
import RecipeForm from "../pages/RecipeForm.jsx";
import SingUp from "../pages/SingUp.jsx";
import SingIn from "../pages/SingIn.jsx";
import App from "../App.jsx";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

export default function index() {
  let { user } = useContext(AuthContext);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: user ? <Home /> : <Navigate to={"/sing-in"} />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
        {
          path: "/recipes/create",
          element: user ? <RecipeForm /> : <Navigate to={"/sing-in"} />,
        },
        {
          path: "/recipes/edit/:id",
          element: <RecipeForm />,
        },
        {
          path: "/sing-up",
          element: !user ? <SingUp /> : <Navigate to={"/"} />,
        },
        {
          path: "/sing-in",
          element: !user ? <SingIn /> : <Navigate to={"/"} />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
