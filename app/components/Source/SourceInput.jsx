"use client";

import { Input, Spinner, DeletePopup, UserInput } from "@client";
import { PermissionsDisplay } from "../Form/PermissionsDisplay";
import { useStore, useModals, useAlerts } from "@/store/store";
import { buildPermissions } from "@/lib/permissions";
import styles from "../Quiz/QuizInput.module.css";
import { useState, useEffect } from "react";
import { MIN, MAX } from "@/lib/constants";
import { serializeOne } from "@/lib/db";
import htmlDate from "@/lib/htmlDate";

export function SourceInput({ source }) {
    const [title, setTitle] = useState("");
    const [medium, setMedium] = useState("article");
    const [url, setUrl] = useState("");
    const [lastAccessed, setLastAccessed] = useState();
    const [publishDate, setPublishDate] = useState();
    const [authors, setAuthors] = useState([]);
    const [courses, setCourses] = useState([]);
    const [tags, setTags] = useState([]);
    const [locationType, setLocationType] = useState("page");

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [permissions, setPermissions] = useState({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const urlRegex = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/.*)?$/i;
    const accessedRegex = /^\d{4}-\d{2}-\d{2}$/;
    const publishRegex = /^\d{4}-\d{2}-\d{2}$/;

    const availableCourses = useStore((state) => state.courses);
    const user = useStore((state) => state.user);

    const removeModal = useModals((state) => state.removeModal);
    const addModal = useModals((state) => state.addModal);
    const addAlert = useAlerts((state) => state.addAlert);

    const canDelete = source && source.createdBy === user._id;

    useEffect(() => {
        if (!source) {
            setLastAccessed(new Date().toISOString().split("T")[0]);
            return;
        }

        if (source.title) setTitle(source.title);
        if (source.authors) setAuthors([...source.authors]);
        if (source.tags) setTags([...source.tags]);
        if (source.medium) setMedium(source.medium);
        if (source.url) setUrl(source.url);
        if (source.publishedAt) setPublishDate(htmlDate(source.publishedAt));
        if (source.lastAccessed) setLastAccessed(htmlDate(source.lastAccessed));
        if (source.locationType) setLocationType(source.locationType);
        if (source.courses) {
            setCourses(
                source.courses.map((courseId) =>
                    availableCourses.find((x) => x._id === courseId),
                ),
            );
        }
        if (source.permissions)
            setPermissions(serializeOne(source.permissions));
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        if (loading) return;

        let valid = true;

        if (title.length < MIN.title) {
            valid = false;
            setErrors((prev) => ({
                ...prev,
                title: `Title must be at least ${MIN.title} characters`,
            }));
        } else if (title.length > MAX.title) {
            valid = false;
            setErrors((prev) => ({
                ...prev,
                title: `Title must be at most ${MAX.title} characters`,
            }));
        }

        if (medium === "website" && !urlRegex.test(url)) {
            valid = false;
            setErrors((prev) => ({ ...prev, url: "Invalid URL" }));
        }

        if (!accessedRegex.test(lastAccessed)) {
            valid = false;
            setErrors((prev) => ({
                ...prev,
                lastAccessed: "Invalid Date",
            }));
        }

        if (publishDate && !publishRegex.test(publishDate)) {
            valid = false;
            setErrors((prev) => ({
                ...prev,
                publishDate: "Invalid Date",
            }));
        }

        if (!valid) return;

        function formatDate(htmlDate) {
            if (!htmlDate) return undefined;
            const ymd = htmlDate.split("-");
            return new Date(ymd[0], ymd[1] - 1, ymd[2]);
        }

        const sourcePayload = {
            title: title.trim(),
            medium,
            url,
            publishDate: formatDate(publishDate),
            lastAccessed: formatDate(lastAccessed),
            authors,
            courses: courses.map((course) => course._id),
            tags,
            locationType,
        };

        sourcePayload.permissions = buildPermissions(permissions);
        if (source && source._id) {
            sourcePayload._id = source._id;
        }

        setLoading(true);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASEPATH ?? ""}/api/source`,
            {
                method: source && source._id ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(sourcePayload),
            },
        );

        setLoading(false);

        if (response.status === 200) {
            addAlert({
                success: true,
                message: "Source updated successfully",
            });
        } else if (response.status === 201) {
            addAlert({
                success: true,
                message: "Source added successfully",
            });

            setTitle("");
            setUrl("");
            setMedium("article");
            setLastAccessed(new Date().toISOString().split("T")[0]);
            setPublishDate("");
            setAuthors([]);
            setCourses([]);
            setTags([]);
            setLocationType("page");
            setPermissions({});
            setErrors({});
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

    const mediumChoices = [
        { value: "article", label: "Article" },
        { value: "book", label: "Book" },
        { value: "website", label: "Website" },
        { value: "video", label: "Video" },
        { value: "podcast", label: "Podcast" },
    ];

    const locations = [
        { label: "Page", value: "page" },
        {
            label: "ID Reference on Website",
            value: "id reference",
        },
        {
            label: "Section Header in Document",
            value: "section",
        },
        {
            label: "Timestamp",
            value: "timestamp",
        },
    ];

    return (
        <form className={styles.form}>
            <Input
                label="Title"
                value={title}
                maxLength={MAX.title}
                description="The title of the source"
                autoComplete="off"
                required
                error={errors.title}
                onChange={(val) => {
                    setTitle(val);
                    setErrors((prev) => ({ ...prev, title: "" }));
                }}
            />

            <Input
                required
                readOnly
                type="select"
                label="Medium"
                error={errors.medium}
                description="The medium of the source"
                choices={mediumChoices.map((x) => x.label)}
                value={mediumChoices.find((x) => x.value === medium).label}
                onChange={(val) => {
                    setMedium(mediumChoices.find((x) => x.label === val).value);
                    setErrors((prev) => ({ ...prev, medium: "" }));
                }}
            />

            <Input
                description="The URL of the source"
                autoComplete="off"
                required={medium === "website"}
                label={"URL of Source"}
                value={url}
                error={errors.url}
                minLength={8}
                onChange={(val) => {
                    setUrl(val);
                    setErrors((prev) => ({ ...prev, url: "" }));
                }}
            />

            <Input
                type="date"
                label="Publication Date"
                value={publishDate}
                description="The date the source was published"
                error={errors.publishDate}
                onChange={(val) => {
                    setPublishDate(val);
                    setErrors((prev) => ({ ...prev, publishDate: "" }));
                }}
            />

            <Input
                type="date"
                label="Last Accessed"
                value={lastAccessed}
                description="The date you last accessed the source"
                error={errors.lastAccessed}
                onChange={(val) => {
                    setLastAccessed(val);
                    setErrors((prev) => ({ ...prev, lastAccessed: "" }));
                }}
            />

            <Input
                label="Authors"
                choices={authors.map((author) => author.username)}
                value={authors}
                maxLength={MAX.name}
                maxValues={5}
                description="People who contributed to the source"
                onChange={(val) => setAuthors(val)}
                removeItem={(val) => {
                    if (authors.length - 1 <= 100) {
                        setErrors((prev) => ({
                            ...prev,
                            hints: "",
                        }));
                    }
                    setAuthors((prev) => prev.filter((x) => x !== val));
                }}
            />

            <Input
                label="Add to a course"
                choices={availableCourses.map((course) => course.name)}
                value={courses.map((course) => course.name)}
                description="The course this source is used in"
                onChange={(val) => setCourses(val)}
                removeItem={(val) => {
                    if (courses.length - 1 <= 100) {
                        setErrors((prev) => ({
                            ...prev,
                            courses: "",
                        }));
                    }
                    setCourses((prev) => prev.filter((x) => x !== val));
                }}
            />

            <Input
                readOnly
                type="select"
                label="Location Type Default"
                choices={locations.map((x) => x.label)}
                description="When you cite this source, what would you use to identify a specific location in this source, such as a page number for a book, id tag in a webpage, or a section heading in a document?"
                value={locations.find((x) => x.value === locationType).label}
                onChange={(val) => setLocationType(val)}
            />

            <div className={styles.permissions}>
                <PermissionsDisplay
                    permissions={permissions}
                    canEdit={!source || (user && source.createdBy === user.id)}
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
                        error={""}
                    />
                )}
            </div>

            <button onClick={handleSubmit} className="button submit">
                {loading ? <Spinner /> : "Submit Source"}
            </button>

            {canDelete && (
                <DeletePopup resourceType="source" resourceId={source._id} />
            )}
        </form>
    );
}
