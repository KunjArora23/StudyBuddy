import React, { useEffect, useState, useContext } from "react";
import { useParams, Navigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/authContext";

function PurchaseCourseProtectedRoute({ children }) {
    const { courseId } = useParams();
    const { user, isLogin } = useContext(AuthContext);
    const [hasAccess, setHasAccess] = useState(null);

    useEffect(() => {
        const checkAccess = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8080/api/v1/course/${courseId}`,
                    { withCredentials: true }
                );

                const course = res.data.course;
                const isEnrolled = course.enrolledStudents.includes(user.id);

                setHasAccess(isEnrolled);
            } catch (error) {
                console.error("Access check failed:", error);
                setHasAccess(false);
            }
        };

        if (isLogin) {
            checkAccess();
        } else {
            setHasAccess(false);
        }
    }, [courseId, user, isLogin]);

    if (hasAccess === null) return <div>Loading...</div>;

    if (!hasAccess) return <Navigate to={`/course-detail/${courseId}`} />;

    return children;
}

export default PurchaseCourseProtectedRoute;
