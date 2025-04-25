// Zaroori components aur libraries import kar rahe hain

import LoadingSpinner from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const CourseProgress = () => {
  const COURSE_PROGRESS_API_URL = "http://localhost:8080/api/v1/course-progress";

  // State variables: course ki details, course complete hua ya nahi, dekhe gaye lectures, aur current lecture
  const [courseDetails, setCourseDetails] = useState({});
  const [completed, setCompleted] = useState(false);
  const [viewedLectures, setViewedLectures] = useState([]);
  const [currentLecture, setCurrentLecture] = useState(null);

  // Pehli baar load hone wale lecture ko store karne ke liye ref
  const initialLecture = useRef(null);

  // URL se courseId nikaal rahe hain
  const { courseId } = useParams();

  // Course ki details aur progress backend se le rahe hain jab component load ho ya courseId badle
  const getCourseProgressDetails = async () => {
    try {
      const res = await axios.get(`${COURSE_PROGRESS_API_URL}/${courseId}`, {
        withCredentials: true,
      });

      const { courseDetails, courseProgress, completed } = res.data.data;

      // Backend se aayi data ko set kar rahe hain
      setCourseDetails(courseDetails);
      setCompleted(completed);

      // ✅ Agar abhi koi current lecture set nahi hai, toh pehla lecture set kar do
      if (!currentLecture) {
        const firstLecture = courseDetails.lectures[0];
        setCurrentLecture(firstLecture);
        initialLecture.current = firstLecture;
      }

      // Sirf un lectures ke IDs nikaal rahe hain jo viewed hain
      const viewed = courseProgress
        ?.filter((lecture) => lecture.viewed)
        .map((lecture) => lecture.lectureId);

      setViewedLectures(viewed || []);
    } catch (error) {
      console.error("Error fetching course progress", error);
    }
  };

  // Jab video play ho, tab lecture ko viewed mark kar rahe hain
  const handleLectureProgress = async (lectureId) => {
    try {
      await axios.post(
        `${COURSE_PROGRESS_API_URL}/${courseId}/lecture/${lectureId}/view`,
        {},
        { withCredentials: true }
      );
      // Lecture ko viewed mark karne ke baad data ko refresh karte hain
      getCourseProgressDetails();
    } catch (error) {
      console.error("Error updating lecture progress", error);
    }
  };

  // Pura course complete mark karne ka handler
  const handleMarkCompleted = async () => {
    await axios.post(
      `${COURSE_PROGRESS_API_URL}/${courseId}/complete`,
      {},
      { withCredentials: true }
    );
    getCourseProgressDetails();
  };

  // Course ko incomplete mark karne ka handler (undo completion)
  const handleMarkInCompleted = async () => {
    await axios.post(
      `${COURSE_PROGRESS_API_URL}/${courseId}/incomplete`,
      {},
      { withCredentials: true }
    );
    getCourseProgressDetails();
  };

  // Lecture complete hai ya nahi check karne ke liye function
  const isLectureCompleted = (lectureId) => viewedLectures.includes(lectureId);

  // Jab user sidebar se koi lecture select karta hai
  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
  };

  // Component load hone par ya courseId change hone par data fetch karo
  useEffect(() => {
    getCourseProgressDetails();
  }, [courseId]);

  // Jab tak course ki lectures aayi nahi hain, tab tak loading spinner dikhao
  if (!courseDetails.lectures) {
    return <LoadingSpinner />;
  }

  // Kaunsa lecture video player me dikhana hai ye decide kar rahe hain
  const lectureToShow = currentLecture || initialLecture.current || {};

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Upar course ka title aur completed/incomplete button */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{courseDetails.courseTitle}</h1>
        <Button
          onClick={completed ? handleMarkInCompleted : handleMarkCompleted}
          variant={completed ? "outline" : "default"}
          className="cursor-pointer"
        >
          {completed ? (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Completed</span>
            </div>
          ) : (
            "Mark as completed"
          )}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Video Player ka section */}
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <video
            src={lectureToShow.videoUrl}
            controls
            className="w-full h-[400px] object-contain md:rounded-lg"
            onPlay={() => handleLectureProgress(lectureToShow._id)}
          />
          <div className="mt-2">
            <h3 className="font-medium text-lg">
              {`Lecture ${
                courseDetails.lectures.findIndex(
                  (lec) => lec._id === lectureToShow._id
                ) + 1
              }: ${lectureToShow.lectureTitle}`}
            </h3>
          </div>
        </div>

        {/* Sidebar - Lecture ki list */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lectures</h2>
          <div className="flex-1 overflow-y-auto">
            {courseDetails.lectures.map((lecture) => (
              <Card
                key={lecture._id}
                className={`mb-3 hover:cursor-pointer transition ${
                  lecture._id === lectureToShow._id
                    ? "bg-gray-200 dark:bg-gray-800"
                    : ""
                }`}
                onClick={() => handleSelectLecture(lecture)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  {/* Lecture complete hai ya nahi uske hisaab se icon */}
                  <div className="flex items-center">
                    {isLectureCompleted(lecture._id) ? (
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                    ) : (
                      <CirclePlay size={24} className="text-gray-500 mr-2" />
                    )}
                    <CardTitle className="text-lg font-medium">
                      {lecture.lectureTitle}
                    </CardTitle>
                  </div>
                  {/* Agar lecture complete hai to badge dikhana */}
                  {isLectureCompleted(lecture._id) && (
                    <Badge
                      variant="outline"
                      className="bg-green-200 text-green-600"
                    >
                      Completed
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
