"use client";

import { Input, Spinner, DeletePopup, UserInput } from "@client";
import { PermissionsDisplay } from "../Form/PermissionsDisplay";
import { useStore, useModals, useAlerts } from "@/store/store";
import styles from "../Quiz/QuizInput.module.css";
import { useEffect, useState } from "react";
import { MIN, MAX } from "@/lib/constants";
import { serializeOne } from "@/lib/db";

export function NoteInput({ note }) {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [sources, setSources] = useState([]);
    const [courses, setCourses] = useState([]);
    const [tags, setTags] = useState([]);

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [permissions, setPermissions] = useState({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const availableSources = useStore((state) => state.sources);
    const availableCourses = useStore((state) => state.courses);
    const user = useStore((state) => state.user);

    const removeModal = useModals((state) => state.removeModal);
    const addModal = useModals((state) => state.addModal);
    const addAlert = useAlerts((state) => state.addAlert);

    const canDelete = note && note.createdBy === user.id;

    useEffect(() => {
        if (!note) return;

        if (note.title) setTitle(note.title);
        if (note.text) setText(note.text);

        if (note.sources?.length > 0) {
            setSources(
                note.sources.map((srcId, index) => {
                    const source = availableSources?.find(
                        (x) => x._id === srcId,
                    );

                    if (!source) {
                        return {
                            id: index,
                            title: "unavailable",
                        };
                    }

                    return source;
                }),
            );
        }

        if (note.courses && note.courses.length > 0) {
            setCourses(
                note.courses.map((courseId, index) => {
                    const course = availableCourses.find(
                        (x) => x._id === courseId,
                    );

                    if (!course) {
                        return {
                            id: index,
                            name: "unavailable",
                        };
                    }
                }),
            );
        }

        if (note.tags?.length > 0) setTags([...note.tags]);
        if (note.permissions) setPermissions(serializeOne(note.permissions));
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        if (loading) return;

        let valid = true;

        if (title.length < MIN.title || title.length > MAX.title) {
            valid = false;
            setErrors((prev) => ({
                ...prev,
                title: `Title must be between ${MIN.title} and ${MAX.title} characters long`,
            }));
        }

        if (text.length < MIN.text || text.length > MAX.text) {
            valid = false;
            setErrors((prev) => ({
                ...prev,
                text: `Text must be between ${MIN.text} and ${MAX.text} characters long`,
            }));
        }

        if (sources.length === 0) {
            valid = false;
            setErrors((prev) => ({
                ...prev,
                sources: "Please add at least one source",
            }));
        }

        if (!valid) return;

        const notePayload = {
            title,
            text,
            sources: sources.filter((s) => s).map((src) => src._id),
            courses: courses.filter((c) => c).map((course) => course._id),
            tags,
        };

        notePayload.permissions = permissions;
        if (note && note._id) {
            notePayload._id = note._id;
        }

        setLoading(true);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASEPATH ?? ""}/api/note`,
            {
                method: note && note._id ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(notePayload),
            },
        );

        setLoading(false);

        if (response.status === 201) {
            setText("");
            setTitle("");
            setSources([]);
            setCourses([]);
            setTags([]);
            setPermissions({});
            setErrors({});

            addAlert({
                success: true,
                message: "Note added succesfully",
            });
        } else if (response.status === 200) {
            addAlert({
                success: true,
                message: "Note edited succesfully.",
            });
        } else if (response.status === 401) {
            addAlert({
                success: false,
                message: "You have been signed out. Please sign in again.",
            });
            addModal({
                title: "Sign back in",
                content: <UserInput onSubmit={removeModal} />,
            });
        } else {
            const json = await response.json();
            addAlert({
                success: false,
                message: json.message,
            });
        }
    }

    return (
        <form className={styles.form}>
            <Input
                value={title}
                label="Title"
                error={errors.title}
                maxLength={MAX.title}
                onChange={(val) => setTitle(val)}
            />

            <Input
                required
                type="select"
                error={errors.sources}
                label="Related Sources"
                placeholder="Pick related sources"
                value={sources.map((x) => x.title)}
                choices={availableSources.map((x) => x.title)}
                description="Pick sources that are related to this note"
                onChange={(val) => {
                    const source = availableSources.find(
                        (x) => x.title === val,
                    );

                    if (source) {
                        if (sources.includes(source)) {
                            setSources((prev) =>
                                prev.filter((x) => x !== source),
                            );
                        } else {
                            setSources((prev) => [...prev, source]);
                        }
                    }
                }}
                removeItem={(val) => {
                    const source = availableSources.find(
                        (x) => x.title === val,
                    );
                    if (source) {
                        setSources((prev) => prev.filter((x) => x !== source));
                    }
                }}
            />

            <Input
                big
                required
                label="Text"
                value={text}
                type="textarea"
                onChange={(val) => {
                    setText(val);
                    setErrors((prev) => ({
                        ...prev,
                        text: "",
                    }));
                }}
                error={errors.text}
                maxLength={MAX.text}
            />

            <Input
                type="select"
                label="Related Courses"
                placeholder="Pick related courses"
                value={courses.map((x) => x.name)}
                choices={availableCourses.map((x) => x.name)}
                description="Pick courses that are related to this note"
                onChange={(val) => {
                    const course = availableCourses.find((x) => x.name === val);

                    if (course) {
                        if (courses.includes(course)) {
                            setCourses((prev) =>
                                prev.filter((x) => x !== course),
                            );
                        } else {
                            setCourses((prev) => [...prev, course]);
                        }
                    }
                }}
                removeItem={(val) => {
                    const course = availableCourses.find((x) => x.name === val);
                    if (course) {
                        setCourses((prev) => prev.filter((x) => x !== course));
                    }
                }}
            />

            <div className={styles.permissions}>
                <PermissionsDisplay
                    permissions={permissions}
                    canEdit={!note || (user && note.createdBy === user.id)}
                    setter={setPermissions}
                />
            </div>

            <div className={styles.advanced}>
                <h4
                    tabIndex={0}
                    onClick={() => setShowAdvanced((prev) => !prev)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            setShowAdvanced((prev) => !prev);
                        }
                    }}
                >
                    Advanced
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        style={{
                            transform: `rotate(${showAdvanced ? 90 : 0}deg)`,
                        }}
                    >
                        <path d="M9 6l6 6l-6 6" />
                    </svg>
                </h4>

                {showAdvanced && (
                    <Input
                        label="Tags"
                        maxLength={MAX.tag}
                        description="A word or phrase that could be used to search for this note"
                        value={tags}
                        onChange={(val) => setTags(val)}
                        removeItem={(val) => {
                            if (tags.length - 1 <= 100) {
                                setErrors((prev) => ({
                                    ...prev,
                                    tags: "",
                                }));
                            }
                            setTags((prev) => prev.filter((x) => x !== val));
                        }}
                        placeholder="Tag"
                        maxValues={100}
                        error={errors.tags}
                    />
                )}
            </div>

            <button onClick={handleSubmit} className="button submit">
                {loading ? <Spinner /> : "Submit Note"}
            </button>

            {canDelete && (
                <DeletePopup resourceType="note" resourceId={note._id} />
            )}
        </form>
    );
}
