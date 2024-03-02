"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import styles from "./Permissions.module.css";
import { useState } from "react";
import { PermissionsInput } from "./PermissionsInput";
import { useModals } from "@/store/store";

export function PermissionsDisplay({ permissions, canEdit, setter }) {
    const [showContent, setShowContent] = useState(false);
    const addModal = useModals((state) => state.addModal);

    return (
        <div className={styles.permissions}>
            <h4
                tabIndex={0}
                onClick={() => setShowContent((prev) => !prev)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        setShowContent((prev) => !prev);
                    }
                }}
            >
                Permissions
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    style={{ transform: `rotate(${showContent ? 90 : 0}deg)` }}
                >
                    <path d="M9 6l6 6l-6 6" />
                </svg>
            </h4>

            {showContent && permissions && (
                <>
                    <div>
                        <h5>Edit</h5>

                        {permissions.allWrite && <p>Everyone</p>}

                        {!permissions.allWrite &&
                            !permissions.usersWrite?.length &&
                            !permissions.groupsWrite?.length && <p>No one</p>}

                        {!permissions.allWrite &&
                            (permissions.usersWrite?.length ||
                                permissions.groupsWrite?.length) && (
                                <ul className="chipList">
                                    {permissions.usersWrite?.map((user) => {
                                        if (!user) {
                                            return (
                                                <li key={user}>Unavailable</li>
                                            );
                                        }
                                        return (
                                            <li key={user._id + "_write"}>
                                                <FontAwesomeIcon
                                                    icon={faUser}
                                                />
                                                <span>
                                                    {user.displayName
                                                        ? `${user.displayName} (${user.username})`
                                                        : user.username}
                                                </span>
                                            </li>
                                        );
                                    })}

                                    {permissions.groupsWrite?.map((group) => {
                                        if (!group) {
                                            return (
                                                <li key={group}>Unavailable</li>
                                            );
                                        }
                                        return (
                                            <li key={group._id + "_write"}>
                                                <FontAwesomeIcon
                                                    icon={faUserGroup}
                                                />
                                                <span>{group.name}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                    </div>

                    <div>
                        <h5>Read</h5>

                        {(permissions.allRead || permissions.allWrite) && (
                            <p>Everyone</p>
                        )}

                        {!permissions.allRead &&
                            !permissions.allWrite &&
                            !permissions.usersRead?.length &&
                            !permissions.groupsRead?.length && <p>No one</p>}

                        {!permissions.allRead &&
                            (permissions.usersRead?.length ||
                                permissions.groupsRead?.length) && (
                                <ul className="chipList">
                                    {permissions.usersRead?.map((user) => {
                                        if (!user) {
                                            return (
                                                <li key={user}>Unavailable</li>
                                            );
                                        }
                                        return (
                                            <li key={user._id + "_read"}>
                                                <FontAwesomeIcon
                                                    icon={faUser}
                                                />
                                                <span>
                                                    {user.displayName
                                                        ? `${user.displayName} (${user.username})`
                                                        : user.username}
                                                </span>
                                            </li>
                                        );
                                    })}

                                    {permissions.groupsRead?.map((group) => {
                                        if (!group) {
                                            return (
                                                <li key={group}>Unavailable</li>
                                            );
                                        }
                                        return (
                                            <li key={group._id + "_read"}>
                                                <FontAwesomeIcon
                                                    icon={faUserGroup}
                                                />
                                                <span>{group.name}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                    </div>

                    {canEdit && (
                        <button
                            type="button"
                            className="button"
                            onClick={() => {
                                addModal({
                                    title: "Edit Permissions",
                                    content: (
                                        <PermissionsInput
                                            permissions={permissions}
                                            setter={setter}
                                        />
                                    ),
                                });
                            }}
                        >
                            Edit Permissions
                        </button>
                    )}
                </>
            )}
        </div>
    );
}
