import { CourseProgress } from "../models/courseProgress.model.js";
import { Course } from "../models/course.model.js";

// ✅ Kisi user ke course progress ko laane ke liye
export const getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        // User ka progress check karo
        const courseProgress = await CourseProgress.findOne({ courseId, userId });

        // Course ki details + lectures fetch karo
        const courseDetails = await Course.findById(courseId).populate("lectures");

        // Agar course hi nahi mila
        if (!courseDetails) {
            return res.status(404).json({ message: "Course not found" });
            
        }

        // Sab kuch theek hai to course details + progress bhejo
        return res.status(200).json({
            data: {
                courseDetails,
                courseProgress: courseProgress?.lectureProgress || [],
                completed: courseProgress?.completed || false,
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Jab user koi lecture dekh leta hai to progress update karne ke liye
export const updateCourseProgress = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const userId = req.id;

        // User ke course progress ko check karo
        let courseProgress = await CourseProgress.findOne({ courseId, userId });

        // Course ki details lao lectures ke saath
        const courseDetails = await Course.findById(courseId).populate("lectures");

        // Course exist nahi karta
        if (!courseDetails) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Agar progress ka record nahi hai to naya bana lo
        if (!courseProgress) {
            courseProgress = new CourseProgress({
                courseId,
                userId,
                lectureProgress: [],
                completed: false,
            });
        }

        

        // Check karo kya yeh lecture already added hai progress me
        const lectureIndex = courseProgress.lectureProgress.findIndex(
            (lecture) => lecture.lectureId.toString() === lectureId
        );

        // Agar lecture already exist karta hai to usko viewed true kar do
        if (lectureIndex !== -1) {
            courseProgress.lectureProgress[lectureIndex].viewed = true;
        } else {
            // Nahi karta to naye lecture ko add kar do
            courseProgress.lectureProgress.push({
                lectureId,
                viewed: true,
            });
        }

        // ✅ Dekho kya saare lectures viewed ho chuke hain ya nahi
        const viewedCount = courseProgress.lectureProgress.filter(l => l.viewed).length;
        const totalLectures = courseDetails.lectures.length;

        // Agar haan, to course ko complete mark kar do
        courseProgress.completed = viewedCount === totalLectures;

        // Changes save kar do
        await courseProgress.save();

        return res.status(200).json({
            message: "Course progress updated successfully",
            data: {
                courseDetails,
                courseProgress: courseProgress.lectureProgress,
                completed: courseProgress.completed,
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Jab user manually course ko complete mark karta hai
export const markCourseAsCompleted = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        const courseProgress = await CourseProgress.findOne({ courseId, userId });

        // Agar progress ka record hi nahi hai
        if (!courseProgress) {
            return res.status(404).json({ message: "Course progress not found" });
        }

        // Sabhi lectures ko viewed true mark kar do
        courseProgress.lectureProgress.forEach((lecture) => {
            lecture.viewed = true;
        });

        // Course ko completed mark kar do
        courseProgress.completed = true;
        await courseProgress.save();

        return res.status(200).json({ message: "Course marked as completed successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Jab user course ko firse incomplete karna chahta hai
export const markCourseAsInCompleted = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        const courseProgress = await CourseProgress.findOne({ courseId, userId });

        // Agar progress nahi mila
        if (!courseProgress) {
            return res.status(404).json({ message: "Course progress not found" });
        }

        // Sabhi lectures ko viewed false mark kar do
        courseProgress.lectureProgress.forEach((lecture) => {
            lecture.viewed = false;
        });

        // Course ko not completed mark kar do
        courseProgress.completed = false;
        await courseProgress.save();

        return res.status(200).json({ message: "Course marked as incompleted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};
