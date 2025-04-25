/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Menu, School } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar } from "./ui/avatar";
import DarkMode from "@/DarkMode";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/authContext";

const Navbar = () => {
  const {
    logoutHandler,
    getProfileHandler,
    updateProfileHandler,
    isLogin,
    setIsLogin,
    user,
  } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // Dropdown open state

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        await getProfileHandler();
      } catch (error) {
        console.log(error);
        setIsLogin(false);
      }
    };
    checkUserSession();
  }, []);

  return (
    <div className="h-16 dark:bg-[#020817] bg-white border-b border-gray-200 dark:border-gray-800 fixed top-0 left-0 right-0 text-black dark:text-white z-10">
      {/* 📌 Desktop Navbar */}
      <div className="hidden md:flex max-w-7xl mx-auto justify-between items-center p-4">
        {/* Left Section - Logo & Brand Name */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <School size={30} />
          <h1 className="font-extrabold text-2xl">StudyBuddy</h1>
        </div>

        {/* Right Section - User & Dark Mode */}
        <div className="flex items-center gap-6">
          {isLogin ? (
            <div className="relative">
              <div className="cursor-pointer" onClick={() => setOpen(!open)}>
                <Avatar className="h-10 w-10 rounded-full object-cover">
                  <img
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt="avatar"
                    className="rounded-full w-full h-full"
                  />
                </Avatar>
              </div>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 text-black dark:text-white border dark:border-gray-700 rounded-md shadow-lg z-50">
                  <ul className="py-2">
                    <li>
                      <Link
                        to="/mylearning"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        My Learning
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => logoutHandler(navigate)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </li>
                    {user?.role === "instructor" && (
                      <li>
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Dashboard
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="outline" className="cursor-pointer">
                <Link to="/auth">Login</Link>
              </Button>
              <Button className="bg-black text-white dark:bg-transparent dark:text-inherit border border-black dark:border-gray-500 dark:hover:bg-[#1d1d1d]">
                <Link to="/auth">SignUp</Link>
              </Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>

      {/* 📌 Mobile Navbar */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        {/* Left - Logo */}
        <div className="flex items-center gap-2">
          <School size={28} />
          <h1 className="font-bold text-lg">StudyBuddy</h1>
        </div>
        {/* Right - Mobile Menu */}
        <MobileNavbar />
      </div>
    </div>
  );
};

export default Navbar;



const MobileNavbar = () => {
  const { isLogin, logoutHandler, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State to manage dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Function to toggle dropdown visibility
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div>
      {/* Hamburger Button */}
      <Button
        size="icon"
        className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
        variant="outline"
        onClick={toggleDropdown} // Toggle the dropdown on click
      >
        <Menu />
      </Button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute top-0 right-0 mt-2 w-48 bg-white dark:bg-gray-800 text-black dark:text-white border dark:border-gray-700 rounded-md shadow-lg z-50">
          <ul className="py-2 px-4 space-y-4">
            {isLogin ? (
              <div>
                <nav className="flex flex-col space-y-3 text-base md:text-lg font-medium">
                  <p className="hover:text-gray-500 transition">
                    <Link to="/mylearning">My Learning</Link>
                  </p>
                  <p className="hover:text-gray-500 transition">
                    <Link to="/profile">Profile</Link>
                  </p>
                  <p
                    className="hover:text-red-500 transition"
                    onClick={() => logoutHandler(navigate)}
                  >
                    Log out
                  </p>
                </nav>

                {user?.role === "instructor" && (
                  <div className="mt-4">
                    <Button
                      className="w-full bg-black text-white hover:bg-blue-700 transition"
                      onClick={() => navigate("/admin/dashboard")}
                    >
                      Dashboard
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Button
                  variant="outline"
                  className="w-full border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Link to="/auth">Login</Link>
                </Button>
                <Button className="w-full bg-black text-white dark:bg-transparent dark:text-white border border-black dark:border-gray-500 hover:bg-gray-900 dark:hover:bg-gray-800 transition">
                  <Link to="/auth">SignUp</Link>
                </Button>
              </div>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
