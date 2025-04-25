import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Loader2 } from "lucide-react";
import { Input } from "../../../components/ui/input";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Lecture from "./Lecture";

function CreateLecture() {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [lectureTitle, setLectureTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lectures, setLectures] = useState([]);
  const [lectureLoading, setLectureLoading] = useState(false);
  const [lectureError, setLectureError] = useState(false);


  const createLectureHandler = async () => {
    try {
      setIsLoading(true);
      if (!lectureTitle) {
        alert("Please enter a lecture title");
        setIsLoading(false);
        return;
      }
      const res = await axios.post(
        `http://localhost:8080/api/v1/course/${courseId}/lecture`,
        { lectureTitle },
        {
          withCredentials: true,
        }
      );
      toast.success(res.data.message);
      setLectureTitle("");
      setIsLoading(false);
      fetchLectures();
    } catch (error) {
      console.error("Error creating lecture:", error);
      setIsLoading(false);
    }
  };

  const fetchLectures = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/course/${courseId}/getLectures`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setLectures(res.data.lectures);
      }
    } catch (error) {
      console.error("Error fetching lectures:", error);
      setLectureError(true);
      setLectureLoading(false);
    }
  };

  useEffect(() => {
    setLectureLoading(true);
    fetchLectures();
    setLectureLoading(false);
  }, []);
  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Let's add lectures, add some basic details for your new lecture
        </h1>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Your Title Name"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/course/${courseId}`)}
            className="cursor-pointer"
          >
            Back to course
          </Button>
          <Button disabled={isLoading} onClick={createLectureHandler} className="cursor-pointer">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait a moment
              </>
            ) : (
              "Create lecture"
            )}
          </Button>
        </div>
        <div className="mt-10">
          {lectureLoading ? (
            <p>Loading lectures...</p>
          ) : lectureError ? (
            <p>Failed to load lectures.</p>
          ) : lectures.length === 0 ? (
            <p>No lectures availabe</p>
          ) : (
            lectures.map((lecture, index) => (
              <Lecture
                key={lecture._id}
                lecture={lecture}
                courseId={courseId}
                index={index}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateLecture;
