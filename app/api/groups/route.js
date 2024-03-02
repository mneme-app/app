import { NextResponse } from "next/server";
import { useUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { server, unauthorized } from "@/lib/apiErrorResponses";
// import { Group } from "@mneme_app/database-models";
// import User from "@mneme_app/database-models";
import { User, Group } from "@/app/api/models";
import SubmitErrors from "@/lib/SubmitErrors";
import { MAX } from "@/lib/constants";

export async function POST(req) {
    try {
        const user = await useUser({ token: cookies().get("token")?.value });
        if (!user) {
            return unauthorized;
        }

        const submitErrors = new SubmitErrors();

        const { name, description, icon } = await req.json();

        if (!name) {
            submitErrors.addError("Missing name");
        } else if (name?.length < 2 || name?.length > MAX.name) {
            submitErrors.addError(
                `The following group name is not 2 to ${MAX.name} characters in length:\n ${name}`,
            );
        }
        const sameName = await Group.findOne({ name });

        if (sameName) {
            submitErrors.addError(`The group name ${name} already exists`);
        }

        if (description && description.length > MAX.description) {
            submitErrors.addError(
                `The following description exceeds the maximum permitted, which is ${MAX.description}: \n ${description}`,
            );
        }

        if (submitErrors.cannotSend) {
            return NextResponse.json(
                {
                    message: submitErrors.displayErrors(),
                    nameTaken: sameName != null,
                },
                { status: 400 },
            );
        }

        const group = new Group({
            name: name.trim(),
            description: description.length > 0 ? description : null,
            icon: icon,
            owner: user.id,
            users: [user.id],
            admins: [user.id],
        });

        const content = await group.save();

        await User.updateOne(
            { _id: user.id },
            {
                $push: {
                    groups: content.id,
                },
            },
        );

        return NextResponse.json(
            {
                message: "Group created successfully",
                content: content,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error(`[Group] POST error: ${error}`);
        return server;
    }
}
