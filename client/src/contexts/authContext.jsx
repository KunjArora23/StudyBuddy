import { createContext, useEffect, useState } from "react"; // <-- added useEffect
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext();

function AuthContextProvider({ children }) {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [user, setUser] = useState({});
  const [updateUserIsLoading, setUpdateUserIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(null); // null = loading state

  // 🔁 Call getProfileHandler on app load
  useEffect(() => {
    getProfileHandler();
  }, []);

  const onSubmitHandler = async (e, type, navigate) => {
    e.preventDefault();
    const userInputData = type === "signup" ? signupData : loginData;
    let response = {};
    try {
      if (type === "signup") {
        response = await axios.post(
          "http://localhost:8080/api/v1/user/register",
          userInputData,
          { withCredentials: true }
        );
        setSignupData({ name: "", email: "", password: "" });
      } else {
        response = await axios.post(
          "http://localhost:8080/api/v1/user/login",
          userInputData,
          { withCredentials: true }
        );
        setLoginData({ email: "", password: "" });
        await getProfileHandler(); // fetch user after login
        navigate("/");
      }

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login/Signup failed");
      console.log(error);
    }
  };

  const onChangeHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setLoginData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const logoutHandler = async (navigate) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/user/logout",
        { withCredentials: true }
      );
      if (response) {
        setIsLogin(false);
        setUser({});
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const getProfileHandler = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/user/getProfile",
        { withCredentials: true }
      );
      const fetchedUser = response.data.user;

      setUser({
        id: fetchedUser._id,
        name: fetchedUser.name,
        email: fetchedUser.email,
        role: fetchedUser.role,
        photoUrl: fetchedUser.photoUrl,
        enrolledCourses: fetchedUser.enrolledCourses,
      });

      setIsLogin(true);
    } catch (error) {
      setIsLogin(false);
    }
  };

  const updateProfileHandler = async (e, name, profilePhoto) => {
    try {
      e.preventDefault();
      setUpdateUserIsLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      if (profilePhoto) {
        formData.append("avatar", profilePhoto);
      }

      const response = await axios.put(
        "http://localhost:8080/api/v1/user/update",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUpdateUserIsLoading(false);
      setUser(response.data.user);
      getProfileHandler();
      toast.success("Profile updated successfully!");
    } catch (error) {
      setUpdateUserIsLoading(false);
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile!");
    }
  };

  const value = {
    loginData,
    setLoginData,
    signupData,
    setSignupData,
    onSubmitHandler,
    onChangeHandler,
    logoutHandler,
    updateProfileHandler,
    getProfileHandler,
    isLogin,
    setIsLogin,
    user,
    setUser,
    updateUserIsLoading,
    setUpdateUserIsLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthContextProvider };
