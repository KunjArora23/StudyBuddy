// Importing UI components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";

// Importing libraries
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const LectureTab = () => {
  // State variables
  const [lectureTitle, setLectureTitle] = useState(""); // Stores lecture title
  const [uploadVideInfo, setUploadVideoInfo] = useState(null); // Stores selected video file
  const [isPreviewFree, setIsPreviewFree] = useState(false); // Is the lecture free preview
  const [removeLoading, setRemoveLoading] = useState(false); // Loading state for delete button
  const [updateLoading, setUpdateLoading] = useState(false); // Loading state for update button
  const [uploadProgress, setUploadProgress] = useState(0); // Tracks upload progress in %

  // Extracting courseId and lectureId from URL params
  const { courseId, lectureId } = useParams();

  // Navigation hook
  const navigate = useNavigate();

  // --------------------- DELETE LECTURE ---------------------
  const deleteLectureHandler = async () => {
    try {
      setRemoveLoading(true); // Show loader on delete button

      const res = await axios.delete(
        `http://localhost:8080/api/v1/course/${courseId}/lecture/delete/${lectureId}`,
        { withCredentials: true }
      );

      setRemoveLoading(false);
      toast.success(res.data.message); // Show success toast  
      navigate(`/admin/course/${courseId}/lecture`); // Redirect after delete
    } catch (error) {
      setRemoveLoading(false);
      console.log("Error occurred while deleting the lecture", error);
    }
  };

  // --------------------- UPDATE LECTURE ---------------------
  const updateHandler = async () => {
    try {
      setUpdateLoading(true);
      setUploadProgress(0); // Reset progress bar

      const formData = new FormData();
      formData.append("video", uploadVideInfo); // Append video file
      formData.append("lectureTitle", lectureTitle); // Append lecture title
      formData.append("isPreviewFree", isPreviewFree); // Append preview status

      const res = await axios.put(
        `http://localhost:8080/api/v1/course/${courseId}/lecture/update/${lectureId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
          // Track upload progress
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent); // Update progress bar
          },
        }
      );

      toast.success(res.data.message); // Show success toast
      setUpdateLoading(false);
      setUploadProgress(0); // Reset progress after complete
      navigate(`/admin/course/${courseId}/lecture`); // Redirect after update 
    } catch (error) {
      setUpdateLoading(false);
      setUploadProgress(0); // Reset progress on error
      toast.error(error.response.data.message); // Show error toast
    }
  };

  return (
    <Card>
      {/* ----------- Header with title and delete button ----------- */}
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Make changes and click save when done.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            disbaled={removeLoading} // Typo here: should be "disabled"
            variant="destructive"
            onClick={deleteLectureHandler}
            className="cursor-pointer"
          >
            {removeLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Remove Lecture"
            )}
          </Button>
        </div>
      </CardHeader>

      {/* ----------- Lecture Editing Form ----------- */}
      <CardContent>
        {/* Lecture title input */}
        <div>
          <Label>Title</Label>
          <Input
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            type="text"
            placeholder="Ex. Introduction to Javascript"
          />
        </div>

        {/* File upload input */}
        <div className="my-5">
          <Label>
            Video <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            accept="video/*"
            placeholder="Ex. Introduction to Javascript"
            onChange={(e) => {
              setUploadVideoInfo(e.target.files[0]);
            }}
            className="w-fit"
          />
        </div>

        {/* Free preview toggle */}
        <div className="flex items-center space-x-2 my-5">
          <Switch
            checked={isPreviewFree}
            onCheckedChange={setIsPreviewFree}
            id="airplane-mode"
          />
          <Label htmlFor="airplane-mode">Is this video FREE</Label>
        </div>

        {/* Upload progress bar */}
        {uploadProgress > 0 && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}

        {/* Submit/update button */}
        <div className="mt-4">
          <Button
            disabled={updateLoading}
            className="cursor-pointer"
            onClick={updateHandler}
          >
            {updateLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Update Lecture"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
