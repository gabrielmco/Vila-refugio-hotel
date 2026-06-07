import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";

const router = createBrowserRouter([
    {
        path: "/", // Root route
        element: <MainLayout />, // Layout wrapper
        children: [
            { path: "", element: <Home /> }, // default page
        ],
    },
], {
    basename: import.meta.env.BASE_URL
});

export default router;
