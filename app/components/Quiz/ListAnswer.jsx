"use client";

import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import whichIndexesIncorrect from "@/lib/whichIndexesIncorrect";
import { correctConfetti } from "@/lib/correctConfetti";
import { useModals, useAlerts } from "@/store/store";
import { Card, Input, UserInput } from "@client";
import { useEffect, useState } from "react";

export function ListAnswer({
    canClientCheck,
    quiz,
    isOrdered,
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

    const addModal = useModals((state) => state.addModal);
    const removeModal = useModals((state) => state.removeModal);
    const addAlert = useAlerts((state) => state.addAlert);

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
        if (canClientCheck) {
            setIncorrectIndexes(
                whichIndexesIncorrect(
                    userResponse,
                    quiz.correctResponses,
                    isOrdered,
                ),
            );
            setResponseStatus("complete");
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
        color = showAnswer ? "var(--success)" : undefined;
    } else if (responseStatus === "complete") {
        label = incorrectIndexes.length ? "Incorrect" : "Correct";
        color = incorrectIndexes.length ? "var(--error)" : "var(--success)";
        icon = incorrectIndexes.length ? faXmark : faCheck;
    } else {
        label = "Check Answer";
    }

    return (
        <Card
            title={quiz.prompt}
            buttons={[
                {
                    label,
                    icon,
                    color,
                    onClick: isFlashcard ? handleShowAnswer : handleCheckAnswer,
                },
            ]}
        >
            <ul className="flexColumn">
                {userResponse.map((ans, index) => {
                    let isCorrect = "";
                    if (incorrectIndexes.includes(index)) {
                        isCorrect = false;
                    } else if (responseStatus === "complete") {
                        isCorrect = true;
                    }
                    return (
                        <li key={index}>
                            <Input
                                type="text"
                                isCorrect={isCorrect}
                                aria-labelledby="prompt"
                                id={"ans_" + index}
                                value={
                                    isFlashcard && showAnswer
                                        ? quiz.correctResponses[index]
                                        : ans
                                }
                                onChange={(val) => handleChange(index, val)}
                                outlineColor={
                                    isFlashcard && showAnswer
                                        ? "var(--accent-tertiary-outline)"
                                        : undefined
                                }
                            ></Input>
                        </li>
                    );
                })}
            </ul>

            {/* <button
                onClick={isFlashcard ? handleShowAnswer : handleCheckAnswer}
                className="button"
                style={{ backgroundColor: color }}
            >
                {isFlashcard && showAnswer
                    ? "Return to Your Answers"
                    : "Show Correct Answers"}
                {!isFlashcard && "Check Answer"}
            </button> */}

            {responseCorrect && responseStatus === "complete" && (
                <div>Correct!</div>
            )}

            {!responseCorrect &&
                responseStatus === "complete" &&
                quiz.hints?.length > 0 &&
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
