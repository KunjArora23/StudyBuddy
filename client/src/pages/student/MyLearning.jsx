import React, { useContext, useEffect, useState } from "react";
import { Course } from "./Course";
import axios from "axios";
import { AuthContext } from "@/contexts/authContext";
// import { useLoadUserQuery } from "@/features/api/authApi";

const MyLearning = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [myLearning, setMyLearning] = useState([]);
  const {user}=useContext(AuthContext)

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.enrolledCourses?.length) return;

      const courseDetails = await Promise.all(
        user.enrolledCourses.map(async (id) => {
          try {
            const res = await axios.get(
              `http://localhost:8080/api/v1/course/${id}`,
              {
                withCredentials: true,
              }
            );
            return res.data.course;
          } catch (error) {
            console.error(`Failed to load course ${id}`, error);
            return null;
          }
        })
      );

      setMyLearning(courseDetails.filter(Boolean));
    };

    if (user) {
      fetchCourses();
    }
  }, [user]);
  return (
    <div className="max-w-4xl mx-auto my-10 px-4 md:px-0">
      <h1 className="font-bold text-2xl">MY LEARNING</h1>
      <div className="my-5">
        {isLoading ? (
          <MyLearningSkeleton />
        ) : myLearning.length === 0 ? (
          <p>You are not enrolled in any course.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {myLearning.map((course, index) => (
              <Course key={index} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { MyLearning };

// Skeleton component for loading state
const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
      ></div>
    ))}
  </div>
);
