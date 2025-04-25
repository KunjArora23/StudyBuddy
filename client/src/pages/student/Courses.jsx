import { Skeleton } from "@/components/ui/skeleton";
import React, { use, useEffect, useState } from "react";
import { Course } from "./Course";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate=useNavigate()

  const getPublishedCourses = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      // fetching all the published courses
      const res = await axios.get(
        "http://localhost:8080/api/v1/course/getPublish",
        { withCredentials: true }
      );
      setCourses(res.data.courses);
      setIsLoading(false);
  
    } catch (error) {
      setIsError(true);
      console.log(error);
    }
  };

  const getCourseDetailsHandler=async()=>{

  }

  useEffect(() => {
    getPublishedCourses();
  }, []);

  if (isError) return <h1>Some error occurred while fetching courses.</h1>;

  return (
    <div className="bg-gray-50 dark:bg-[#141414]">
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="font-bold text-3xl text-center mb-10">Our Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))
          ) : courses.length > 0 ? (
            courses.map((course, index) => <Course key={index} course={course} />)
          ) : (
            <h1>No courses found</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export { Courses };

const CourseSkeleton = () => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
      <Skeleton className="w-full h-36" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};
