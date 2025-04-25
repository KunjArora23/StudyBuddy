import React, { use, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

function CourseTab() {
  const navigate = useNavigate();
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const previewRef = useRef(null);
  const { courseId } = useParams();

  // Local state to handle course input fields
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: null,
  });

  // Handles text input changes
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  // Handles file selection for course thumbnail
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    console.log(file, "file in thumbnail change handler");  
    if (file) {
      setInput((prev) => ({ ...prev, courseThumbnail: file }));
      const previewURL = URL.createObjectURL(file);
      if (previewRef.current) {
        previewRef.current.src = previewURL;
      }
    }
  };

  // Handles category dropdown change
  const handleCategoryChange = (value) => {
    setInput((prev) => ({ ...prev, category: value }));
  };

  // Handles level dropdown change
  const handleLevelChange = (value) => {
    setInput((prev) => ({ ...prev, courseLevel: value }));
  };

  // Sends updated course data to backend
  const onSubmitHandler = async () => {
    try {
      setIsLoading(true);
  
      const formData = new FormData();
  
      // Append all form fields to formData
      formData.append("courseTitle", input.courseTitle);
      formData.append("subTitle", input.subTitle);
      formData.append("description", input.description);
      formData.append("category", input.category);
      formData.append("courseLevel", input.courseLevel);
      formData.append("coursePrice", input.coursePrice);
  
      // Only append file if user has selected a new one
      if (input.courseThumbnail instanceof File) {
        formData.append("courseThumbnail", input.courseThumbnail);
      }
  
      const response = await axios.put(
        `http://localhost:8080/api/v1/course/update/${courseId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      toast.success(response.data.message);
      setIsLoading(false);
      navigate("/admin/course");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Error updating course");
    }
  };
  

  // Deletes the course
  const deleteCourseHandler = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/v1/course/delete/${courseId}`,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      navigate("/admin/course");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // Fetches course details for editing
  const getCourseHandler = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/course/${courseId}`,
        { withCredentials: true }
      );
      const course = response.data.course;
      setInput({
        courseTitle: course.courseTitle,
        subTitle: course.subTitle,
        description: course.description,
        category: course.category,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseThumbnail: course.courseThumbnail,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Toggles course publish/unpublish status
  const publishHandler = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/v1/course/publish/${courseId}`,
        { isPublished: !isPublished },
        { withCredentials: true }
      );
      navigate("/admin/course");
      setIsPublished(res.data.course.isPublished);

      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
     
  // Checks current publish status of course
  const getCoursePublishedStatus = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/course/${courseId}`,
        { withCredentials: true }
      );
      setIsPublished(res.data.course.isPublished);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch course data and publish status when courseId changes
  useEffect(() => {
    getCourseHandler();
    getCoursePublishedStatus();
  }, [courseId]);

  return (
    <Card className="shadow-md rounded-xl border border-gray-200">
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
        <div>
          <CardTitle className="text-2xl font-semibold">
            Basic Course Information
          </CardTitle>
          <CardDescription className="text-gray-600">
            Make changes to your courses here. Click save when you're done.
          </CardDescription>
        </div>

        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={publishHandler}
            className="cursor-pointer"
          >
            {isPublished ? "Unpublished" : "Publish"}
          </Button>

          <Button
            variant="destructive"
            onClick={deleteCourseHandler}
            className="cursor-pointer"
          >
            Remove Course
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-1 block">Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeHandler}
              placeholder="Ex. Fullstack developer"
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-1 block">Subtitle</Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={changeHandler}
              placeholder="Ex. Become a Fullstack developer from zero to hero in 2 months"
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-1 block">
              Description
            </Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>

          <div className="flex flex-wrap gap-6">
            <div>
              <Label className="text-sm font-medium mb-1 block">Category</Label>
              <Select
                onValueChange={handleCategoryChange}
                value={input.category}
              >
                <SelectTrigger className="w-48 border rounded px-3 py-2 text-sm">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    {[
                      "Next JS",
                      "Data Science",
                      "Frontend Development",
                      "Fullstack Development",
                      "MERN Stack Development",
                      "Javascript",
                      "Python",
                      "Docker",
                      "MongoDB",
                      "HTML",
                    ].map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-1 block">
                Course Level
              </Label>
              <Select
                onValueChange={handleLevelChange}
                value={input.courseLevel}
              >
                <SelectTrigger className="w-48 border rounded px-3 py-2 text-sm">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advance">Advance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-1 block">
                Price in (INR)
              </Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeHandler}
                placeholder="199"
                className="w-40"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-1 block">
              Course Thumbnail
            </Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="w-fit cursor-pointer"
            />
            <img
              ref={previewRef}
              alt="Thumbnail Preview"
              className="mt-3 w-64 h-36 object-cover rounded border hidden"
              onLoad={(e) => e.currentTarget.classList.remove("hidden")}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button onClick={() => navigate("/admin/course")} variant="outline">
              Cancel
            </Button>

            <Button disabled={isLoading} onClick={onSubmitHandler}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseTab;
