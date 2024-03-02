import { unauthorized, server } from "@/lib/apiErrorResponses";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { useUser } from "@/lib/auth";
import { Course } from "@models";
import { doesUserMeetPrerequisites } from "@/lib/permissions";

export async function POST(req, { params }) {
    const { id } = params;

    try {
        const user = await useUser({
            token: cookies().get("token")?.value,
        });
        if (!user) return unauthorized;

        const course = await Course.findById(id);
        if (!course) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No course found with that id",
                },
                { status: 404 },
            );
        }

        if (course.createdBy.toString() === user.id.toString()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You cannot enroll in a course you created",
                },
                { status: 400 },
            );
        }

        if (
            user.courses.includes(course.id) ||
            course.students.includes(user.id)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You are already enrolled in this course",
                },
                { status: 400 },
            );
        }

        if (course.enrollment !== "open") {
            return NextResponse.json(
                {
                    success: false,
                    message: "This course is not open for enrollment",
                },
                { status: 400 },
            );
        }

        if (
            course.prerequisites.length > 0 &&
            !doesUserMeetPrerequisites(user.courses, course.prerequisites)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "You do not meet the prerequisites for this course",
                },
                { status: 400 },
            );
        }

        course.students.push(user.id);
        user.courses.push({ course: course.id });

        await course.save();
        await user.save();

        return NextResponse.json(
            {
                success: true,
                message: "Successfully enrolled in course",
            },
            { status: 200 },
        );
    } catch (error) {
        console.error(`[CourseEnroll] POST error:\n ${error}`);
        return server;
    }
}
