


import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Course } from "./Course";
import { AuthContext } from "@/contexts/authContext";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Profile = () => {
  const {
    user,
    updateProfileHandler,
    updateUserIsLoading,
    getProfileHandler,
  } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [loading, setIsLoading] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [courses, setCourses] = useState([]);

  // Load profile
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      await getProfileHandler();
      setIsLoading(false);
    };

    fetchProfile();
  }, []);

  // Load enrolled course details after user is fetched
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.enrolledCourses?.length) return;

      const courseDetails = await Promise.all(
        user.enrolledCourses.map(async (id) => {
          try {
            const res = await axios.get(`http://localhost:8080/api/v1/course/${id}`, {
              withCredentials: true,
            });
            return res.data.course;
          } catch (error) {
            console.error(`Failed to load course ${id}`, error);
            return null;
          }
        })
      );

      setCourses(courseDetails.filter(Boolean));
    };

    if (user) {
      fetchCourses();
    }
  }, [user]);

  const handleFileChange = (e) => {
    const avatar = e.target.files?.[0];
    if (avatar) {
      setProfilePhoto(avatar);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-lg font-bold">Loading Profile...</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 my-10">
      <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
            <AvatarImage
              src={user?.photoUrl || "https://github.com/shadcn.png"}
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        <div>
          <div className="mb-2">
            <h1 className="font-semibold">
              Name:
              <span className="ml-2 font-normal">{user?.name}</span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold">
              Email:
              <span className="ml-2 font-normal">{user?.email}</span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold">
              Role:
              <span className="ml-2 font-normal">{user?.role?.toUpperCase()}</span>
            </h1>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-2">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Profile Photo</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    className="col-span-3"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  disabled={updateUserIsLoading}
                  onClick={(e) => updateProfileHandler(e, name, profilePhoto)}
                >
                  {updateUserIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-medium text-lg mb-4">Courses you're enrolled in</h2>
        {courses.length === 0 ? (
          <p>You haven't enrolled in any courses yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {courses.map((course) => (
              <Course course={course} key={course._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { Profile };
