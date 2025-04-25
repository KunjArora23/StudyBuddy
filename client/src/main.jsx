import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthContextProvider } from "./contexts/authContext";
import { Toaster } from "sonner"; // ✅ Fix import
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import {
  Auth,
  Courses,
  HeroSection,
  MyLearning,
  Profile,
} from "./pages/imports/imports";
import { ToastContainer } from "react-toastify";
import Sidebar from "./pages/admin/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import CourseTable from "./pages/admin/course/CourseTable";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";
import CourseDetail from "./pages/student/CourseDetail";
import PaymentSuccess from "./pages/student/PaymentSuccess";
import CourseProgress from "./pages/student/CourseProgress";
import SearchPage from "./pages/student/SearchPage";
import { AdminRoute, AuthenticatedUser, ProtectedRoute } from "./components/ProtectedRoutes";
import PurchaseCourseProtectedRoute from "./components/PurchaseCourseProtectedRoute";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        ),
      },
      {
        path: "/auth",
        element: <AuthenticatedUser> <Auth /></AuthenticatedUser>,
      },
      {
        path: "/mylearning",
        element: <ProtectedRoute> <MyLearning /></ProtectedRoute>,
      },
      {
        path: "/profile",
        element: <ProtectedRoute> <Profile /></ProtectedRoute>,
      },
      {
        path: "/course/search",
        element: <ProtectedRoute> <SearchPage /></ProtectedRoute>,
      },
      {
        path: "/course-detail/:courseId",
        element: <ProtectedRoute> <CourseDetail /></ProtectedRoute>,
      },
      {
        path: "/paymentsuccess",
        element: <PaymentSuccess />,
      },
      {
        path: "/course-progress/:courseId",
        element: <ProtectedRoute> <PurchaseCourseProtectedRoute>
          <CourseProgress />
        </PurchaseCourseProtectedRoute></ProtectedRoute>,
      },



      // admin routes start from here
      {
        path: "/admin",
        element: <AdminRoute><Sidebar /></AdminRoute>,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "course",
            element: <CourseTable />,
          },
          {
            path: "course/create",
            element: <AddCourse />,
          },
          {
            path: "course/:courseId",
            element: <EditCourse />,
          },
          {
            path: "course/:courseId/lecture",
            element: <CreateLecture />,
          },
          {
            path: "course/:courseId/lecture/:lectureId",
            element: <EditLecture />,
          },
        ],
      },
    ],
  },


]);

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <ToastContainer position="bottom-right" autoClose={2000} />
    <RouterProvider router={appRouter}>
      <App />
    </RouterProvider>
  </AuthContextProvider>
);
