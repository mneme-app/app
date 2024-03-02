"use client";

import { useEffect, useRef, useState } from "react";
import { useModals } from "@/store/store";
import styles from "./Modals.module.css";
import { Input } from "@client";

export function Modals() {
    const modals = useModals((state) => state.modals);

    useEffect(() => {
        if (modals.length === 0) {
            document.documentElement.style.overflow = "auto";
        } else {
            document.documentElement.style.overflow = "hidden";
        }
    }, [modals]);

    if (modals.length === 0) return null;

    return (
        <div className={styles.container} data-find="modals">
            {modals.map((modal, index) => (
                <Modal
                    key={modal.id}
                    modal={modal}
                    index={index}
                    length={modals.length}
                />
            ))}
        </div>
    );
}

export function Modal({ modal, index, length }) {
    const [closing, setClosing] = useState(false);
    const [password, setPassword] = useState("");

    const [reportTitle, setReportTitle] = useState("");
    const [reportDescription, setReportDescription] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [reportUrl, setReportUrl] = useState(
        typeof window !== "undefined" ? window.location.href : "",
    );

    const removeModal = useModals((state) => state.removeModal);
    const closeButton = useRef(null);
    const cancelButton = useRef(null);
    const saveButton = useRef(null);
    const parentRef = useRef(null);

    useEffect(() => {
        const active = document.activeElement;
        if (active) active.blur();

        function handleKeyDown(e) {
            if (e.key === "Tab") {
                if (e.shiftKey) {
                    if (document.activeElement === closeButton.current) {
                        e.preventDefault();
                        saveButton.current.focus();
                    }
                } else if (!document.activeElement) {
                    e.preventDefault();
                    closeButton.current.focus();
                }
            } else if (e.key === "Escape") {
                close();
            } else if (e.key === "Enter") {
                if (
                    document.activeElement !== closeButton.current &&
                    document.activeElement !== cancelButton.current
                ) {
                    onSave();
                }
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    function close() {
        setClosing(true);
        setTimeout(() => {
            removeModal(modal.id);
        }, 200);
    }

    function onSave() {
        if (modal.onSave) {
            if (modal.content === "Confirm Password") {
                modal.onSave(password);
            } else if (modal.content === "Report a bug") {
                if (reportDescription.length < 10) {
                    return setDescriptionError(
                        "Description must be at least 10 characters long.",
                    );
                }

                modal.onSave({
                    title: reportTitle,
                    description: reportDescription,
                    url: reportUrl,
                });
            } else {
                modal.onSave();
            }
        }
        close();
    }

    // https://stackoverflow.com/questions/57514856/
    // how-can-i-prevent-triggering-an-on-click-event-when-the-actual-mouse-click-didn

    let stopEvent = false;
    let clickedOnChild = false;

    return (
        <div
            ref={parentRef}
            className={styles.wrapper}
            onClick={(e) => {
                if (stopEvent) return;
                else stopEvent = false;
                if (e.target === parentRef.current) {
                    close();
                }
                stopEvent = false;
            }}
            onMouseUp={() => {
                if (clickedOnChild) {
                    clickedOnChild = false;
                    stopEvent = true;
                } else {
                    stopEvent = false;
                }
            }}
            style={{
                backgroundColor: index === 0 ? "rgba(0, 0, 0, 0.5)" : "",
                animation:
                    index === 0
                        ? closing
                            ? `${styles.fadeOut} 0.25s ease`
                            : `${styles.fadeIn} 0.2s ease`
                        : "",
            }}
        >
            <div
                aria-modal="true"
                className={styles.modal}
                onMouseDown={() => {
                    clickedOnChild = true;
                    stopEvent = true;
                }}
                onMouseUp={(e) => {
                    e.stopPropagation();
                    clickedOnChild = false;
                    stopEvent = true;
                }}
                style={{
                    animationName:
                        closing || index < length - 1
                            ? `${styles.fadeOut}, ${styles.popOut}`
                            : "",
                }}
            >
                <header>
                    <h2>{modal.title || "Modal Title"}</h2>

                    <button ref={closeButton} onClick={() => close()}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
                            <path d="M18 6l-12 12" />
                            <path d="M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                <div className={styles.content}>
                    {modal.content === "Confirm Password" ? (
                        <div>
                            <p style={{ marginBottom: "24px" }}>
                                Changing your username requires you to confirm
                                your password.
                            </p>

                            <Input
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(val) => setPassword(val)}
                            />
                        </div>
                    ) : modal.content === "Report a bug" ? (
                        <div>
                            <p style={{ marginBottom: "24px" }}>
                                Please describe the bug you encountered below.
                                If you can, please include steps to reproduce
                                the bug.
                            </p>

                            <Input
                                autoFocus
                                label="Title"
                                value={reportTitle}
                                maxLength={128}
                                onChange={(val) => setReportTitle(val)}
                                placeholder="Website crashes when I click on a button."
                            />

                            <Input
                                big
                                required
                                type="textarea"
                                label="Description"
                                value={reportDescription}
                                maxLength={4096}
                                onChange={(val) => {
                                    setReportDescription(val);
                                    setDescriptionError("");
                                }}
                                error={descriptionError}
                                placeholder="The website crashes when I click on the button."
                            />

                            <Input
                                label="URL"
                                value={reportUrl}
                                maxLength={256}
                                onChange={(val) => setReportUrl(val)}
                            />
                        </div>
                    ) : (
                        modal.content
                    )}
                </div>

                <footer>
                    <button
                        ref={cancelButton}
                        className="button transparent"
                        onClick={() => close()}
                    >
                        {modal.buttonTexts ? modal.buttonTexts[0] : "Cancel"}
                    </button>

                    <button
                        ref={saveButton}
                        className={`button ${
                            modal.isActionDangerous ? "red" : ""
                        }`}
                        onClick={() => onSave()}
                        onKeyDown={(e) => {
                            if (e.key === "Tab" && !e.shiftKey) {
                                e.preventDefault();
                                closeButton.current.focus();
                            }
                        }}
                    >
                        {modal.buttonTexts ? modal.buttonTexts[1] : "Save"}
                    </button>
                </footer>
            </div>
        </div>
    );
}
