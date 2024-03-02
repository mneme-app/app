"use client";

import { useStore, useAlerts } from "@/store/store";
import styles from "./Notifications.module.css";

export function Notifications() {
    const removeNotification = useStore((state) => state.removeNotification);
    const readNotification = useStore((state) => state.readNotification);
    const notifications = useStore((state) => state.notifications);
    const addAssociate = useStore((state) => state.addAssociate);
    const addAlert = useAlerts((state) => state.addAlert);
    const addGroup = useStore((state) => state.addGroup);

    const basePath = process.env.NEXT_PUBLIC_BASEPATH ?? "";

    async function accept(notification) {
        let url = `/api/associates/${notification.id}/accept`;
        if (notification.type === 2) {
            url = `/api/groups/${notification.group}/members/${notification.recipient}/accept`;
        }

        const response = await fetch(`${basePath}${url}`, {
            method: "POST",
        }).then((res) => res.json());

        if (response.success) {
            removeNotification(notification.id);

            if (response.associate) {
                addAssociate(response.associate);
            } else if (response.group) {
                addGroup(response.group);
            }
        }

        addAlert({
            success: response.success,
            message: response.message,
        });
    }

    async function decline(notification) {
        let url = `/api/associates/${notification.id}/decline`;
        if (notification.type === 2) {
            url = `/api/groups/${notification.group}/members/${notification.recipient}/decline`;
        }

        const response = await fetch(`${basePath}${url}`, {
            method: "POST",
        }).then((res) => res.json());

        if (response.success) {
            removeNotification(notification.id);
        }

        addAlert({
            success: response.success,
            message: response.message,
        });
    }

    async function remove(notification) {
        let url = `/api/notifications/${notification.id}`;

        const response = await fetch(`${basePath}${url}`, {
            method: "DELETE",
        }).then((res) => res.json());

        if (response.success) {
            removeNotification(notification.id);
        }
    }

    async function read(notification) {
        const url = `/api/notifications/${notification.id}`;

        const response = await fetch(`${basePath}${url}`, {
            method: "PATCH",
        }).then((res) => res.json());

        if (response.success) {
            readNotification(notification.id);
        }
    }

    if (notifications.length === 0) return null;

    return (
        <div className={styles.container}>
            <h3>
                Notifications
                <span className={styles.chip}>{notifications.length}</span>
            </h3>

            <ul className="scrollbar">
                {notifications.map((n) => (
                    <div
                        key={n.id}
                        className={`${styles.notification} ${
                            n.read ? styles.read : ""
                        }`}
                    >
                        <header>
                            <h3>{n.subject}</h3>
                            <p>{n.message}</p>
                        </header>

                        <div className={styles.actions}>
                            <button onClick={() => accept(n)}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    fill="none"
                                >
                                    <path d="M5 12l5 5l10 -10" />
                                </svg>
                            </button>

                            <button onClick={() => decline(n)}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    fill="none"
                                >
                                    <path d="M18 6l-12 12" />
                                    <path d="M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <button
                            title="Mark as read"
                            onClick={() => read(n)}
                            className={styles.readButton}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                            >
                                <path
                                    d="M12 4c4.29 0 7.863 2.429 10.665 7.154l.22 .379l.045 .1l.03 .083l.014 .055l.014 .082l.011 .1v.11l-.014 .111a.992 .992 0 0 1 -.026 .11l-.039 .108l-.036 .075l-.016 .03c-2.764 4.836 -6.3 7.38 -10.555 7.499l-.313 .004c-4.396 0 -8.037 -2.549 -10.868 -7.504a1 1 0 0 1 0 -.992c2.831 -4.955 6.472 -7.504 10.868 -7.504zm0 5a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z"
                                    strokeWidth="0"
                                    fill="currentColor"
                                    className="base"
                                />
                            </svg>
                        </button>

                        <button
                            title="Remove notification"
                            onClick={() => remove(n)}
                            className={styles.removeButton}
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
                    </div>
                ))}
            </ul>
        </div>
    );
}
