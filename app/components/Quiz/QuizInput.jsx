"use client";

import { PermissionsDisplay } from "../Form/PermissionsDisplay";
import { useStore, useModals, useAlerts } from "@/store/store";
import { DeletePopup } from "../DeletePopup/DeletePopup";
import { buildPermissions } from "@/lib/permissions";
import { useEffect, useState, useRef } from "react";
import SubmitErrors from "@/lib/SubmitErrors";
import styles from "./QuizInput.module.css";
import { serializeOne } from "@/lib/db";
import { MAX } from "@/lib/constants";
import {
    Input,
    Label,
    ListItem,
    InputPopup,
    Spinner,
    ListAdd,
    BlankableInput,
    UserInput,
} from "@client";

export function QuizInput({ quiz }) {
    const [type, setType] = useState("prompt-response");
    const [typeError, setTypeError] = useState("");

    const [prompt, setPrompt] = useState("");
    const [promptError, setPromptError] = useState("");

    const [responses, setResponses] = useState([]);
    const [newResponse, setNewResponse] = useState("");
    const [responsesError, setResponsesError] = useState("");

    const [choices, setChoices] = useState([]);
    const [newChoice, setNewChoice] = useState("");
    const [choicesError, setChoicesError] = useState("");

    const [hints, setHints] = useState([]);
    const [newHint, setNewHint] = useState([]);

    const [courses, setCourses] = useState([]);

    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState("");

    const [permissions, setPermissions] = useState({});

    const [sources, setSources] = useState([]);
    const [sourcesError, setSourcesError] = useState("");
    const [notes, setNotes] = useState([]);
    const [notesError, setNotesError] = useState("");

    const [isSourceSelectOpen, setIsSourceSelectOpen] = useState(false);
    const [isNoteSelectOpen, setIsNoteSelectOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const availableSources = useStore((state) => state.sources);
    const availableCourses = useStore((state) => state.courses);
    const availableNotes = useStore((state) => state.notes);

    const user = useStore((state) => state.user);
    const canDelete = quiz && user && quiz.createdBy === user._id;

    const addModal = useModals((state) => state.addModal);
    const removeModal = useModals((state) => state.removeModal);
    const addAlert = useAlerts((state) => state.addAlert);

    useEffect(() => {
        if (!quiz) return;
        if (quiz.type) setType(quiz.type);
        if (quiz.prompt) setPrompt(quiz.prompt);
        if (quiz.choices) {
            setChoices([...quiz.choices]);
        }
        if (quiz.correctResponses) {
            setResponses([...quiz.correctResponses]);
        }
        if (quiz.hints) {
            setHints([...quiz.hints]);
        }
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
        if (!quiz) return;
        if (
            quiz.sources &&
            !(quiz.sourceReferences && quiz.sourceReferences.length)
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

    const addSourceRef = useRef(null);
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (
                isSourceSelectOpen &&
                !addSourceRef.current?.contains(e.target)
            ) {
                setIsSourceSelectOpen(false);
            }
        };

        document.addEventListener("click", handleOutsideClick);
    }, [isSourceSelectOpen]);

    const addNoteRef = useRef(null);
    useEffect(() => {
        if (!addNoteRef.current) return;

        const handleOutsideClick = (e) => {
            if (isNoteSelectOpen && !addNoteRef.current.contains(e.target)) {
                setIsNoteSelectOpen(false);
            }
        };

        document.addEventListener("click", handleOutsideClick);
    }, [isNoteSelectOpen]);

    useEffect(() => {
        if (sources.length > 0 || notes.length > 0) {
            setSourcesError("");
            setNotesError("");
        }
    }, [sources, notes]);

    useEffect(() => {
        if (type === "multiple-choice") {
            responses.forEach((response) => {
                if (!choices.includes(response)) {
                    setChoices((prev) => [...prev, response]);
                }
            });
        }
    }, [type, choices, responses, prompt]);

    const types = [
        { label: "Prompt/Response", value: "prompt-response" },
        { label: "Multiple Choice", value: "multiple-choice" },
        { label: "Fill in the Blank", value: "fill-in-the-blank" },
        { label: "Ordered List Answer", value: "ordered-list-answer" },
        { label: "Unordered List Answer", value: "unordered-list-answer" },
        { label: "Verbatim", value: "verbatim" },
    ];

    function handleAddHint(e) {
        e.preventDefault();
        if (!newHint || hints.includes(newHint)) return;
        setHints([...hints, newHint]);
        setNewHint("");
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (loading) return;
        const submitErrors = new SubmitErrors();

        if (!types.find((x) => x.value === type)) {
            submitErrors.addMessage("Invalid type selected", setTypeError);
        }

        if (prompt === "") {
            submitErrors.addMessage("Prompt cannot be empty", setPromptError);
        }

        if (responses.length === 0) {
            submitErrors.addMessage(
                "Need at least one answer",
                setResponsesError,
            );
        }

        if (sources.length === 0 && notes.length === 0) {
            submitErrors.addMessage("Need one note or source", [
                setSourcesError,
                setNotesError,
            ]);
        }

        if (type === "multiple-choice" && choices.length === 0) {
            submitErrors.addMessage(
                "Need at least one choice",
                setChoicesError,
            );
        }

        if (submitErrors.errors.length > 0) {
            addAlert({
                success: false,
                message: submitErrors.displayErrors(),
            });
        }
        if (submitErrors.cannotSend) {
            return;
        }

        const quizPayload = {
            type: type,
            prompt: prompt.trim(),
            choices: choices,
            correctResponses: responses,
            hints: hints,
            sources: sources.map((src) => src._id),
            notes: notes.map((nt) => nt._id),
            courses: courses.map((course) => course._id),
            tags,
        };
        if (quiz && quiz._id) {
            quizPayload._id = quiz._id;
        }

        quizPayload.permissions = buildPermissions(permissions);

        setLoading(true);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASEPATH ?? ""}/api/quiz`,
            {
                method: quiz && quiz._id ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(quizPayload),
            },
        );

        setLoading(false);

        if (response.status === 201) {
            setTypeError("");

            setPrompt("");
            setPromptError("");

            setResponses([]);
            setNewResponse("");
            setResponsesError("");

            setChoices([]);
            setNewChoice("");
            setChoicesError("");

            setSources([]);
            setNotes([]);
            setSourcesError("");
            setNotesError("");

            addAlert({
                success: true,
                message: "Quiz created successfully",
            });
        } else if (response.status === 200) {
            addAlert({
                success: true,
                message: "Quiz updated successfully",
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

    function handleAddResponse(e) {
        e.preventDefault();
        const answer = newResponse.trim();

        if (!answer || responses.includes(answer)) {
            return;
        }

        if (type === "verbatim") {
            setResponses(newResponse.split(" "));
            setResponsesError("");
            return;
        }

        setResponses([...responses, answer]);
        setNewResponse("");
        setResponsesError("");
    }

    function handleAddChoice(e) {
        e.preventDefault();

        const choice = newChoice.trim();
        if (!choice || choices.includes(choice)) {
            return;
        }

        setChoices([...choices, choice]);
        setNewChoice("");
        setChoicesError("");
    }

    return (
        <form className={styles.form}>
            <Input
                type={"select"}
                label="Type"
                choices={types}
                description={"Type of quiz question"}
                required={true}
                value={type}
                error={typeError}
                onChange={(e) => setType(e.target.value)}
            />

            {type === "fill-in-the-blank" ? (
                <BlankableInput
                    prompt={prompt}
                    setPrompt={setPrompt}
                    promptError={promptError}
                    setPromptError={setPromptError}
                    responses={responses}
                    setResponses={setResponses}
                />
            ) : (
                <Input
                    label={"Prompt"}
                    type={type === "verbatim" ? "textarea" : "text"}
                    description={
                        "Question prompt. Can be a question or statement"
                    }
                    required={true}
                    value={prompt}
                    maxLength={MAX.prompt}
                    error={promptError}
                    onChange={(e) => {
                        setPrompt(e.target.value);
                        setPromptError("");
                    }}
                />
            )}

            {type === "multiple-choice" && (
                <div className={styles.multipleChoice}>
                    <Input
                        label="Add new choice"
                        description={"Add a new choice. Press enter to add"}
                        value={newChoice}
                        maxLength={MAX.response}
                        required={choices.length < 1}
                        onSubmit={handleAddChoice}
                        error={choicesError}
                        onChange={(e) => setNewChoice(e.target.value)}
                        action="Add new choice"
                        onActionTrigger={handleAddChoice}
                    />

                    <div style={{ marginTop: "24px" }}>
                        <Label label="Choices" />
                        <ul className="chipList">
                            {choices.map((res, index) => (
                                <ListItem
                                    key={index}
                                    item={res}
                                    actionType={"delete"}
                                    action={() => {
                                        setResponses((prev) =>
                                            prev.filter((x) => x !== res),
                                        );
                                        setChoices((prev) =>
                                            prev.filter((x) => x !== res),
                                        );
                                    }}
                                />
                            ))}

                            {choices.length === 0 && (
                                <ListItem item={"No choices added yet"} />
                            )}
                        </ul>
                    </div>
                </div>
            )}

            {type !== "fill-in-the-blank" && (
                <div className={styles.answer}>
                    <Input
                        type={type === "verbatim" ? "textarea" : "text"}
                        choices={choices.map((x) => ({ label: x, value: x }))}
                        label="Add new answer"
                        description={"Add a new answer. Press enter to add"}
                        value={newResponse}
                        maxLength={
                            type !== "verbatim" ? MAX.response : MAX.description
                        }
                        required={responses.length === 0}
                        onSubmit={handleAddResponse}
                        error={responsesError}
                        onChange={(e) => {
                            setNewResponse(e.target.value);
                            if (type === "multiple-choice") {
                                setNewChoice(e.target.value);
                            }
                        }}
                        action={type !== "multiple-choice" && "Add new answer"}
                        onActionTrigger={(e) => {
                            handleAddResponse(e);
                            if (type === "multiple-choice") {
                                handleAddChoice(e);
                            }
                        }}
                    />

                    <div style={{ marginTop: "24px" }}>
                        <Label label="Answers" />

                        <ol className="chipList">
                            {responses.map((res, index) => (
                                <ListItem
                                    key={index}
                                    item={res}
                                    actionType={"delete"}
                                    action={() =>
                                        setResponses((prev) =>
                                            prev.filter((x) => x !== res),
                                        )
                                    }
                                />
                            ))}

                            {responses.length === 0 && (
                                <ListItem item={"No answers added yet"} />
                            )}
                        </ol>
                    </div>
                </div>
            )}

            <div className={styles.links}>
                <div className={styles.sources}>
                    <Label
                        required={true}
                        error={sourcesError}
                        label="Related Sources"
                    />

                    <ListAdd
                        item="Add a source"
                        listChoices={availableSources}
                        listChosen={sources}
                        listProperty={"title"}
                        listSetter={setSources}
                        createNew={<InputPopup type="source" />}
                        type="datalist"
                        messageIfNone="No sources added"
                    />
                </div>

                <div className={styles.notes}>
                    <Label
                        required={true}
                        error={notesError}
                        label="Related Notes"
                    />

                    <ListAdd
                        item="Add a note"
                        listChoices={availableNotes}
                        listChosen={notes}
                        listProperty={["title", "text"]}
                        listSetter={setNotes}
                        createNew={<InputPopup type="note" />}
                        type="datalist"
                        messageIfNone="No notes added"
                    />
                </div>
            </div>

            <div className={styles.courses}>
                <Label required={false} label="Courses" />

                <ListAdd
                    item="Add to a course"
                    listChoices={availableCourses}
                    listChosen={courses}
                    listProperty={"name"}
                    listSetter={setCourses}
                    type="datalist"
                    messageIfNone="Not added to any course"
                />
            </div>

            <div className={styles.permissions}>
                <PermissionsDisplay permissions={permissions} />

                {(!quiz || (user && quiz.createdBy === user._id)) && (
                    <InputPopup
                        type="permissions"
                        resource={permissions}
                        setter={setPermissions}
                    />
                )}
            </div>

            <div className={styles.advanced}>
                <h4>Advanced</h4>
                <div className={styles.hints}>
                    <Label label="Hints" />
                    <Input
                        label={"Add Hint"}
                        value={newHint}
                        maxLength={MAX.response}
                        description="A hint that may help the user remember the correct answer"
                        onChange={(e) => setNewHint(e.target.value)}
                        action="Add hint"
                        onActionTrigger={handleAddHint}
                    />

<ul className="chipList">
                        {hints.length === 0 && (
                            <ListItem item="No hints added" />
                        )}

                        {hints.map((hint) => (
                            <ListItem
                                key={hint}
                                item={hint}
                                action={() => {
                                    setHints(hints.filter((h) => h !== hint));
                                }}
                                actionType={"delete"}
                            />
                        ))}
                    </ul>
                </div>
                

                <div className={styles.tags}>
                <Label label="Tabs" />
                    {/* <Label label="Tags" />

                    <ul className="chipList">
                        {tags.length === 0 && <ListItem item="No tags added" />}

                        {tags.map((tag) => (
                            <ListItem
                                key={tag}
                                item={tag}
                                action={() => {
                                    setTags(tags.filter((t) => t !== tag));
                                }}
                                actionType={"delete"}
                            />
                        ))}
                    </ul> */}

                    <Input
                        type="datalist"
                        // choices={availableTags}
                        choices={[]}
                        label={"Add Tag"}
                        value={newTag}
                        maxLength={MAX.tag}
                        description="A word or phrase that could be used to search for this note"
                        autoComplete="off"
                        onChange={(e) => setNewTag(e.target.value)}
                        action="Add tag"
                        // onActionTrigger={handleAddTag}
                    />

                    {/* <div style={{ marginTop: "24px" }}>
                        <Label label="Tags" />

                        <ul className="chipList">
                            {tags.length === 0 && (
                                <ListItem item="No tags added" />
                            )}

                            {tags.map((tag) => (
                                <ListItem
                                    key={tag}
                                    item={tag}
                                    action={() => {
                                        setTags(tags.filter((t) => t !== tag));
                                    }}
                                    actionType={"delete"}
                                />
                            ))}
                        </ul>
                    </div> */}
                </div>
            </div>

            <button
                onClick={handleSubmit}
                className={`button submit ${styles.submit}`}
            >
                {loading ? <Spinner /> : "Submit Quiz"}
            </button>

            {canDelete && (
                <DeletePopup resourceType="quiz" resourceId={quiz._id} />
            )}
        </form>
    );
}
