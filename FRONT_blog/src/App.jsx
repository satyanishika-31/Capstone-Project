import { createBrowserRouter, RouterProvider } from "react-router";
import { useEffect } from "react";
import { useAuth } from "./Store/authStore";
import RootLayout from "./Components/RootLayout";
import Home from "./Components/Home";
import Register from "./Components/Register";
import Login from "./Components/Login";
import UserProfile from "./Components/UserProfile";
import AuthorProfile from "./Components/AutherProfile";
import AuthorArticles from "./Components/AuthorArticles";
import WriteArticles from "./Components/WriteArticles";
import ArticleByID from "./Components/ArticleByID";
import EditArticle from "./Components/EditArticle";

function App() {
  const initializeAuth = useAuth((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout/>,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "user-profile",
          element: <UserProfile />,
        },
        {
          path: "author-profile",
          element: <AuthorProfile />,

          children: [
            {
              index: true,
              element: <AuthorArticles />,
            },
            {
              path: "articles",
              element: <AuthorArticles />,
            },
            {
              path: "write-article",
              element: <WriteArticles />,
            },
          ],
        },
        {
          path: "article/:id",
          element: <ArticleByID />,
        },
        {
          path: "edit-article",
          element: <EditArticle />,
        },
      ],
    },
  ]);

  return <RouterProvider router={routerObj} />;
}

export default App;
