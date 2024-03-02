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
                    message: "You cannot unenroll from a course you created",
                },
                { status: 400 },
            );
        }

        if (
            !user.courses.includes(course.id) &&
            !course.students.includes(user.id)
        ) {
            return NextResponse.json({
                success: false,
                message: "You are not enrolled in this course",
            });
        }

        const indexCourse = user.courses.findIndex(
            (x) => x.course._id.toString() === course._id.toString(),
        );
        if (indexCourse !== -1) {
            user.courses.splice(indexCourse, 1);
        }
        const indexStudent = course.students.findIndex(
            (x) => x._id.toString() === user._id.toString(),
        );
        if (indexStudent !== -1) {
            course.students.splice(indexStudent, 1);
        }

        await user.save();
        await course.save();

        return NextResponse.json(
            {
                success: true,
                message: "Successfully unenrolled from a course",
            },
            { status: 200 },
        );
    } catch (error) {
        console.error(`[CourseUnenroll] POST error:\n ${error}`);
        return server;
    }
}
