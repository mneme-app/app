"use client";

import { useModals, useAlerts } from "@/store/store";
import styles from "./InviteUser.module.css";
import { Input, UserInput } from "@client";
import { useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASEPATH ?? "";

export function InviteUser({ publicUsers, groupId }) {
    const [userId, setUserId] = useState(publicUsers[0]?.id ?? "");
    const [loading, setLoading] = useState(false);

    const removeModal = useModals((state) => state.removeModal);
    const addModal = useModals((state) => state.addModal);
    const addAlert = useAlerts((state) => state.addAlert);

    async function sendInvitation() {
        if (loading) return;
        setLoading(true);

        try {
            let url = `${basePath}/api/associates`;
            if (groupId) {
                url = `${basePath}/api/groups/${groupId}/members`;
            }

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    input: userId,
                }),
            }).then((res) => res.json());

            if (response.success) {
                setUserId("");
            } else if (response.status === 401) {
                // Not working currently, but we should use
                // a React Hook to send requests
                addModal({
                    title: "Sign back in",
                    content: <UserInput onSubmit={removeModal} />,
                });
            }

            addAlert({
                success: response.success,
                message: response.message,
            });
        } catch (error) {
            addAlert({
                success: false,
                message: "An error occurred while sending invitation.",
            });
        }

        setLoading(false);
    }

    return (
        <form className={styles.form}>
            <div>
                <Input
                    type="select"
                    label="Select from Public Users"
                    description="This is a menu of all users which have public profiles"
                    choices={publicUsers.map((x) => ({
                        key: x.id,
                        value: x.id,
                        label: x.username,
                    }))}
                    value={userId}
                    onChange={(val) => setUserId(val)}
                />

                <p>
                    If the associate you want to invite has a private profile,
                    you will need to get their user ID then enter the user ID in
                    the input below.
                </p>
            </div>

            <div>
                <Input
                    type="text"
                    label="User ID"
                    description="Enter user ID of desired user"
                    value={userId}
                    onChange={(val) => setUserId(val)}
                />
            </div>

            <button
                className="button"
                onClick={sendInvitation}
                disabled={loading || !userId}
            >
                Send Invitation
            </button>

            <p>
                A notification will be sent to them which will include your user
                ID and username.
            </p>

            <p>
                If they accept your user, you will be able to see their user
                name.
            </p>
        </form>
    );
}
