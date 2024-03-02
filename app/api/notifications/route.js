import { server, unauthorized } from "@/lib/apiErrorResponses";
import { User, Group, Notification } from "@/app/api/models";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { useUser } from "@/lib/auth";

export async function POST(req) {
    try {
        const user = await useUser({ token: cookies().get("token")?.value });
        if (!user) return unauthorized;

        const { action, recipientId, groupId } = await req.json();
        let recipient = await User.findById(recipientId);

        if (!recipient) {
            console.error(
                `${user.username} sent a message to user id ${recipientId}, which does not exist`,
            );

            recipient = await User.find({ username: "crash test dummy" });
        }

        const notifPayload = {
            recipient: recipient._id,
            senderUser: user._id,
            responseActions: [],
        };

        if (action === "request association") {
            notifPayload.subject = "A user wants to be your associate";
            notifPayload.message = `A user ${
                user.username === user.displayName
                    ? user.username
                    : `${user.displayName} (${user.username})`
            } is asking to be your associate. This will allow you two to share resources, either to read or to edit. If you accept, they will see your username and display name.`;
            notifPayload.responseActions.push(
                "accept association",
                "delete notification",
                "ignore",
            );
        }

        if (action === "invite to group") {
            const group = await Group.findById(groupId);
            if (!group) {
                return new NextResponse(
                    { message: `Unable to find group with ID ${groupId}` },
                    { status: 404 },
                );
            }

            if (
                group.owner.toString() !== user._id.toString() ||
                !group.admins.includes(user._id)
            ) {
                return new NextResponse(
                    {
                        message: `I'm sorry, but you are not authorized to invite users to group ${group.name}`,
                    },
                    { status: 401 },
                );
            }

            notifPayload.senderGroup = groupId;

            notifPayload.subject = "A group is inviting you to join them!";
            notifPayload.message = `${user.username} is inviting you to join the group ${group.name}. Here's is what the group says about themselves:\n  ${group.description}`;

            notifPayload.responseActions.push(
                "join group",
                "delete notification",
                "ignore",
            );
        }

        if (action === "send message") {
        }

        const notification = new Notification(notifPayload);
        const update = await notification.save();

        return new NextResponse(
            {
                message: "Success!",
                update,
            },
            {
                status: 200,
            },
        );
    } catch (error) {
        console.error(`POST error for notifications`, error);
        return server;
    }
}

export async function PATCH(req) {
    try {
        const user = await useUser({ token: cookies().get("token")?.value });
        if (!user) return unauthorized;

        // Read all notifications

        const res = await Notification.updateMany(
            { recipient: user._id },
            { $set: { read: true } },
        );

        return new NextResponse(
            {
                success: res.nModified > 0,
                message: `Read ${res.nModified ?? "no"} notifications`,
            },
            {
                status: 200,
            },
        );
    } catch (error) {
        console.error(`PATCH error for notifications`, error);
        return server;
    }
}
