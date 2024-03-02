"use client";

import { useStore, useModals, useAlerts } from "@/store/store";
import { useEffect, useState } from "react";
import { serializeOne } from "@/lib/db";
import { MAX } from "@/lib/constants";
import SubmitErrors from "@/lib/SubmitErrors";
import {
    Input,
    InputPopup,
    Label,
    Spinner,
    UserInput,
    DeletePopup,
    ListAdd,
} from "@client";
import styles from "./CourseInput.module.css";
import { PermissionsDisplay } from "../Form/PermissionsDisplay";

export function CourseInput({ course }) {
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [description, setDescription] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [permissions, setPermissions] = useState("");

    const [parentCourses, setParentCourses] = useState([]);
    const [prerequisites, setPrerequisites] = useState([]);
    const [sources, setSources] = useState([]);
    const [addAllFromSources, setAddAllFromSources] = useState(false);
    const [notes, setNotes] = useState([]);
    const [addAllFromNotes, setAddAllFromNotes] = useState(false);
    const [quizzes, setQuizzes] = useState([]);

    const [loading, setLoading] = useState(false);

    const availableCourses = useStore((state) => state.courses);
    const availableSources = useStore((state) => state.sources);
    const availableNotes = useStore((state) => state.notes);
    const availableQuizzes = useStore((state) => state.quizzes);
    const user = useStore((state) => state.user);
    const canDelete = course && user && course.createdBy === user._id;
    const addModal = useModals((state) => state.addModal);
    const removeModal = useModals((state) => state.removeModal);
    const addAlert = useAlerts((state) => state.addAlert);

    useEffect(() => {
        if (!course) return;
        setName(course.name);
        setDescription(course.description);

        setParentCourses(
            course.parentCourses.map((catId) =>
                availableCourses.find((x) => x._id === catId),
            ),
        );

        setPrerequisites(
            course.prerequisites.map((catId) =>
                availableCourses.find((x) => x._id === catId),
            ),
        );

        if (course.permissions)
            setPermissions(serializeOne(course.permissions));
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        if (loading) return;
        const submitErrors = new SubmitErrors();

        if (name.length === 0) {
            submitErrors.addMessage(
                `Course name must be between 1 and ${MAX.name} characters`,
                setNameError,
            );
        }
        if (description.length === 0) {
            submitErrors.addMessage(
                `Course description must be between 1 and ${MAX.description} characters`,
                setDescriptionError,
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

        const crsPayload = {
            name,
            description,
            parentCourses: parentCourses.map((course) => course._id),
            prerequisites: prerequisites.map((course) => ({
                requiredAverageLevel: 1,
                course: course._id,
            })),
            sources: sources.map((source) => source._id),
            notes: notes.map((note) => note._id),
            quizzes: quizzes.map((quiz) => quiz._id),
            addAllFromSources,
            addAllFromNotes,
            permissions,
        };
        crsPayload.permissions = permissions;
        if (course && course._id) {
            // this will change to implement PATCH in /[id]/route.js
            crsPayload._id = course._id;
        }

        setLoading(true);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASEPATH ?? ""}/api/course`,
            {
                method: course && course._id ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(crsPayload),
            },
        );

        setLoading(false);

        if (response.status === 201) {
            setName("");
            setDescription("");

            addAlert({
                success: true,
                message: "Course added successfully",
            });
        } else if (response.status === 200) {
            addAlert({
                success: true,
                message: "Course edited successfully",
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
            addAlert({
                success: false,
                message: "Something went wrong",
            });
        }
    }

    return (
        <div className={styles.form}>
            <Input
                required
                onChange={(val) => setName(val)}
                value={name}
                error={nameError}
                label={"Name"}
                maxLength={MAX.title}
            />

            <Input
                type="textarea"
                required
                onChange={(val) => setDescription(val)}
                value={description}
                error={descriptionError}
                label={"Description"}
                maxLength={MAX.description}
            />

            <div>
                <Label required={false} label="Parent Courses" />

                <ListAdd
                    item="Add parent course"
                    listChoices={availableCourses}
                    listChosen={parentCourses}
                    listProperty={"name"}
                    listSetter={setParentCourses}
                    createNew={<InputPopup type="course" />}
                    type="datalist"
                    messageIfNone="No parent course"
                />
            </div>

            <div>
                <Label
                    required={false}
                    label="Prerequisite courses (to be studied before this course)"
                />

                <ListAdd
                    item="Add prerequisite course"
                    listChoices={availableCourses}
                    listChosen={prerequisites}
                    listProperty={"name"}
                    listSetter={setPrerequisites}
                    createNew={<InputPopup type="course" />}
                    type="datalist"
                    messageIfNone="No prerequisites"
                />
            </div>

            <div className={styles.links}>
                <div className={styles.sources}>
                    <Label
                        required={false}
                        label="Sources Used by This Course"
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

                    <Input
                        label="Add all notes and quizzes linked to these sources"
                        type="checkbox"
                        value={addAllFromSources}
                        onChange={() =>
                            setAddAllFromSources(!addAllFromSources)
                        }
                    />
                </div>

                <div className={styles.notes}>
                    <Label label="Notes Used by This Course" />

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

                    <Input
                        label="Add all quizzes linked to these notes"
                        type="checkbox"
                        value={addAllFromNotes}
                        onChange={() => setAddAllFromNotes(!addAllFromNotes)}
                    />
                </div>

                <div className={styles.quizzes}>
                    <Label label="Quizzes Used by This Course" />

                    <ListAdd
                        item="Add a quiz"
                        listChoices={availableQuizzes}
                        listChosen={quizzes}
                        listProperty={"prompt"}
                        listSetter={setQuizzes}
                        createNew={<InputPopup type="quiz" />}
                        type="datalist"
                        messageIfNone="No quizzes added"
                    />
                </div>
            </div>

            <div className={styles.permissions}>
                <PermissionsDisplay permissions={permissions} />

                {(!course || !user || course.createdBy === user._id) && (
                    <InputPopup
                        type="permissions"
                        resource={permissions}
                        setter={setPermissions}
                    />
                )}
            </div>

            <button
                onClick={handleSubmit}
                className={`button submit ${styles.submit}`}
            >
                {loading ? <Spinner /> : "Submit Course"}
            </button>

            {canDelete && (
                <DeletePopup resourceType="course" resourceId={course.id} />
            )}
        </div>
    );
}
