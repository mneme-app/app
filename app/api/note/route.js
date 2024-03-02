import { NextResponse } from "next/server";
import { canEdit, queryReadableResources, useUser } from "@/lib/auth";
import { cookies } from "next/headers";
// import { Note } from "@mneme_app/database-models";
import { Note } from "@/app/api/models";
import { server, unauthorized } from "@/lib/apiErrorResponses";
import { Types } from "mongoose";
import { serializeOne } from "@/lib/db";
import { buildPermissions } from "@/lib/permissions";
import { MAX } from "@/lib/constants";
import SubmitErrors from "@/lib/SubmitErrors";

export async function GET(req) {
    try {
        const user = await useUser({ token: cookies().get("token")?.value });
        if (!user) {
            return unauthorized;
        }

        const content = await Note.find(queryReadableResources(user));
        return NextResponse.json(
            {
                content,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error(`[Note] GET error: ${error}`);
        return server;
    }
}

export async function POST(req) {
    try {
        const user = await useUser({ token: cookies().get("token")?.value });

        if (!user) {
            return unauthorized;
        }

        const { title, text, sources, courses, tags, permissions } =
            await req.json();

        const submitErrors = new SubmitErrors();

        if (!text) {
            submitErrors.addError("Missing text");
        } else if (text.length > MAX.noteText) {
            submitErrors.addError(
                `The following text is longer than the maximum permitted, which is ${MAX.noteText} characters:\n ${text}`,
            );
        }

        if (title && title.length > MAX.title) {
            submitErrors.addError(
                `The following title is longer than the maximum permitted, which is ${MAX.title} characters:\n ${title}`,
            );
        }

        if (sources.length < 1) {
            submitErrors.addError(
                "At least one source is required to create a note",
            );
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

        if (submitErrors.cannotSend) {
            return NextResponse.json(
                { message: submitErrors.displayErrors() },
                { status: 400 },
            );
        }

        const note = new Note({
            createdBy: user._id,
            title: title.trim(),
            text: text.trim(),
            sources: [...sources],
            courses: courses ?? [],
            tags: [...tags],
            contributors: [user._id],
        });
        note.permissions = buildPermissions(permissions);

        const content = await note.save();
        return NextResponse.json({ content }, { status: 201 });
    } catch (error) {
        console.error(`[Note] POST error: ${error}`);
        return server;
    }
}

export async function PUT(req) {
    try {
        const user = await useUser({ token: cookies().get("token")?.value });

        if (!user) {
            return unauthorized;
        }

        const { _id, title, text, sources, courses, tags, permissions } =
            await req.json();

        const note = await Note.findById(_id);
        if (!note) {
            return NextResponse.json(
                {
                    message: `No note found with id ${_id}`,
                },
                { status: 404 },
            );
        }

        if (!canEdit(note, user)) {
            return NextResponse.json(
                {
                    message: `You are not permitted to edit note ${_id}`,
                },
                { status: 403 },
            );
        }

        if (title) {
            note.title = title.trim();
        }
        if (text) {
            note.text = text.trim();
        }
        if (sources) {
            sources.forEach((sourceId_req) => {
                if (
                    !note.sources.find(
                        (srcId) => srcId.toString() == sourceId_req,
                    )
                ) {
                    note.sources.push(new Types.ObjectId(sourceId_req));
                }
            });
        }

        if (courses) {
            courses.forEach((courseId_req) => {
                if (
                    !note.courses.find(
                        (course) => course._id.toString() === courseId_req,
                    )
                ) {
                    note.courses.push(new Types.ObjectId(courseId_req));
                }
            });
        }

        if (tags) {
            note.tags = tags;
        }

        if (permissions && note.createdBy.toString() === user._id.toString()) {
            note.permissions = serializeOne(permissions);
        }

        if (!note.contributors.includes(user._id)) {
            note.contributors.push(user._id);
        }
        note.updateBy = user._id;

        const content = await note.save();
        return NextResponse.json({ content });
    } catch (error) {
        console.error(`[Note] PUT error: ${error}`);
        return server;
    }
}
