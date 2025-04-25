import { Course } from "../models/course.model.js";
import { User } from "../models/user.models.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import { deleteLectureById } from "../utils/deleteLectureById.js";

// ============================
// Create Course Controller
// ============================
export const createCourse = async (req, res) => {
    try {
        const { courseTitle, category } = req.body;
        const id = req.id; // Creator's user ID from authentication middleware

        // Basic validation
        if (!courseTitle || !category) {
            return res.status(400).json({
                message: "Course title and category are required",
                success: false
            });
        }

        // Create course in the database
        const course = await Course.create({
            courseTitle,
            category,
            creator: id
        });

        return res.status(200).json({
            message: "Course created successfully",
            success: true,
            course
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error while creating the course",
            success: false
        });
    }
};

// ============================
// Get All Courses by Logged-in Creator
// ============================
export const getAllCourses = async (req, res) => {
    try {
        const userId = req.id; // User ID from authentication middleware

        // Find all courses created by this user
        const courses = await Course.find({ creator: userId });

        if (!courses) {
            return res.status(404).json({
                courses: [],
                message: "No Course Found"
            });
        }

        return res.status(200).json({
            courses
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error while fetching the courses",
            success: false
        });
    }
};

// ============================
// Update Course by ID
// ============================
export const updateCourse = async (req, res) => {
    try {
        // Destructure updated fields from request body
        const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body;
        const thumbnail = req.file;
        const courseId = req.params.courseId;



        // Validation check
        if (!courseTitle || !subTitle || !description || !category || !courseLevel || !coursePrice) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        // Find the course to be updated
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found",
                success: false
            });
        }

        let courseThumbnail = "";

        // If thumbnail is being updated
        if (thumbnail) {
            // Delete previous thumbnail from Cloudinary if it exists
            if (course.thumbnail) {
                const publicId = course.thumbnail.split('/').pop().split('.')[0];
                console.log(publicId);

                await deleteMediaFromCloudinary(publicId);
            }

            // Upload new thumbnail
            const response = await uploadMedia(thumbnail.path);


            courseThumbnail = response.secure_url;
            console.log("courseThumbnail");

        }


        // Prepare updated data object
        const updatedData = {
            courseTitle,
            category,
            subTitle,
            description,
            courseLevel,
            coursePrice,
            thumbnail: courseThumbnail
        };

        // Update course in DB
        const updatedCourse = await Course.findByIdAndUpdate(courseId, updatedData, { new: true });

        return res.status(200).json({
            message: "Course updated successfully",
            success: true,
            updatedCourse
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error while updating the course",
            success: false
        });
    }
};

// ============================
// Get Course by ID
// ============================
export const getCourseById = async (req, res) => {
    try {
        const id = req.params.courseId; // Get course ID from request parameters

        const course = await Course.findById(id).populate("lectures creator"); // Find course by ID   
        if (!course) {
            return res.status(404).json({
                message: "Course not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Course fetched successfully",
            success: true,
            course
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error while fetching the course",
            success: false
        });

    }
}


// ============================
// Delete Course by ID
// ============================
export const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found",
                success: false
            })
        }

        if (course.thumbnail) {
            // Delete thumbnail from Cloudinary if it exists
            await deleteMediaFromCloudinary(course.thumbnail.split('/').pop().split('.')[0]);
        }

        const lectures = course.lectures

        if (lectures.length > 0) {
            // Delete all lectures associated with the course
            for (let i = 0; i < lectures.length; i++) {
                const lectureId = lectures[i];
                console.log(lectureId.toString());


                await deleteLectureById(courseId, lectureId);

            }

        }
        // Delete course from DB
        const deleted = await Course.findByIdAndDelete(courseId);

        if (!deleted) {
            return res.status(404).json({
                message: "Course not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Course deleted successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error while deleting the course",
            success: false
        });
    }
};


// ============================
// Publish/UnPublish Course 
// ============================

export const togglePublishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { isPublished } = req.body;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found",
                success: false
            });
        }
        if (course.lectures.length == 0) {
            return res.status(404).json({
                message: "Course has no lectures",
                success: false
            });
        }

        course.isPublished = isPublished; // Update the isPublished field
        await course.save(); // Save the updated course
        return res.status(200).json({
            message: `Course ${isPublished ? "published" : "unpublished"} successfully`,
            success: true,
            course
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error while publishing the course",
            success: false
        });
    }
}


export const getAllPublishedCourses = async (_, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).populate("creator", "name photoUrl"); // Populate creator field with name and email


        if (courses.length === 0) {
            return res.status(404).json({
                courses: [],
                message: "No Course Found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Courses fetched successfully",
            success: true,
            courses
        })
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            message: "Error while fetching the courses",
            success: false
        })
    }
}



export const searchCourse = async (req, res) => {
    try {
        const { query = "", categories = [], sortByPrice } = req.body;
        console.log("reqbody", req.body);

        // Query match conditions
        const queryConditions = [
            { courseTitle: { $regex: query, $options: "i" } },
            { subTitle: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } },
        ];

        // Category filter condition if categories provided
        const categoryCondition = categories.length > 0
            ? [{ category: { $in: categories } }]
            : [];

        // Combine query + category filters with OR
        const searchConditions = [
            {
                $or: [...queryConditions, ...categoryCondition]
            },
            { isPublished: true }
        ];

        const searchCriteria = { $and: searchConditions };
        console.log("searchCriteria", searchCriteria);

        const sortOrder = sortByPrice === "lowToHigh" ? 1 : -1;

        const courses = await Course.find(searchCriteria)
            .populate("creator", "name photoUrl")
            .sort({ coursePrice: sortOrder });

        return res.status(200).json({
            message: "Courses fetched successfully",
            success: true,
            courses: courses || []
        });

    } catch (error) {
        console.log("Error while searching course", error);
        return res.status(500).json({
            message: "Something went wrong while fetching courses.",
            success: false,
        });
    }
};
