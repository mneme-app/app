import { NextResponse } from "next/server";
import { canEdit, queryReadableResources, useUser } from "@/lib/auth";
import { cookies } from "next/headers";
// import { Source } from "@mneme_app/database-models";
import { Source } from "@/app/api/models";
import { unauthorized, server } from "@/lib/apiErrorResponses";
import { Types } from "mongoose";
import { buildPermissions } from "@/lib/permissions";
import { serializeOne } from "@/lib/db";
import SubmitErrors from "@/lib/SubmitErrors";
import { MAX } from "@/lib/constants";

export async function GET(req) {
    try {
        const user = await useUser({ token: cookies().get("token")?.value });
        if (!user) {
            return unauthorized;
        }

        const content = await Source.find(queryReadableResources(user));
        return NextResponse.json({ content }, { status: 200 });
    } catch (error) {
        console.error(`[Source] GET error: ${error}`);
        return server;
    }
}

export async function POST(req) {
    try {
        const user = await useUser({ token: cookies().get("token")?.value });
        if (!user) return unauthorized;

        const {
            title,
            medium,
            url,
            publishDate,
            lastAccessed,
            authors,
            courses,
            tags,
            locationTypeDefault,
            permissions,
        } = await req.json();

        const submitErrors = new SubmitErrors();

        if (!title) {
            submitErrors.addError("Missing title");
        } else if (title.length > MAX.title) {
            submitErrors.addError(
                `The following title is longer than the maximum permitted, which is ${MAX.title} characters:\n ${title}`,
            );
        }

        if (!medium) {
            submitErrors.addError("Missing medium");
        } else if (medium === "website" && !url) {
            submitErrors.addError("A website requires a URL");
        }

        authors.forEach((author) => {
            if (typeof author !== "string") {
                submitErrors.addError(
                    `The following author is not valid:\n  ${author.toString()}`,
                );
                return;
            }
            if (author.length > MAX.name) {
                submitErrors.addError(
                    `The following author name is longer than the maximum permitted, which is ${MAX.name} characters: \n ${author}`,
                );
            }
        });

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

        const source = new Source({
            title: title.trim(),
            medium: medium,
            url: url,
            publishedAt: publishDate,
            lastAccessed: lastAccessed,
            authors: authors,
            courses: courses ?? [],
            tags,
            locationTypeDefault,
            createdBy: user._id,
            contributors: [user._id],
        });

        source.permissions = buildPermissions(permissions);

        const content = await source.save();

        return NextResponse.json(
            {
                message: "Source created successfully",
                content,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error(`[Source] POST error: ${error}`);
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
            title,
            medium,
            url,
            publishDate,
            lastAccessed,
            authors,
            courses,
            tags,
            locationTypeDefault,
            permissions,
        } = await req.json();

        const source = await Source.findById(_id);
        if (!source) {
            return NextResponse.json(
                {
                    message: `No source found with id ${_id}`,
                },
                { status: 404 },
            );
        }

        if (!canEdit(source, user)) {
            return NextResponse.json(
                {
                    message: `You are not permitted to edit source ${_id}`,
                },
                { status: 403 },
            );
        }

        if (title) {
            source.title = title.trim();
        }
        if (medium) {
            source.medium = medium;
        }
        if (url) {
            source.url = url;
        }
        if (publishDate) {
            source.publishDate = publishDate;
        }
        if (lastAccessed) {
            source.lastAccessed = lastAccessed;
        }
        if (authors) {
            source.authors = [...authors];
        }
        if (courses) {
            courses.forEach((courseId_req) => {
                if (
                    !source.courses.find(
                        (course) => course._id.toString() === courseId_req,
                    )
                ) {
                    source.courses.push(new Types.ObjectId(courseId_req));
                }
            });
        }
        if (tags) {
            source.tags = [...tags];
        }
        if (locationTypeDefault) {
            source.locationTypeDefault = locationTypeDefault;
        }
        if (
            permissions &&
            source.createdBy.toString() === user._id.toString()
        ) {
            source.permissions = serializeOne(permissions);
        }
        source.updateBy = user._id;

        const content = await source.save();
        return NextResponse.json({ content });
    } catch (error) {
        console.error(`[Source] PUT error: ${error}`);
        return server;
    }
}
