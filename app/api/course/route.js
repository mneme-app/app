import { NextResponse } from "next/server";
import { canEdit, canRead, queryReadableResources, useUser } from "@/lib/auth";
import { cookies } from "next/headers";
import Course from "../models/Course"; // Don't forget to add this to index.js
import { unauthorized, server } from "@/lib/apiErrorResponses";
import { buildPermissions } from "@/lib/permissions";
import { Types } from "mongoose";
import { serializeOne } from "@/lib/db";
import { MAX } from "@/lib/constants";
import SubmitErrors from "@/lib/SubmitErrors";
import { Source, Note, Quiz } from "../models";

export async function GET(req) {
    try {
        const user = await useUser({ token: cookies().get("token")?.value });
        if (!user) return unauthorized;

        const content = await Course.find(queryReadableResources(user));
        return NextResponse.json({
            content,
        });
    } catch (error) {
        console.error(`[Course] GET error: ${error}`);
        return server;
    }
}

export async function POST(req) {
    try {
        const user = await useUser({ token: cookies().get("token")?.value });
        if (!user) {
            return unauthorized;
        }

        const submitErrors = new SubmitErrors();

        const {
            name,
            description,
            parentCourses,
            prerequisites,
            sources,
            notes,
            quizzes,
            addAllFromSources,
            addAllFromNotes,
            permissions,
        } = await req.json();

        const localSources = sources ? [...sources] : [];
        const localNotes = notes ? [...notes] : [];
        const localQuizzes = quizzes ? [...quizzes] : [];
        const promises = [];

        if (!name) {
            submitErrors.addError("Missing name");
        } else if (name.length > MAX.name) {
            submitErrors.addError(
                `The following name is longer than the maximum permitted, which is ${MAX.name} characters:\n ${name}`,
            );
        }

        if (!description) {
            submitErrors.addError("Missing description");
        } else if (description.length > MAX.description) {
            submitErrors.addError(
                `The following description is longer than the maximum permitted, which is ${MAX.description} characters:\n ${description}`,
            );
        }

        if (submitErrors.cannotSend) {
            return NextResponse.json(
                {
                    message: submitErrors.displayErrors(),
                },
                { status: 400 },
            );
        }

        const course = new Course({
            name: name.trim(),
            description,
            parentCourses,
            prerequisites,
            createdBy: user._id,
            contributors: [user._id],
        });

        course.permissions = buildPermissions(permissions);

        const content = await course.save();

        const id = content._id.toString();

        async function addCourseToResource({
            resourceId,
            type,
            courseId,
            user,
        }) {
            function getResource() {
                if (type === "source") return Source.findById(resourceId);
                if (type === "note") return Note.findById(resourceId);
                if (type === "quiz") return Quiz.findById(resourceId);
            }

            const resource = await getResource();
            if (!canRead(resource, user)) {
                return;
            }

            if (
                resource.courses.find((x) => x.toString() == courseId) ==
                undefined
            ) {
                resource.courses.push(new Types.ObjectId(courseId));
                await resource.save();
            }

            if (type === "source" && addAllFromSources) {
                const quizzesFromSource = await Quiz.find({
                    sources: new Types.ObjectId(resourceId),
                });
                localQuizzes.push(
                    ...quizzesFromSource.map((x) => x._id.toString()),
                );
            }

            if (type !== "quiz" && addAllFromNotes) {
                const notesFromSource = await Note.find({
                    sources: new Types.ObjectId(resourceId),
                });
                localNotes.push(
                    ...notesFromSource.map((x) => x._id.toString()),
                );
            }
        }

        localSources.forEach((src) => {
            promises.push(
                addCourseToResource({
                    resourceId: src,
                    type: "source",
                    user,
                    courseId: id,
                }),
            );
        });

        await Promise.all(promises);
        localNotes.forEach((n) => {
            promises.push(
                addCourseToResource({
                    resourceId: n,
                    type: "note",
                    courseId: id,
                    user,
                }),
            );
        });

        await Promise.all(promises);
        localQuizzes.forEach((q) => {
            addCourseToResource({
                resourceId: q,
                type: "quiz",
                courseId: id,
                user,
            });
        });

        return NextResponse.json(
            {
                message: "Course created successfully",
                content,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error(`[Course] POST error: ${error}`);
        return server;
    }
}

export async function PUT(req) {
    try {
        const user = await useUser({ token: cookies().get("token")?.value });

        if (!user) {
            return unauthorized;
        }

        const {
            _id,
            name,
            description,
            parentCourses,
            prerequisites,
            sources,
            notes,
            quizzes,
            addAllFromSources,
            addAllFromNotes,
            permissions,
        } = await req.json();

        const course = await Course.findById(_id);
        if (!course) {
            return NextResponse.json(
                {
                    message: `No course found with id ${_id}`,
                },
                { status: 404 },
            );
        }

        if (!canEdit(course, user)) {
            return NextResponse.json(
                {
                    message: `You are not permitted to edit course ${_id}`,
                },
                { status: 403 },
            );
        }

        const localSources = sources ? [...sources] : [];
        const localNotes = notes ? [...notes] : [];
        const localQuizzes = quizzes ? [...quizzes] : [];
        const promises = [];

        if (name) {
            course.name = name.trim();
        }
        if (description) {
            course.description = description;
        }
        if (parentCourses) {
            parentCourses.forEach((catId_req) => {
                if (
                    !course.parentCourses.find(
                        (catId) => catId.toString() == catId_req,
                    )
                ) {
                    course.parentCourses.push(new Types.ObjectId(catId_req));
                }
            });
        }
        if (prerequisites) {
            prerequisites.forEach((catId_req) => {
                if (
                    !course.prerequisites.find(
                        (catId) => catId.toString() == catId_req,
                    )
                ) {
                    course.prerequisites.push(new Types.ObjectId(catId_req));
                }
            });
        }

        if (
            permissions &&
            course.createdBy.toString() === user._id.toString()
        ) {
            course.permissions = serializeOne(permissions);
        }
        course.updatedBy = user._id;

        const content = await course.save();

        const id = content._id.toString();

        async function addCourseToResource({
            resourceId,
            type,
            courseId,
            user,
        }) {
            function getResource() {
                if (type === "source") return Source.findById(resourceId);
                if (type === "note") return Note.findById(resourceId);
                if (type === "quiz") return Quiz.findById(resourceId);
            }

            const resource = await getResource();
            if (!canRead(resource, user)) {
                return;
            }

            if (
                resource.courses.find((x) => x.toString() == courseId) ==
                undefined
            ) {
                resource.courses.push(new Types.ObjectId(courseId));
                await resource.save();
            }

            if (type === "source" && addAllFromSources) {
                const quizzesFromSource = await Quiz.find({
                    sources: new Types.ObjectId(resourceId),
                });
                localQuizzes.push(
                    ...quizzesFromSource.map((x) => x._id.toString()),
                );
            }

            if (type !== "quiz" && addAllFromNotes) {
                const notesFromSource = await Note.find({
                    sources: new Types.ObjectId(resourceId),
                });
                localNotes.push(
                    ...notesFromSource.map((x) => x._id.toString()),
                );
            }
        }

        localSources.forEach((src) => {
            promises.push(
                addCourseToResource({
                    resourceId: src,
                    type: "source",
                    user,
                    courseId: id,
                }),
            );
        });

        await Promise.all(promises);
        localNotes.forEach((n) => {
            promises.push(
                addCourseToResource({
                    resourceId: n,
                    type: "note",
                    courseId: id,
                    user,
                }),
            );
        });

        await Promise.all(promises);
        localQuizzes.forEach((q) => {
            addCourseToResource({
                resourceId: q,
                type: "quiz",
                courseId: id,
                user,
            });
        });

        return NextResponse.json({ content });
    } catch (error) {
        console.error(`[Course] PUT error: ${error}`);
        return server;
    }
}
