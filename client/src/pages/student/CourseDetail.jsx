/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-constant-condition */
// import BuyCourseButton from "@/components/BuyCourseButton";
import BuyCourseButton from "@/components/BuyCourseButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AuthContext } from "@/contexts/authContext";
import axios from "axios";
import { BadgeInfo, Loader, Loader2, Lock, PlayCircle } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetail = () => {
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();
  const [course, setCourse] = useState({});
  const [purchased, setPurchased] = useState(false);
  const { user } = useContext(AuthContext);

  const getCourseDetails = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/course/${courseId}`,
        { withCredentials: true }
      );

      setCourse(res.data.course);

      if (user && res.data.course.enrolledStudents.includes(user.id)) {
        setPurchased(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCourseDetails();
  }, [courseId, user]);

  const handleContinueCourse = () => {
    if (purchased) {
      navigate(`/course-progress/${courseId}`);
    }
  };

  if (!course || !course.lectures) {
    return (
      <div className="p-4">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="bg-[#2D2F31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">
            {course?.courseTitle}
          </h1>
          <p className="text-base md:text-lg">{course?.subTitle}</p>
          <p>
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic">
              {course?.creator?.name}
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last updated {course?.createdAt.split("T")[0]}</p>
          </div>
          <p>Students enrolled: {course?.enrolledStudents.length}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: course.description }}
          />
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>4 lectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {course.lectures.map((lecture, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span className=" font-bold text-lg">
                    {lecture.isPreviewFree ? (
                      <PlayCircle size={14} />
                    ) : (
                      <Lock size={14} />
                    )}
                  </span>
                  <p>{lecture.lectureTitle}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="w-full lg:w-1/3">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="w-full aspect-video mb-4">
                <ReactPlayer
                  width="100%"
                  height={"100%"}
                  url={course.lectures[0].videoUrl}
                  controls={true}
                />
              </div>
              <h1 className="font-bold text-2xl">
                {course.lectures[0].lectureTitle}
              </h1>
              <Separator className="my-2" />
              <h1 className="text-lg md:text-xl font-semibold">
                {`Course Price: ₹${course.coursePrice} `}{" "}
              </h1>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              {purchased ? (
                <Button onClick={handleContinueCourse} className="w-full">
                  Continue Course
                </Button>
              ) : (
                <BuyCourseButton courseId={courseId} user={user} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
