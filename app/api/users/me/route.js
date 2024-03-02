import { unauthorized } from "@/lib/apiErrorResponses";
import { removeImageFromCDN } from "@/lib/cdn";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { useUser } from "@/lib/auth";
import { User } from "@models";
import bcrypt from "bcrypt";

const cdn = "https://ucarecdn.com/";

export async function PATCH(req) {
    const {
        password,
        username,
        newPassword,
        displayName,
        description,
        avatar,
        email,
    } = await req.json();

    try {
        const user = await useUser({ token: cookies().get("token")?.value });
        if (!user) return unauthorized;

        if (newPassword && password) {
            if (newPassword === password) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "New password cannot be the same as the old password",
                    },
                    { status: 400 },
                );
            }

            const passwordsMatch = await bcrypt.compare(
                password,
                user.passwordHash,
            );

            if (!passwordsMatch) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Incorrect password",
                    },
                    { status: 401 },
                );
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await User.findByIdAndUpdate(user.id, {
                passwordHash: hashedPassword,
            });

            return NextResponse.json(
                {
                    success: true,
                    message: "Successfully updated user.",
                },
                { status: 200 },
            );
        } else if (username && password) {
            if (user.username === username) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "New username cannot be the same as the old username",
                    },
                    { status: 400 },
                );
            }

            if (await User.exists({ username })) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "This username is already taken",
                    },
                    { status: 409 },
                );
            }

            const passwordsMatch = await bcrypt.compare(
                password,
                user.passwordHash,
            );

            if (!passwordsMatch) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Incorrect password",
                    },
                    { status: 401 },
                );
            }

            await User.findByIdAndUpdate(user.id, {
                username,
            });
        } else {
            if ((avatar || avatar === "") && user.avatar) {
                // Remove old avatar
                await removeImageFromCDN(user.avatar);
            }

            if (email) {
                if (user.email === email) {
                    return NextResponse.json(
                        {
                            success: false,
                            message:
                                "New email cannot be the same as the old email",
                        },
                        { status: 400 },
                    );
                }

                if (await User.exists({ email })) {
                    return NextResponse.json(
                        {
                            success: false,
                            message: "User with that email already exists",
                        },
                        { status: 409 },
                    );
                }
            }

            await User.findByIdAndUpdate(user.id, {
                displayName: displayName || user.displayName,
                description: description || user.description,
                avatar: avatar || (avatar === "" ? null : user.avatar),
                email: email || user.email,
            });
        }

        return NextResponse.json(
            {
                success: true,
                message: "Successfully updated user.",
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("[ERROR] /api/users/me:PATCH ", error);

        if (avatar) {
            // Remove new avatar
            await removeImageFromCDN(avatar);
        }

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong.",
            },
            { status: 500 },
        );
    }
}
