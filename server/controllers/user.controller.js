import { User } from "../models/user.models.js";
import bcrypt from 'bcrypt'
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";


export const register = async (req, res) => {
    try {

        const { name, email, password } = req.body;


        // checking if anything is missing or not
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }
        // hashing the password for security
        const hashedPassword = await bcrypt.hash(password, 10);

        const registeredUser = await User.create({
            name,
            email,
            password: hashedPassword
        })

        return res.status(201).json({
            success: true,
            message: "User Registerd succesfully",
            registeredUser
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Error occured while registering the user"
        })
    }

}

export const login = async (req, res) => {


    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            })
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password)

        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            })
        }

        generateToken(res, user, `Welcome back ${user.name}`)



    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Error occured while logging the user"
        })
    }
}


export const getUserProfile = async (req, res) => {
    try {
        const userId = req.id;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false
            })
        }

        return res.status(201).json({
            message: "User details feteched successfully",
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to load user"
        })
    }

}

export const logout = async (req, res) => {

    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "strict"
        })

        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to load user"
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const avatar = req.file;
        const { name } = req.body;
        const userId = req.id;



        const user = await User.findById(userId)


        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false
            })
        }

        if (user.photoUrl) {
            // here fetching the public id of file uploaded on cloudinary to delete that particular file from cloudinary

            // format of cloudinary url first it will break all into array by splitting it with / and then user123 is thepublic id so user123.jpg  will be the last element of the array  so we pop it and we again split by . then user123 will be the first element of the array 
            // https://res.cloudinary.com/demo/image/upload/v1671234567/profile_pics/user123.jpg

            const publicId = user.photoUrl.split('/').pop().split('.')[0];
            await deleteMediaFromCloudinary(publicId)
        }
        let updatedUser = {};
        if (avatar) {
            const cloudinaryResponse = await uploadMedia(avatar.path);
            const photoUrl = cloudinaryResponse.secure_url
            updatedUser = await User.findByIdAndUpdate(userId, { name, photoUrl }, { new: true }).select('-password')
        } else {
            updatedUser = await User.findByIdAndUpdate(userId, { name }, { new: true }).select('-password')
        }





        return res.status(200).json({
            message: "User updated succesfully",
            updatedUser,
            success: true
        })



    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Failed to update the profile",
            success: false
        })

    }




}


export const enrollCourseAfterPayment = async (req, res) => {
    const { paymentId } = req.body;

    const payment = await CoursePurchase.findOne({ paymentId });
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    const { courseId, userId, amount, orderId } = payment;

    // Add course to user's enrolled list
    await User.findByIdAndUpdate(userId, {
        $addToSet: { enrolledCourses: courseId },
    });

    // Add user to course's enrolled students list (teacher)
    await Course.findByIdAndUpdate(courseId, {
        $addToSet: { enrolledStudents: userId },
    });

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    res.status(200).json({
        userName: user.name,
        courseName: course.courseTitle,
        courseId,
        amount: amount / 100,
        orderId,
    });
};




export const instructorDashboardStats = async (req, res) => {
    try {
        const instructorId = req.id; // Auth middleware se mil raha h

        // Get all courses created by instructor
        const instructorCourses = await Course.find({ creator: instructorId });

        const courseIds = instructorCourses.map(course => course._id);

        // Get all purchases of these courses
        const purchasedCourses = await CoursePurchase.find({
            courseId: { $in: courseIds },
            status: "completed"
        }).populate("courseId", "courseTitle coursePrice")
            .populate("userId", "name email");

        // Total revenue
        const totalRevenue = purchasedCourses.reduce((acc, item) => acc + (item.amount || 0), 0);

        // Prepare response data
        const courseStats = purchasedCourses.reduce((acc, purchase) => {
            const courseTitle = purchase.courseId.courseTitle;

            if (!acc[courseTitle]) {
                acc[courseTitle] = {
                    title: courseTitle,
                    price: purchase.courseId.coursePrice,
                    sold: 1
                };
            } else {
                acc[courseTitle].sold += 1;
            }

            return acc;
        }, {});

        return res.status(200).json({
            success: true,
            totalRevenue,
            totalSales: purchasedCourses.length,
            courseDetails: Object.values(courseStats),
            purchasedCourses // Optional: detailed list including user info
        });
    } catch (error) {
        console.log("Dashboard stats error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard stats"
        });
    }
};
