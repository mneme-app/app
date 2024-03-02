"use client";

import { PermissionsDisplay } from "../Form/PermissionsDisplay";
import { DeletePopup } from "../DeletePopup/DeletePopup";
import { Input, Spinner, BlankableInput } from "@client";
import { buildPermissions } from "@/lib/permissions";
import { useStore, useAlerts } from "@/store/store";
import { useEffect, useState } from "react";
import styles from "./QuizInput.module.css";
import { MIN, MAX } from "@/lib/constants";
import { serializeOne } from "@/lib/db";

export function QuizInput({ quiz }) {
    const [type, setType] = useState("prompt-response");
    const [prompt, setPrompt] = useState("");
    const [responses, setResponses] = useState([]);
    const [choices, setChoices] = useState([]);

    const [hints, setHints] = useState([]);
    const [tags, setTags] = useState([]);

    const [sources, setSources] = useState([]);
    const [courses, setCourses] = useState([]);
    const [notes, setNotes] = useState([]);

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [permissions, setPermissions] = useState({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const availableSources = useStore((state) => state.sources);
    const availableCourses = useStore((state) => state.courses);
    const availableNotes = useStore((state) => state.notes);
    const addAlert = useAlerts((state) => state.addAlert);

    const user = useStore((state) => state.user);
    const canDelete = quiz && quiz.createdBy === user.id;

    useEffect(() => {
        if (!quiz) return;
        if (quiz.type) setType(quiz.type);
        if (quiz.prompt) setPrompt(quiz.prompt);
        if (quiz.choices) setChoices([...quiz.choices]);
        if (quiz.correctResponses) setResponses([...quiz.correctResponses]);
        if (quiz.hints) setHints([...quiz.hints]);

        if (quiz.notes) {
            setNotes(
                quiz.notes.map((noteId) =>
                    availableNotes.find((x) => x._id === noteId),
                ),
            );
        }

        if (quiz.courses) {
            setCourses(
                quiz.courses.map((courseId) =>
                    availableCourses.find((x) => x._id === courseId),
                ),
            );
        }

        if (quiz.tags && quiz.tags.length > 0) setTags([...quiz.tags]);
        if (quiz.permissions) {
            setPermissions(serializeOne(quiz.permissions));
        }
    }, []);

    useEffect(() => {
        if (
            quiz?.sources &&
            !(quiz?.sourceReferences && quiz?.sourceReferences?.length)
        ) {
            setSources(
                quiz.sources.map((srcId) => {
                    let source = availableSources.find((x) => x._id === srcId);
                    if (!source) {
                        source = {
                            title: "unavailable",
                            _id: srcId,
                            locationTypeDefault: "page",
                        };
                    }
                    return source;
                }),
            );
        }
    }, [availableSources]);

    useEffect(() => {
        if (sources.length > 0 || notes.length > 0) {
            setErrors((prev) => ({ ...prev, sources: "", notes: "" }));
        }
    }, [sources, notes]);

    useEffect(() => {
        if (type === "multiple-choice") {
            responses?.forEach((response) => {
                if (!choices.includes(response)) {
                    setChoices((prev) => [...prev, response]);
                }
            });
        }
    }, [type, prompt, choices, responses]);

    const types = [
        { label: "Prompt/Response", value: "prompt-response" },
        { label: "Multiple Choice", value: "multiple-choice" },
        { label: "Fill in the Blank", value: "fill-in-the-blank" },
        { label: "Ordered List Answer", value: "ordered-list-answer" },
        { label: "Unordered List Answer", value: "unordered-list-answer" },
        { label: "Verbatim", value: "verbatim" },
    ];

    async function handleSubmit(e) {
        e.preventDefault();
        if (loading) return;

        let valid = true;

        if (!types.find((x) => x.value === type)) {
            valid = false;
            setErrors((prev) => ({ ...prev, type: "Invalid type selected" }));
        }

        if (prompt.length < MIN.prompt) {
            valid = false;
            setErrors((prev) => ({
                ...prev,
                prompt: `Prompt must be at least ${MIN.prompt} characters`,
            }));
        } else if (prompt.length > MAX.prompt) {
            valid = false;
            setErrors((prev) => ({
                ...prev,
                prompt: `Prompt must be at most ${MAX.prompt} characters`,
            }));
        }

        if (responses.length === 0) {
            valid = false;
            setErrors((prev) => ({
                ...prev,
                responses: "At least one response is needed",
            }));
        }

        if (sources.length === 0 && notes.length === 0) {
            valid = false;
            const message = "At least one note or source needs to be picked";
            setErrors((prev) => ({
                ...prev,
                sources: message,
                notes: message,
            }));
        }

        if (type === "multiple-choice" && choices.length === 0) {
            valid = false;
            setErrors((prev) => ({
                ...prev,
                choices: "At least one choice is needed",
            }));
        }

        if (hints.length > 100) {
            valid = false;
            setErrors((prev) => ({
                ...prev,
                hints: "A maximum of 100 hints is allowed",
            }));
        }

        if (tags.length > 100) {
            valid = false;
            setErrors((prev) => ({
                ...prev,
                tags: "A maximum of 100 tags is allowed",
            }));
        }

        if (!valid) return;

        const quizPayload = {
            type: type,
            prompt: prompt,
            choices: choices,
            correctResponses: responses,
            hints: hints,
            sources: sources.map((src) => src.id),
            notes: notes.map((nt) => nt.id),
            courses: courses.map((course) => course.id),
            tags,
        };

        if (quiz && quiz.id) {
            quizPayload.id = quiz.id;
        }

        quizPayload.permissions = buildPermissions(permissions);

        setLoading(true);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASEPATH ?? ""}/api/quiz`,
            {
                method: quiz?.id ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(quizPayload),
            },
        ).then((res) => res.json());

        setLoading(false);

        if (response.success) {
            setType(types[0].value);
            setPrompt("");
            setResponses([]);
            setChoices([]);
            setSources([]);
            setNotes([]);
            setHints([]);
            setTags([]);
        }

        addAlert({
            success: response.success,
            message: response.message ?? "Something went wrong",
        });
    }

    return (
        <form className={styles.form}>
            <Input
                readOnly
                required
                label="Type"
                type="select"
                error={errors.type}
                description="Type of quiz question"
                choices={types.map((x) => x.label)}
                value={types.find((x) => x.value === type).label}
                onChange={(val) => {
                    setType(types.find((x) => x.label === val).value);
                }}
            />

            {type === "fill-in-the-blank" ? (
                <BlankableInput
                    prompt={prompt}
                    setPrompt={setPrompt}
                    promptError={errors.prompt}
                    setPromptError={(err) =>
                        setErrors((prev) => ({ ...prev, prompt: err }))
                    }
                    responsesError={errors.responses}
                    setResponsesError={(err) =>
                        setErrors((prev) => ({ ...prev, responses: err }))
                    }
                    responses={responses}
                    setResponses={setResponses}
                />
            ) : (
                <Input
                    label="Prompt"
                    type={type === "verbatim" ? "textarea" : "text"}
                    description="Question prompt. Can be a question or statement"
                    required
                    value={prompt}
                    maxLength={MAX.prompt}
                    error={errors.prompt}
                    onChange={(val) => {
                        setPrompt(val);
                        setErrors((prev) => ({ ...prev, prompt: "" }));
                    }}
                />
            )}

            {type === "multiple-choice" && (
                <Input
                    label="Choices"
                    description={"Add a new choice. Press enter to add"}
                    value={choices}
                    maxLength={MAX.response}
                    required
                    error={errors.choices}
                    onChange={(val) => {
                        setChoices(val);
                        setErrors((prev) => ({ ...prev, choices: "" }));
                    }}
                    removeItem={(val) => {
                        setChoices((prev) => prev.filter((x) => x !== val));
                    }}
                    placeholder="Possible choice"
                />
            )}

            {type !== "fill-in-the-blank" && (
                <Input
                    type={
                        type === "verbatim"
                            ? "textarea"
                            : type === "multiple-choice"
                              ? "select"
                              : "text"
                    }
                    label="Answers"
                    description={
                        type === "multiple-choice"
                            ? "Pick your answers"
                            : "Add a new answer. Press enter to add"
                    }
                    choices={type === "multiple-choice" ? choices : undefined}
                    value={responses}
                    maxLength={
                        type !== "verbatim" ? MAX.response : MAX.description
                    }
                    required
                    error={errors.responses}
                    onChange={(val) => {
                        if (type !== "verbatim") {
                            if (responses.includes(val)) {
                                setResponses((prev) =>
                                    prev.filter((x) => x !== val),
                                );
                            } else {
                                setResponses((prev) => [...prev, val]);
                            }
                            return;
                        }

                        setResponses(val);
                        setErrors((prev) => ({ ...prev, responses: "" }));
                    }}
                    removeItem={(val) => {
                        if (type !== "verbatim") {
                            setResponses((prev) =>
                                prev.filter((x) => x !== val),
                            );
                            return;
                        }

                        setResponses((prev) => prev.filter((x) => x !== val));
                    }}
                    placeholder="Possible answer"
                />
            )}

            <Input
                type="select"
                choices={availableSources.map((x) => x.title)}
                label="Related Sources"
                description="Pick sources that are related to this quiz"
                required
                value={sources.map((x) => x.title)}
                error={errors.sources}
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
                placeholder="Pick related sources"
            />

            <Input
                required
                type="select"
                label="Related Notes"
                choices={availableNotes.map((x) => x.title)}
                description="Pick notes that are related to this quiz"
                error={errors.notes}
                value={notes.map((x) => x.title)}
                onChange={(val) => {
                    const note = availableNotes.find((x) => x.title === val);

                    if (note) {
                        if (notes.includes(note)) {
                            setNotes((prev) => prev.filter((x) => x !== note));
                        } else {
                            setNotes((prev) => [...prev, note]);
                        }
                    }
                }}
                removeItem={(val) => {
                    const note = availableNotes.find((x) => x.title === val);
                    if (note) {
                        setNotes((prev) => prev.filter((x) => x !== note));
                    }
                }}
                placeholder="Pick related notes"
            />

            <Input
                type="select"
                choices={availableCourses.map((x) => x.name)}
                label="Related Courses"
                description="Pick courses that are related to this quiz"
                value={courses.map((x) => x.name)}
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
                placeholder="Pick related courses"
            />

            {(type === "multiple-choice" || type === "fill-in-the-blank") && (
                <div />
            )}

            <div className={styles.permissions}>
                <PermissionsDisplay
                    permissions={permissions}
                    canEdit={!quiz || (user && quiz.createdBy === user.id)}
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
                    <>
                        <Input
                            label="Hints"
                            description="A hint that may help the user remember the correct answer"
                            value={hints}
                            onChange={(val) => setHints(val)}
                            removeItem={(val) => {
                                if (hints.length - 1 <= 100) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        hints: "",
                                    }));
                                }
                                setHints((prev) =>
                                    prev.filter((x) => x !== val),
                                );
                            }}
                            placeholder="Hint"
                            maxValues={100}
                            error={errors.hints}
                        />

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
                                setTags((prev) =>
                                    prev.filter((x) => x !== val),
                                );
                            }}
                            placeholder="Tag"
                            maxValues={100}
                            error={errors.tags}
                        />
                    </>
                )}
            </div>

            <button
                onClick={handleSubmit}
                className={`button submit ${styles.submit}`}
            >
                {loading ? <Spinner /> : "Submit Quiz"}
            </button>

            {canDelete && (
                <DeletePopup resourceType="quiz" resourceId={quiz?.id} />
            )}
        </form>
    );
}
