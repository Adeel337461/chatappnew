import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import MessagePage from "../components/MessagePage";
import AuthLayouts from "../layout";
import Register from "../pages/register";
import LOGIN from "../pages/login";
import Dashboard from "../pages/dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "register",
        element: (
          <AuthLayouts>
            <Register />
          </AuthLayouts>
        ),
      },
      {
        path: "login",
        element: (
          <AuthLayouts>
            <LOGIN />
          </AuthLayouts>
        ),
      },
      {
        path: "",
        element: <Dashboard />,
        children: [
          {
            path: ":userId",
            element: <MessagePage />,
          },
        ],
      },
    ],
  },
]);

export default router;
