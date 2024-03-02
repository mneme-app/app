"use client";

import { useStore, useModals } from "@/store/store";
import styles from "./Permissions.module.css";
import { useState, useEffect } from "react";
import { Input } from "@client";

export function PermissionsInput({ permissions, setter }) {
    const [allWrite, setAllWrite] = useState(
        permissions ? permissions.allWrite || false : false,
    );
    const [allRead, setAllRead] = useState(
        permissions ? permissions.allRead || false : false,
    );
    const [usersWrite, setUsersWrite] = useState([]);
    const [usersRead, setUsersRead] = useState([]);
    const [groupsWrite, setGroupsWrite] = useState([]);
    const [groupsRead, setGroupsRead] = useState([]);

    const user = useStore((state) => state.user);
    const availableGroups = useStore((state) => state.groups);
    const addModal = useModals((state) => state.addModal);

    useEffect(() => {
        if (!permissions) return;

        if (permissions.usersWrite) {
            setUsersWrite(
                permissions.usersWrite.map((userId) =>
                    user?.associates.find((x) => x._id === userId),
                ),
            );
        }

        if (permissions.usersRead) {
            setUsersRead(
                permissions.usersRead.map((userId) =>
                    user?.associates.find((x) => x._id === userId),
                ),
            );
        }

        if (permissions.groupsWrite) {
            setGroupsWrite(
                permissions.groupsWrite.map((groupId) =>
                    availableGroups.find((x) => x._id === groupId),
                ),
            );
        }
        if (permissions.groupsRead) {
            setGroupsRead(
                permissions.groupsRead.map((groupId) =>
                    availableGroups.find((x) => x._id === groupId),
                ),
            );
        }
    }, []);

    useEffect(() => {
        let localPerm = {};

        if (allWrite) {
            localPerm.allWrite = true;
            setter(localPerm);
            return;
        }

        if (allRead) {
            localPerm.allRead = true;
        }
        if (usersWrite.length > 0) {
            localPerm.usersWrite = [...usersWrite];
        }
        if (usersRead.length > 0 && !allRead) {
            localPerm.usersRead = [...usersRead];
        }
        if (groupsWrite.length > 0) {
            localPerm.groupsWrite = [...groupsWrite];
        }
        if (groupsRead.length > 0 && !allRead) {
            localPerm.groupsRead = [...groupsRead];
        }

        setter(localPerm);
    }, [allWrite, allRead, usersWrite, usersRead, groupsWrite, groupsRead]);

    return (
        <div className={styles.form}>
            <div className={styles.toggles}>
                <Input
                    type="toggle"
                    label="Allow all users to edit"
                    value={allWrite}
                    onChange={() => setAllWrite(!allWrite)}
                />

                <Input
                    type="toggle"
                    label="Allow all users to view"
                    disabled={allWrite}
                    value={allRead || allWrite}
                    onChange={() => setAllRead(!allRead)}
                />
            </div>

            <Input
                type="select"
                disabled={allWrite}
                choices={user.associates.map((x) => x.username)}
                label="Associates with permission to edit"
                description="Pick associates that you want to be able to edit this resource"
                value={usersWrite.map((x) => x.username)}
                onChange={(val) => {
                    const member = user?.associates?.find(
                        (x) => x.username === val,
                    );

                    if (member) {
                        if (usersWrite.map((x) => x.id).includes(member.id)) {
                            setUsersWrite((prev) =>
                                prev.filter((x) => x.id !== member.id),
                            );
                        } else {
                            setUsersWrite((prev) => [...prev, member]);
                        }
                    }
                }}
                removeItem={(val) => {
                    const member = user?.associates?.find(
                        (x) => x.username === val,
                    );
                    if (member) {
                        setUsersWrite((prev) =>
                            prev.filter((x) => x.id !== member.id),
                        );
                    }
                }}
                placeholder="Pick associates"
            />

            <Input
                type="select"
                disabled={allRead || allWrite}
                choices={user.associates.map((x) => x.username)}
                label="Associates with permission to view"
                description="Pick associates that you want to be able to view this resource"
                value={usersRead.map((x) => x.username)}
                onChange={(val) => {
                    const member = user?.associates?.find(
                        (x) => x.username === val,
                    );

                    if (member) {
                        if (usersRead.map((x) => x.id).includes(member.id)) {
                            setUsersRead((prev) =>
                                prev.filter((x) => x.id !== member.id),
                            );
                        } else {
                            setUsersRead((prev) => [...prev, member]);
                        }
                    }
                }}
                removeItem={(val) => {
                    const member = user?.associates?.find(
                        (x) => x.username === val,
                    );
                    if (member) {
                        setUsersRead((prev) =>
                            prev.filter((x) => x.id !== member.id),
                        );
                    }
                }}
                placeholder="Pick associates"
            />

            <Input
                type="select"
                disabled={allWrite}
                choices={availableGroups.map((x) => x.name)}
                label="Groups with permission to edit"
                description="Pick groups that you want to be able to edit this resource"
                value={groupsWrite.map((x) => x.name)}
                onChange={(val) => {
                    const group = availableGroups.find((x) => x.name === val);

                    if (group) {
                        if (groupsWrite.map((x) => x.id).includes(group.id)) {
                            setGroupsWrite((prev) =>
                                prev.filter((x) => x.id !== group.id),
                            );
                        } else {
                            setGroupsWrite((prev) => [...prev, group]);
                        }
                    }
                }}
                removeItem={(val) => {
                    const group = availableGroups.find((x) => x.name === val);
                    if (group) {
                        setGroupsWrite((prev) =>
                            prev.filter((x) => x.id !== group.id),
                        );
                    }
                }}
                placeholder="Pick groups"
            />

            <Input
                type="select"
                disabled={allRead || allWrite}
                choices={availableGroups.map((x) => x.name)}
                label="Groups with permission to view"
                description="Pick groups that you want to be able to view this resource"
                value={groupsRead.map((x) => x.name)}
                onChange={(val) => {
                    const group = availableGroups.find((x) => x.name === val);

                    if (group) {
                        if (groupsRead.map((x) => x.id).includes(group.id)) {
                            setGroupsRead((prev) =>
                                prev.filter((x) => x.id !== group.id),
                            );
                        } else {
                            setGroupsRead((prev) => [...prev, group]);
                        }
                    }
                }}
                removeItem={(val) => {
                    const group = availableGroups.find((x) => x.name === val);
                    if (group) {
                        setGroupsRead((prev) =>
                            prev.filter((x) => x.id !== group.id),
                        );
                    }
                }}
                placeholder="Pick groups"
            />
        </div>
    );
}
