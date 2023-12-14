import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./routes/Login/Login";
import Home from "./routes/Home/Home";
import UserProfile from "./components/UserProfile/UserProfile";
import Settings from "./components/Settings/Settings";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ContactUs from "./components/ContactUs/Contact";
import SinglePlayer from "./routes/SinglePlayer/SinglePlayer";
import RequestPass from "./routes/RequestPass/RequestPass";
import UpdatePass from "./routes/UpdatePass/UpdatePass";
import About from "./components/About/About";
import PVP from "./routes/PVP/PVP";
import { useEffect } from "react";

import { socket } from "./socket";
import useConfigStore from "./store/configStore";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/userProfile",
    element: <UserProfile />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/contact",
    element: <ContactUs />,
  },
  {
    path: "/single-player",
    element: <SinglePlayer />,
  },
  {
    path: "/requestPassword",
    element: <RequestPass />,
  },
  {
    path: "/updatePassword",
    element: <UpdatePass />,
  },
  {
    path: "/pvp/:matchid",
    element: <PVP />,
  },
  {
    path: "/about",
    element: <About />,
  },
]);

const App = () => {
  const isPlaying = useConfigStore((state) => state.isPlaying);
  const setIsConnected = useConfigStore((state) => state.setIsConnected);
  useEffect(() => {
    const onConnect = () => setIsConnected(true);

    socket.on("connect", onConnect);
  }, []);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
