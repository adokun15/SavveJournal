import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import HomePage from "./Starter/HomePage";
import Layout from "./Layout/Layout";
import EditJournal from "./Layout/EditJournal";
import Archived from "./Layout/ArchivedLists";
import ViewItem from "./Layout/ViewItem";
import { AuthAction } from "./Auth/AuthBody";
import { LogoutAction } from "./logout";
import JournalItem from "./Layout/JournalItems";
function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
      action: AuthAction,
    },
    {
      path: "/:id",
      element: <Layout />,
      children: [
        { index: true, element: <JournalItem /> },
        {
          path: ":JournalId/edit",
          element: <EditJournal />,
        },
        { path: "archived", element: <Archived /> },
        { path: ":JournalId", element: <ViewItem /> },
      ],
    },
    { path: "/logout", action: LogoutAction },
  ]);
  return <RouterProvider router={routes}></RouterProvider>;
}

export default App;
