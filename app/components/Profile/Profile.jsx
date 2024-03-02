"use client";

import { useMenu, useModals, useStore } from "@/store/store";
import { usePathname, useRouter } from "next/navigation";
import { protectedPaths } from "@/app/data/paths";
import styles from "./Profile.module.css";
import { Avatar } from "@client";

const basePath = process.env.NEXT_PUBLIC_BASEPATH ?? "";

export function Profile({ user, size = 44 }) {
    const notifications = useStore((state) => state.notifications);
    const addModal = useModals((state) => state.addModal);
    const setMenu = useMenu((state) => state.setMenu);
    const menu = useMenu((state) => state.menu);

    const router = useRouter();
    const path = usePathname();

    function handleMenu(e) {
        e.preventDefault();

        if (menu?.element !== e.currentTarget) {
            setMenu({
                element: e.currentTarget,
                topContent: (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            padding: "6px 8px",
                            fontSize: 14,
                        }}
                    >
                        <p>{user.username}</p>
                        <p
                            style={{
                                fontSize: 12,
                                marginTop: 4,
                                color: "var(--foreground-4)",
                            }}
                        >
                            {user.email}
                        </p>
                    </div>
                ),
                items: [
                    {
                        name: "Dashboard",
                        icon: (
                            <g>
                                <path className="fill" d="M4 4h6v8h-6z" />
                                <path className="fill" d="M4 16h6v4h-6z" />
                                <path className="fill" d="M14 12h6v8h-6z" />
                                <path className="fill" d="M14 4h6v4h-6z" />
                            </g>
                        ),
                        onClick: () => router.push("/me/dashboard"),
                    },
                    {
                        name: "Settings",
                        icon: (
                            <g>
                                <path
                                    d="M14.647 4.081a.724 .724 0 0 0 1.08 .448c2.439 -1.485 5.23 1.305 3.745 3.744a.724 .724 0 0 0 .447 1.08c2.775 .673 2.775 4.62 0 5.294a.724 .724 0 0 0 -.448 1.08c1.485 2.439 -1.305 5.23 -3.744 3.745a.724 .724 0 0 0 -1.08 .447c-.673 2.775 -4.62 2.775 -5.294 0a.724 .724 0 0 0 -1.08 -.448c-2.439 1.485 -5.23 -1.305 -3.745 -3.744a.724 .724 0 0 0 -.447 -1.08c-2.775 -.673 -2.775 -4.62 0 -5.294a.724 .724 0 0 0 .448 -1.08c-1.485 -2.439 1.305 -5.23 3.744 -3.745a.722 .722 0 0 0 1.08 -.447c.673 -2.775 4.62 -2.775 5.294 0zm-2.647 4.919a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z"
                                    className="fill stroke0"
                                />
                            </g>
                        ),
                        onClick: () => router.push("/me/settings"),
                    },
                    {
                        name: "hr",
                    },
                    {
                        name: "Report a bug",
                        icon: (
                            <g>
                                <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                    className="base"
                                />
                                <path
                                    d="M4 5a1 1 0 0 1 .3 -.714a6 6 0 0 1 8.213 -.176l.351 .328a4 4 0 0 0 5.272 0l.249 -.227c.61 -.483 1.527 -.097 1.61 .676l.005 .113v9a1 1 0 0 1 -.3 .714a6 6 0 0 1 -8.213 .176l-.351 -.328a4 4 0 0 0 -5.136 -.114v6.552a1 1 0 0 1 -1.993 .117l-.007 -.117v-16z"
                                    strokeWidth="0"
                                    fill="currentColor"
                                    className="fill stroke0"
                                />
                            </g>
                        ),
                        onClick: () =>
                            addModal({
                                title: "Report a bug",
                                content: "Report a bug",
                                buttonTexts: ["Cancel", "Send"],
                                onSave: (data) => {
                                    fetch(`${basePath}/api/error`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            message:
                                                data.title ??
                                                "No title provided",
                                            stack: data.description,
                                            url: data.url,
                                            userInfo: {
                                                userAgent: navigator.userAgent,
                                                language: navigator.language,
                                                cookieEnabled:
                                                    navigator.cookieEnabled,
                                                doNotTrack:
                                                    navigator.doNotTrack,
                                                hardwareConcurrency:
                                                    navigator.hardwareConcurrency,
                                                maxTouchPoints:
                                                    navigator.maxTouchPoints,
                                                isOnline: navigator.onLine,
                                            },
                                            isClient: true,
                                            report: true,
                                        }),
                                    });
                                },
                            }),
                        danger: true,
                    },
                    {
                        name: "hr",
                    },
                    {
                        name: "Logout",
                        danger: true,
                        icon: (
                            <g>
                                <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                                <path d="M9 12h12l-3 -3" />
                                <path d="M18 15l3 -3" />
                            </g>
                        ),
                        onClick: logout,
                    },
                ],
                bottom: true,
                left: true,
                minWidth: 180,
            });
        } else {
            setMenu(null);
        }
    }

    function handleNotificationMenu(e) {
        e.preventDefault();
        e.stopPropagation();

        if (menu?.element === e.currentTarget) {
            setMenu(null);
        } else {
            setMenu({
                element: e.currentTarget,
                items: [
                    {
                        name: "See all notifications",
                        onClick: () => {
                            localStorage.setItem("currentTab", 0);
                            router.push("/me/dashboard");
                        },
                    },
                    {
                        name: "hr",
                    },
                    {
                        name: "Mark all as read",
                        onClick: () => console.log("read"),
                    },
                ],
                bottom: true,
                left: true,
            });
        }
    }

    const logout = async () => {
        await fetch(
            `${process.env.NEXT_PUBLIC_BASEPATH ?? ""}/api/auth/logout`,
            {
                method: "POST",
            },
        );

        if (protectedPaths.includes(path)) {
            router.push("/login");
        }

        router.refresh();
    };

    return (
        <div className={styles.container}>
            <div
                tabIndex={0}
                className={styles.avatarContainer}
                onClick={(e) => handleMenu(e)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleMenu(e);
                    }
                }}
            >
                <Avatar
                    src={user.avatar}
                    username={user.username}
                    size={size}
                />

                {!!notifications.length && (
                    <sub
                        tabIndex={0}
                        onClick={(e) => handleNotificationMenu(e)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleNotificationMenu(e);
                            }
                        }}
                    >
                        {notifications.length}
                    </sub>
                )}
            </div>
        </div>
    );
}
