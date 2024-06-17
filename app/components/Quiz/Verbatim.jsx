"use client";

import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import whichIndexesIncorrect from "@/lib/whichIndexesIncorrect";
import { useStore, useModals, useAlerts } from "@/store/store";
import { correctConfetti } from "@/lib/correctConfetti";
import { Input, Card, UserInput } from "../client";
import { useState, useEffect } from "react";

export function Verbatim({
    canClientCheck,
    quiz,
    handleWhenCorrect,
    isFlashcard,
}) {
    const [userResponse, setUserResponse] = useState(
        [...Array(quiz.correctResponses.length)].map(() => ""),
    );
    const [responseStatus, setResponseStatus] = useState("empty");
    const [responseCorrect, setResponseCorrect] = useState(false);
    const [failures, setFailures] = useState(0);
    const [incorrectIndexes, setIncorrectIndexes] = useState([]);

    const [showAnswer, setShowAnswer] = useState(false);

    const user = useStore((state) => state.user);
    const userQuizzes = user ? user.quizzes : undefined;
    let level = 0;

    const addModal = useModals((state) => state.addModal);
    const removeModal = useModals((state) => state.removeModal);
    const addAlert = useAlerts((state) => state.addAlert);

    useEffect(() => {
        if (!quiz || !quiz._id || !userQuizzes) return;
        const userQuiz = userQuizzes.find(
            (q) => q._id.toString() === quiz._id.toString(),
        );
        if (userQuiz) level = userQuiz.level;
    }, []);

    useEffect(() => {
        if (responseStatus === "empty") return;
        if (incorrectIndexes.length === 0) {
            setResponseCorrect(true);
            setFailures(0);
            correctConfetti();
            handleWhenCorrect();
        } else {
            setFailures(failures + 1);
        }
    }, [incorrectIndexes]);

    function handleChange(index, value) {
        setResponseStatus("incomplete");
        let array = [...userResponse];
        array[index] = value;
        setUserResponse(array);
    }

    async function handleCheckAnswer() {
        setResponseStatus("complete");
        if (canClientCheck) {
            setIncorrectIndexes(
                whichIndexesIncorrect(userResponse, quiz.correctResponses),
            );
        } else {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEPATH ?? ""}/api/quiz/${
                    quiz._id
                }`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userResponse }),
                },
            );

            if (response.status === 401) {
                addAlert({
                    success: false,
                    message: "You have been signed out. Please sign in again.",
                });
                addModal({
                    title: "Sign back in",
                    content: <UserInput onSubmit={removeModal} />,
                });
            }

            const resJson = await response.json();
            const message = resJson.message;
            setIncorrectIndexes(message.incorrectIndexes);
            setResponseStatus("complete");
        }
    }

    function handleShowAnswer() {
        if (!isFlashcard) return;
        setShowAnswer((prev) => !prev);
    }

    let label, color, icon;
    if (isFlashcard) {
        label = showAnswer ? "Return to Your Answers" : "Show Correct Answers";
        color = showAnswer ? "var(--accent-3)" : undefined;
    } else if (responseStatus === "complete") {
        label = incorrectIndexes.length ? "Incorrect" : "Correct";
        color = incorrectIndexes.length ? "var(--accent-2)" : "var(--accent-3)";
        icon = incorrectIndexes.length ? faXmark : faCheck;
    } else {
        label = "Check Answer";
    }

    return (
        <Card
            title={"Verbatim"}
            description={quiz.prompt}
            buttons={[
                {
                    label,
                    icon,
                    color,
                    onClick: isFlashcard ? handleShowAnswer : handleCheckAnswer,
                },
            ]}
        >
            <div>
                {userResponse.map((word, index) => {
                    let isCorrect;
                    if (incorrectIndexes.includes(index)) {
                        isCorrect = false;
                    } else if (responseStatus === "complete") {
                        isCorrect = true;
                    }

                    return (
                        <Input
                            key={`verbatim-${index}`}
                            id={`verbatim-${index}`}
                            inline
                            isCorrect={isCorrect}
                            value={
                                isFlashcard && showAnswer
                                    ? quiz.correctResponses[index]
                                    : word
                            }
                            onChange={(val) => {
                                handleChange(index, val);
                            }}
                            outlineColor={
                                responseStatus === "complete" &&
                                (incorrectIndexes.includes(index)
                                    ? "var(--accent-2)"
                                    : "var(--accent-3)")
                            }
                        />
                    );
                })}
            </div>

            {!responseCorrect &&
                responseStatus === "complete" &&
                quiz.hints &&
                quiz.hints.length > 0 &&
                failures > 2 && (
                    <div data-type="hints">
                        <p>You're having some trouble. Here are some hints:</p>
                        <ul>
                            {quiz.hints.map((hint, index) => {
                                return <li key={`hint_${index}`}>{hint}</li>;
                            })}
                        </ul>
                    </div>
                )}
        </Card>
    );
}
