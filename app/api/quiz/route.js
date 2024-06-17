import { useUser, canEdit, queryReadableResources } from "@/lib/auth";
import { server, unauthorized } from "@/lib/apiErrorResponses";
import { buildPermissions } from "@/lib/permissions";
import SubmitErrors from "@/lib/SubmitErrors";
import { NextResponse } from "next/server";
import { serializeOne } from "@/lib/db";
import { cookies } from "next/headers";
import { MAX } from "@/lib/constants";
import { Types } from "mongoose";
import { Quiz } from "@models";

const allowedType = [
    "prompt-response",
    "multiple-choice",
    "unordered-list-answer",
    "ordered-list-answer",
    "fill-in-the-blank",
    "verbatim",
];

export async function GET(req) {
    try {
        const user = await useUser({ token: cookies().get("token")?.value });
        if (!user) return unauthorized;

        const content = await Quiz.find(queryReadableResources(user));
        return NextResponse.json({
            content,
        });
    } catch (error) {
        console.error(`[Quiz] GET error: ${error}`);
        return server;
    }
}

export async function POST(req) {
    try {
        const user = await useUser({ token: cookies().get("token")?.value });
        if (!user) return unauthorized;

        const {
            type,
            prompt,
            choices,
            correctResponses,
            hints,
            sources,
            notes,
            courses,
            tags,
            permissions,
        } = await req.json();

        const submitErrors = new SubmitErrors();

        if (!allowedType.includes(type)) {
            submitErrors.addError(`The following type is not valid:\n ${type}`);
        }

        if (!prompt) {
            submitErrors("Missing prompt");
        } else if (prompt.length > MAX.prompt) {
            submitErrors.addError(
                `The following prompt is longer than the maximum permitted, which is ${MAX.prompt} characters:\n ${prompt}`,
            );
        }

        if (!correctResponses?.length) {
            submitErrors("Correct responses are required");
        } else {
            correctResponses.forEach((response) => {
                if (response.length > MAX.response) {
                    if (
                        typeof response !== "string" &&
                        Array.isArray(response)
                    ) {
                        submitErrors.addError(
                            `The following correct response is not valid:\n ${response.toString()}`,
                        );
                        return;
                    }
                    if (response.length > MAX.response) {
                        submitErrors(
                            `The following correct response is longer than the maximum permitted, which is ${MAX.response} characters: \n ${response}`,
                        );
                    }
                }
            });
        }

        if (type === "multiple-choice" && !choices?.length) {
            submitErrors("Choices are required for multiple choice questions");
        } else if (choices?.length) {
            choices.forEach((choice) => {
                if (typeof choice !== "string") {
                    submitErrors.addError(
                        `The following choice is not valid:\n ${choice.toString()}`,
                    );
                    return;
                }
                if (choice.length > MAX.response) {
                    submitErrors(
                        `The following choice is longer than the maximum permitted, which is ${MAX.response} characters: \n ${choice}`,
                    );
                }
            });
        }

        if (notes?.length === 0 && sources?.length === 0) {
            submitErrors("Need at least one note or source");
        }

        tags.forEach((tag) => {
            if (typeof tag !== "string") {
                submitErrors.addError(
                    `The following tag is not valid:\n ${tag.toString()}`,
                );
                return;
            }
            if (tag.length > MAX.tag) {
                submitErrors.addError(
                    `The following tag is longer than the maximum permitted, which is ${MAX.tag} characters: \n ${tag}`,
                );
            }
        });

        if (hints)
            hints.forEach((hint) => {
                if (typeof hint !== "string") {
                    submitErrors.addError(
                        `The following tag is not valid:\n ${tag.toString()}`,
                    );
                    return;
                }
                if (hint.length > MAX.response) {
                    submitErrors.addError(
                        `The following hint is longer than the maximum permitted, which is ${MAX.response} characters: \n ${hint}`,
                    );
                }
            });

        if (submitErrors.cannotSend) {
            return NextResponse.json(
                { message: submitErrors.displayErrors() },
                { status: 400 },
            );
        }

        const quiz = new Quiz({
            type,
            prompt: prompt.trim(),
            choices,
            correctResponses,
            hints: hints ?? [],
            notes: notes ?? [],
            sources: sources ?? [],
            courses: courses ?? [],
            tags: tags ?? [],
            contributors: [user._id],
            createdBy: user._id,
        });

        quiz.permissions = buildPermissions(permissions);

        const content = await quiz.save();
        return NextResponse.json(
            {
                success: true,
                message: "Quiz created successfully",
                content,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error(`[Quiz] POST error: ${error}`);
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
            type,
            prompt,
            choices,
            correctResponses,
            hints,
            sources,
            notes,
            courses,
            tags,
            permissions,
        } = await req.json();

        const quiz = await Quiz.findById(_id);
        if (!quiz) {
            return NextResponse.json(
                {
                    message: `No quiz found with id ${_id}`,
                },
                { status: 404 },
            );
        }

        if (!canEdit(quiz, user)) {
            return NextResponse.json(
                {
                    message: `You are not permitted to edit quiz ${_id}`,
                },
                { status: 403 },
            );
        }

        if (type && !allowedType.includes(type)) {
            return NextResponse.json(
                {
                    message: "Invalid type submitted",
                },
                { status: 400 },
            );
        }

        if (type) {
            quiz.type = type;
        }
        if (prompt) {
            quiz.prompt = prompt.trim();
        }
        if (choices) {
            quiz.choices = [...choices];
        }
        if (correctResponses) {
            quiz.correctResponses = [...correctResponses];
        }
        if (hints) {
            quiz.hints = [...hints];
        }

        if (sources) {
            sources.forEach((sourceId_req, index) => {
                if (
                    !quiz.sources.find(
                        (srcId) => srcId.toString() == sourceId_req,
                    )
                ) {
                    quiz.sources.push(new Types.ObjectId(sourceId_req));
                }
            });
        }
        if (notes) {
            notes.forEach((noteId_req) => {
                if (
                    !quiz.notes.find(
                        (noteId) => noteId.toString() === noteId_req,
                    )
                ) {
                    quiz.notes.push(new Types.ObjectId(noteId_req));
                }
            });
        }

        if (courses) {
            courses.forEach((courseId_req) => {
                if (
                    !quiz.courses.find(
                        (course) => course._id.toString() === courseId_req,
                    )
                ) {
                    quiz.courses.push(new Types.ObjectId(courseId_req));
                }
            });
        }

        if (tags) {
            quiz.tags = tags;
        }

        if (permissions && quiz.createdBy.toString() === user._id.toString()) {
            quiz.permissions = serializeOne(permissions);
        }
        if (!quiz.contributors.includes(user._id)) {
            quiz.contributors.push(user._id);
        }
        quiz.updatedBy = user._id;

        const content = await quiz.save();
        return NextResponse.json({ content });
    } catch (error) {
        console.error(`[Quiz] PUT error: ${error}`);
        return server;
    }
}
