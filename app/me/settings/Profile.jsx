"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { uploadFile } from "@uploadcare/upload-client";
import { useAlerts, useModals } from "@/store/store";
import { Input } from "@/app/components/client";
import { removeImageFromCDN } from "@/lib/cdn";
import styles from "./Settings.module.css";
import filetypeinfo from "magic-bytes.js";
import Image from "next/image";

const allowedFileTypes = [
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/apng",
    "image/webp",
];

const cdn = process.env.NEXT_PUBLIC_CDN_URL;

export function Profile({ user }) {
    const [avatar, setAvatar] = useState(user.avatar);
    const [username, setUsername] = useState(user.username);
    const [usernameError, setUsernameError] = useState(null);
    const [displayName, setDisplayName] = useState(user.displayName);
    const [description, setDescription] = useState(user.description);
    const [email, setEmail] = useState(user.email);
    const [emailError, setEmailError] = useState(null);
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const addAlert = useAlerts((state) => state.addAlert);
    const addModal = useModals((state) => state.addModal);

    const avatarInput = useRef(null);
    const hasChanged =
        avatar !== user.avatar ||
        username !== user.username ||
        displayName !== user.displayName ||
        description !== user.description ||
        email !== user.email;

    function resetState() {
        setAvatar(user.avatar);
        setUsername(user.username);
        setDisplayName(user.displayName);
        setDescription(user.description);
        setEmail(user.email);
    }

    async function saveUser() {
        if (isLoading) return;
        setIsLoading(true);
        let avatarUrl = "";

        if (user.username !== username && !password) {
            setIsLoading(false);
            return addModal({
                title: "Confirm Password",
                content: "Confirm Password",
                onSave: (password) => {
                    setPassword(password);
                    saveUser();
                },
            });
        }

        try {
            // if (avatar !== user.avatar && avatar !== null) {
            //     const result = await uploadFile(avatar, {
            //         publicKey: process.env.NEXT_PUBLIC_CDN_TOKEN,
            //         store: "auto",
            //     });

            //     if (!result.uuid) console.error(result);
            //     else avatarUrl = result.uuid;
            // }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEPATH ?? ""}/api/users/me`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        // avatar: user.avatar !== avatar ? avatarUrl : null,
                        username: user.username !== username ? username : null,
                        displayName:
                            user.displayName !== displayName
                                ? displayName
                                : null,
                        description:
                            user.description !== description
                                ? description
                                : null,
                        email: user.email !== email ? email : null,
                        password: password ? password : null,
                    }),
                },
            ).then((res) => res.json());

            if (response.success && response.data) {
                // setAvatar(response.data.avatar);
            } else {
                setPassword("");
            }

            addAlert({
                success: response.success,
                message: response.message,
            });

            if (
                response.message.toLowerCase().includes("email") &&
                !response.success
            ) {
                setEmailError(response.message);
            } else if (
                response.message.toLowerCase().includes("username") &&
                !response.success
            ) {
                setUsernameError(response.message);
            }
        } catch (err) {
            console.error(err);
            setPassword("");

            if (avatarUrl) {
                await removeImageFromCDN(avatarUrl);
            }

            addAlert({
                success: false,
                message: "An error occurred while saving your changes.",
            });
        }

        setIsLoading(false);
    }

    useEffect(() => {
        setEmailError("");
    }, [email]);

    useEffect(() => {
        setUsernameError("");
    }, [username]);

    return (
        <div className={styles.content}>
            <div>
                <Input
                    label="Username"
                    value={username}
                    error={usernameError}
                    onChange={(val) => setUsername(val)}
                />

                <Input
                    label="Display Name"
                    value={displayName}
                    onChange={(val) => setDisplayName(val)}
                />

                <Input
                    label="Email"
                    value={email}
                    error={emailError}
                    onChange={(val) => setEmail(val)}
                    placeholder="example@domain.com"
                />

                <Input
                    big
                    type="textarea"
                    label="Description"
                    value={description}
                    onChange={(val) => setDescription(val)}
                    placeholder="Tell us a little bit about yourself."
                />

                {hasChanged && (
                    <div className={styles.buttons}>
                        <button
                            className="button green"
                            onClick={saveUser}
                            disabled={isLoading}
                        >
                            Save Changes
                        </button>

                        {!isLoading && (
                            <button
                                className="button transparent"
                                onClick={() => resetState()}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div>
                {/* <div className={styles.avatar}>
                    <input
                        ref={avatarInput}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={async (e) => {
                            const file = e.target.files
                                ? e.target.files[0]
                                : null;
                            if (!file) return (e.target.value = "");

                            // Run checks
                            const maxFileSize = 1024 * 1024 * 10; // 10MB
                            if (file.size > maxFileSize) {
                                // File too large
                                console.log("File too large");
                                return (e.target.value = "");
                            }

                            const fileBytes = new Uint8Array(
                                await file.arrayBuffer(),
                            );
                            const fileType =
                                filetypeinfo(fileBytes)?.[0].mime?.toString();

                            if (
                                !fileType ||
                                !allowedFileTypes.includes(fileType)
                            ) {
                                // Invalid file type
                                console.log("Invalid file type");
                                return (e.target.value = "");
                            }

                            const newFile = new File([file], "image", {
                                type: file.type,
                            });

                            setAvatar(newFile);
                            e.target.value = "";
                        }}
                    />

                    <div>
                        {avatar ? (
                            <Image
                                src={
                                    typeof avatar === "string"
                                        ? `${cdn}/${avatar}/`
                                        : URL.createObjectURL(avatar)
                                }
                                alt="Avatar"
                                width={100}
                                height={100}
                            />
                        ) : (
                            <span>{user.username[0].toUpperCase()}</span>
                        )}
                        <span>{user.username[0].toUpperCase()}</span>

                        <button onClick={() => avatarInput.current.click()}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                            >
                                <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                                <path d="M13.5 6.5l4 4" />
                            </svg>
                            <p>Edit</p>
                        </button>

                        {avatar && (
                            <button
                                title="Remove Avatar"
                                onClick={() => setAvatar(null)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="16"
                                    height="16"
                                >
                                    <path
                                        d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16z"
                                        strokeWidth="0"
                                        fill="currentColor"
                                        className="base"
                                    />
                                    <path
                                        d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z"
                                        strokeWidth="0"
                                        fill="currentColor"
                                        className="base"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                </div> */}
            </div>
        </div>
    );
}
