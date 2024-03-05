import { canEdit, queryReadableResources, useUser } from "@/lib/auth";
import { server, unauthorized } from "@/lib/apiErrorResponses";
import { buildPermissions } from "@/lib/permissions";
import SubmitErrors from "@/lib/SubmitErrors";
import { NextResponse } from "next/server";
import { MIN, MAX } from "@/lib/constants";
import { Note } from "@/app/api/models";
import { serializeOne } from "@/lib/db";
import { cookies } from "next/headers";
import { Types } from "mongoose";

export async function GET(req) {
    try {
        const user = await useUser({ token: cookies().get("token")?.value });
        if (!user) return unauthorized;

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
        if (!user) return unauthorized;

        const { title, text, sources, courses, tags, permissions } =
            await req.json();

        const submitErrors = new SubmitErrors();

        if (text.length < MIN.noteText || text.length > MAX.noteText) {
            submitErrors.addError(
                `Text must be between ${MIN.noteText} and ${MAX.noteText} characters long`,
            );
        }

        if (title.length < MIN.title || title.length > MAX.title) {
            submitErrors.addError(
                `Title must be between ${MIN.title} and ${MAX.title} characters long`,
            );
        }

        if (sources.length === 0) {
            submitErrors.addError(
                "At least one source is required to create a note",
            );
        }

        tags.forEach((tag) => {
            if (typeof tag !== "string") {
                return submitErrors.addError(
                    `"${typeof tag}" is not a valid tag type. Tags must be strings.`,
                );
            }

            if (tag.length < MIN.tag || tag.length > MAX.tag) {
                submitErrors.addError(
                    `Tags must be between ${MIN.tag} and ${MAX.tag} characters long`,
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
        if (!user) return unauthorized;

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
