import { unauthorized, server } from "@/lib/apiErrorResponses";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { useUser } from "@/lib/auth";
import { Course } from "@models";

export async function DELETE(req, { params }) {
    const { id } = params;

    try {
        const user = await useUser({ token: cookies().get("token")?.value });
        if (!user) return unauthorized;

        const course = await Course.findById(id);
        if (!course) {
            return NextResponse.json(
                {
                    message: `Course with id ${id} could not be found`,
                },
                { status: 404 },
            );
        }

        if (course.createdBy.toString() !== user.id.toString()) {
            return NextResponse.json(
                {
                    message: "You are not authorized to delete this course",
                },
                { status: 403 },
            );
        }

        const deletion = await Course.deleteOne({ id });
        if (deletion.deletedCount === 0) {
            console.error(`Unable to delete course with id ${id}`);
            return NextResponse.json(
                { message: `Unable to delete course ${id}` },
                { status: 500 },
            );
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error(`[Course] DELETE error:\n ${error}`);
        return server;
    }
}

export async function PATCH(req, { params }) {
    const { id } = params;
    const { name, description, enrollment, prerequisites, permissions } =
        await req.json();

    try {
        const user = await useUser({ token: cookies().get("token")?.value });
        if (!user) return unauthorized;

        const course = await Course.findById(id);
        if (!course) {
            return NextResponse.json(
                {
                    message: `Course with id ${id} could not be found`,
                },
                { status: 404 },
            );
        }

        if (course.createdBy.toString() !== user.id.toString()) {
            return NextResponse.json(
                {
                    message: "You are not authorized to edit this course",
                },
                { status: 403 },
            );
        }

        if (name && name <= MAX.courseName) {
            course.name = name;
        }

        if (description && description <= MAX.courseDescription) {
            course.description = description;
        }

        if (enrollment && ["open", "private", "paid"].includes(enrollment)) {
            course.enrollment = enrollment;
        }

        if (prerequisites) course.prerequisites = prerequisites;

        if (permissions) {
            course.permissions = {
                allRead: permissions.allRead ?? course.permissions.allRead,
                allWrite: permissions.allWrite ?? course.permissions.allWrite,
                usersRead:
                    permissions.usersRead || course.permissions.usersRead,
                usersWrite:
                    permissions.usersWrite || course.permissions.usersWrite,
                groupsRead:
                    permissions.groupsRead || course.permissions.groupsRead,
                groupsWrite:
                    permissions.groupsWrite || course.permissions.groupsWrite,
            };
        }

        await course.save();

        return NextResponse.json(
            {
                success: true,
                message: `Successfully updated course`,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error(`[Course] PATCH error:\n ${error}`);
        return server;
    }
}
