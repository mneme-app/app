"use client";

import { useAlerts, useModals, useStore } from "@/store/store";
import { Avatar, Notifications, UserCard } from "@client";
import styles from "./Dash.module.css";
import { useState } from "react";
import Link from "next/link";

const basePath = process.env.NEXT_PUBLIC_BASEPATH ?? "";

export function Dashboard({ more = false }) {
    const user = useStore((state) => state.user);
    const notes = useStore((state) => state.notes);
    const sources = useStore((state) => state.sources);
    const quizzes = useStore((state) => state.quizzes);
    const courses = useStore((state) => state.courses);
    const groups = useStore((state) => state.groups);
    const associates = useStore((state) => state.associates);
    const addAlert = useAlerts((state) => state.addAlert);
    const addAssociate = useStore((state) => state.addAssociate);

    const groupsCreated = groups.filter((group) => group.owner === user.id);
    const groupsJoined = groups.filter((group) => group.owner !== user.id);

    const [associate, setAssociate] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [currentTab, setCurrentTab] = useState(
        parseInt(localStorage ? localStorage.getItem("currentTab") || 0 : 0),
    );

    const tabs = [
        {
            name: "User",
            icon: (
                <g>
                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                    <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                </g>
            ),
            summaries: [
                {
                    name: "Sources",
                    data: sources.length,
                },
                {
                    name: "Quizzes",
                    data: quizzes.length,
                },
                {
                    name: "Notes",
                    data: notes.length,
                },
                {
                    name: "Associates",
                    data: associates.length,
                },
                {
                    name: "Groups",
                    data: groups.length,
                },
            ],
        },
        {
            name: "Courses",
            icon: (
                <g>
                    <path d="M15 15m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                    <path d="M13 17.5v4.5l2 -1.5l2 1.5v-4.5" />
                    <path d="M10 19h-5a2 2 0 0 1 -2 -2v-10c0 -1.1 .9 -2 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -1 1.73" />
                    <path d="M6 9l12 0" />
                    <path d="M6 12l3 0" />
                    <path d="M6 15l2 0" />
                </g>
            ),
            summaries: [
                {
                    name: "Enrolled",
                    data: courses.length,
                },
                {
                    name: "Completed",
                    data: "What does it mean to be complete?",
                },
            ],
        },
        {
            name: "Groups",
            icon: (
                <g>
                    <path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                    <path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" />
                    <path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                    <path d="M17 10h2a2 2 0 0 1 2 2v1" />
                    <path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                    <path d="M3 13v-1a2 2 0 0 1 2 -2h2" />
                </g>
            ),
            summaries: [
                {
                    name: "Created",
                    data: groupsCreated.length,
                },
                {
                    name: "Joined",
                    data: groupsJoined.length,
                },
            ],
        },
        {
            name: "Associates",
            icon: (
                <g>
                    <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                    <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                </g>
            ),
            summaries: [
                {
                    name: "Associates",
                    data: associates.length,
                },
            ],
        },
    ];

    async function requestAssociate() {
        if (isLoading || associate.length === 0) return;
        setIsLoading(true);

        const response = await fetch(`${basePath}/api/associates`, {
            method: "POST",
            body: JSON.stringify({ input: associate }),
        }).then((res) => res.json());

        if (response.success) {
            setAssociate("");

            if (response.associate) {
                addAssociate(response.associate);
            }
        }

        addAlert({
            success: response.success,
            message: response.message,
        });

        setIsLoading(false);
    }

    if (!user) return null;

    return (
        <main className={styles.main}>
            <section>
                <nav>
                    <ul className={styles.tabList}>
                        {tabs.map((tab, index) => (
                            <li
                                key={tab.name}
                                tabIndex={0}
                                className={
                                    currentTab === index ? styles.active : ""
                                }
                                onClick={() => {
                                    setCurrentTab(index);
                                    localStorage.setItem("currentTab", index);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        setCurrentTab(index);
                                        localStorage.setItem(
                                            "currentTab",
                                            index,
                                        );
                                    }
                                }}
                            >
                                <div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                    >
                                        {tab.icon}
                                    </svg>
                                </div>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className={styles.content}>
                    <header>
                        <h1>
                            {currentTab === 0 && (
                                <Avatar
                                    src={user.avatar}
                                    username={user.username}
                                    size={42}
                                />
                            )}

                            {currentTab === 0
                                ? user.username
                                : tabs[currentTab].name}

                            {currentTab === 0 && (
                                <span>XP {user.xp ? user.xp : 0}</span>
                            )}

                            {currentTab !== 0 && (
                                <Link
                                    className={styles.browseLink}
                                    title={`Browse ${tabs[currentTab].name}`}
                                    href={`/${tabs[
                                        currentTab
                                    ].name.toLowerCase()}`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="20"
                                        height="20"
                                    >
                                        <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" />
                                        <path d="M11 13l9 -9" />
                                        <path d="M15 4h5v5" />
                                    </svg>
                                </Link>
                            )}
                        </h1>

                        <div className={styles.summaries}>
                            {tabs[currentTab].summaries.map((sum) => (
                                <div key={sum.name}>
                                    <p>{sum.name}</p>
                                    <p>{sum.data}</p>
                                </div>
                            ))}
                        </div>
                    </header>

                    <main className="scrollbar">
                        <header>
                            <h1>
                                {currentTab === 0 && (
                                    <Avatar
                                        src={user.avatar}
                                        username={user.username}
                                        size={42}
                                    />
                                )}

                                {currentTab === 0
                                    ? user.username
                                    : tabs[currentTab].name}

                                {currentTab === 0 && (
                                    <span>XP {user.xp ? user.xp : 0}</span>
                                )}

                                {currentTab !== 0 && (
                                    <Link
                                        className={styles.browseLink}
                                        title={`Browse ${tabs[currentTab].name}`}
                                        href={`/${tabs[
                                            currentTab
                                        ].name.toLowerCase()}`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width="20"
                                            height="20"
                                        >
                                            <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" />
                                            <path d="M11 13l9 -9" />
                                            <path d="M15 4h5v5" />
                                        </svg>
                                    </Link>
                                )}
                            </h1>

                            <div className={styles.summaries}>
                                {tabs[currentTab].summaries.map((sum) => (
                                    <div key={sum.name}>
                                        <p>{sum.name}</p>
                                        <p>{sum.data}</p>
                                    </div>
                                ))}
                            </div>
                        </header>

                        {currentTab === 0 && (
                            <div className={styles.userContent}>
                                <Notifications />

                                <div>
                                    <h3>Pick up where you left off</h3>

                                    <ul className={styles.gridList}>
                                        {Array(5)
                                            .fill()
                                            .map((_, index) => (
                                                <div
                                                    key={"Course_" + index}
                                                    className={styles.card}
                                                >
                                                    <h3>Course Name</h3>

                                                    <p>
                                                        Lorem ipsum dolor sit
                                                        amet consectetur
                                                        adipisicing elit.
                                                        Quisquam, quos!
                                                    </p>
                                                </div>
                                            ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3>Attempt quizzes to earn XP</h3>

                                    <ul className={styles.gridList}>
                                        {Array(7)
                                            .fill()
                                            .map((_, index) => (
                                                <div
                                                    key={"Quiz_" + index}
                                                    className={styles.card}
                                                >
                                                    <h3>Quizz</h3>

                                                    <p>
                                                        Lorem ipsum dolor sit
                                                        amet consectetur
                                                        adipisicing elit.
                                                        Quisquam, quos!
                                                    </p>
                                                </div>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {currentTab === 1 &&
                            (!courses.length ? (
                                <div className={styles.empty}>
                                    <p>
                                        You haven't enrolled in any courses yet.
                                    </p>

                                    <Link className="button" href="/courses">
                                        Explore Courses
                                    </Link>
                                </div>
                            ) : (
                                <ul className={styles.gridList}>
                                    {courses.map((course) => (
                                        <Link
                                            key={course.id}
                                            className={styles.card}
                                            href={`/courses/${course.name}`}
                                        >
                                            <h3>{course.name}</h3>

                                            <p>
                                                {course.description ||
                                                    "No description provided."}
                                            </p>
                                        </Link>
                                    ))}
                                </ul>
                            ))}

                        {currentTab === 2 &&
                            (!groups.length ? (
                                <div className={styles.empty}>
                                    <p>You haven't created any groups yet.</p>

                                    <Link className="button" href="/groups">
                                        Explore Groups
                                    </Link>
                                </div>
                            ) : (
                                <div className={styles.userContent}>
                                    {groupsCreated.length > 0 && (
                                        <div>
                                            <h3>
                                                Groups you created
                                                <span className={styles.chip}>
                                                    {groupsCreated.length}
                                                </span>
                                            </h3>

                                            <ul className={styles.gridList}>
                                                {groupsCreated.map((group) => (
                                                    <Link
                                                        key={group.id}
                                                        className={styles.card}
                                                        href={`/groups/${group.id}`}
                                                    >
                                                        <h3>{group.name}</h3>

                                                        <p>
                                                            {group.description ||
                                                                "No description provided."}
                                                        </p>
                                                    </Link>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {groupsJoined.length > 0 && (
                                        <div>
                                            <h3>
                                                Groups you joined
                                                <span className={styles.chip}>
                                                    {groupsJoined.length}
                                                </span>
                                            </h3>

                                            <ul className={styles.gridList}>
                                                {groupsJoined.map((group) => (
                                                    <Link
                                                        key={group.id}
                                                        className={styles.card}
                                                        href={`/groups/${group.id}`}
                                                    >
                                                        <h3>{group.name}</h3>

                                                        <p>
                                                            {group.description ||
                                                                "No description provided."}
                                                        </p>
                                                    </Link>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}

                        {currentTab === 3 &&
                            (!associates.length ? (
                                <div className={styles.empty}>
                                    <p>You haven't added any associates yet.</p>

                                    <div className={styles.input}>
                                        <label htmlFor="addAssociate">
                                            Add Associate by Username or ID
                                        </label>

                                        <div>
                                            <input
                                                id="addAssociate"
                                                type="text"
                                                placeholder="Username or ID"
                                                value={associate}
                                                onChange={(e) =>
                                                    setAssociate(e.target.value)
                                                }
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key === "Enter" &&
                                                        !isLoading
                                                    ) {
                                                        requestAssociate();
                                                    }
                                                }}
                                            />

                                            <button
                                                onClick={() =>
                                                    requestAssociate()
                                                }
                                                disabled={isLoading}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className={styles.input}>
                                        <label htmlFor="addAssociate">
                                            Add Associate by Username or ID
                                        </label>

                                        <div>
                                            <input
                                                id="addAssociate"
                                                type="text"
                                                placeholder="Username or ID"
                                                value={associate}
                                                onChange={(e) =>
                                                    setAssociate(e.target.value)
                                                }
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key === "Enter" &&
                                                        !isLoading
                                                    ) {
                                                        requestAssociate();
                                                    }
                                                }}
                                            />

                                            <button
                                                onClick={() =>
                                                    requestAssociate()
                                                }
                                                disabled={isLoading}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>

                                    <ul className={styles.gridList}>
                                        {associates.map((user) => (
                                            <li key={user.id}>
                                                <UserCard user={user} />
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ))}

                        {more && (
                            <div>
                                <button className={styles.dashButton}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M19.95 11a8 8 0 1 0 -.5 4m.5 5v-5h-5" />
                                    </svg>

                                    <span>Load More</span>
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </section>
        </main>
    );
}

// addModal({
//     title: "Remove Associate",
//     content: `Are you sure you want to remove ${associate.username} as an associate?`,
//     onSave: () => {
//         tryRemoveAssociate(
//             associate.id,
//         );
//     },
//     buttonTexts: [
//         "Cancel",
//         "Yes, remove",
//     ],
// });
