"use client";

import { useAlerts, useModals } from "@/store/store";
import { useEffect, useState } from "react";
import { Input, UserInput } from "@client";
import styles from "./Ballot.module.css";
import { useBallots } from "@/store/store";

export function Ballot({
    motion,
    choices,
    ballot,
    options = {
        numberChoices: 1,
        voteAgainst: false,
        canAmend: true,
    },
}) {
    const [firstChoice, setFirstChoice] = useState("");
    const [secondChoice, setSecondChoice] = useState("");
    const [thirdChoice, setThirdChoice] = useState("");
    const [voteAgainst, setVoteAgainst] = useState("");
    const [amendment, setAmendment] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const addBallot = useBallots((state) => state.addBallot);
    const editBallot = useBallots((state) => state.editBallot);
    const addAlert = useAlerts((state) => state.addAlert);
    const addModal = useModals((state) => state.addModal);
    const removeModal = useModals((state) => state.removeModal);

    useEffect(() => {
        if (!ballot) return;

        setSubmitted(true);
        if (ballot.firstChoice) {
            setFirstChoice(ballot.firstChoice);
        }
        if (ballot.secondChoice) {
            setSecondChoice(ballot.secondChoice);
        }
        if (ballot.thirdChoice) {
            setThirdChoice(ballot.thirdChoice);
        }
        if (ballot.voteAgainst) {
            setVoteAgainst(ballot.voteAgainst);
        }
        if (ballot.amendment) {
            setAmendment(ballot.amendment);
        }
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!firstChoice) {
            addAlert({
                success: false,
                message: "Vote is required in First Choice",
            });
            return;
        }

        const ballotPayload = {
            motion,
            firstChoice,
            secondChoice,
            thirdChoice,
            voteAgainst,
        };
        if (ballot && ballot._id) {
            ballotPayload._id = ballot._id;
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASEPATH ?? ""}/api/ballot`,
            {
                method: ballot && ballot._id ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(ballotPayload),
            },
        );

        if (response.status === 201) {
            addAlert({
                success: true,
                message: "Ballot received!",
            });
            addBallot(ballotPayload);
            setSubmitted(true);
        } else if (response.status === 200) {
            addAlert({
                success: true,
                message: "Ballot edited succesfully.",
            });
            editBallot(ballotPayload);
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
        <div className={styles.main}>
            <h3 style={{ whiteSpace: "pre-wrap" }}>{motion}</h3>
            {!submitted && (
                <p
                    style={{
                        backgroundColor: "red",
                        padding: "1rem",
                        color: "white",
                        fontWeight: "bolder",
                        borderRadius: "20px",
                    }}
                >
                    Awaiting Your Vote
                </p>
            )}
            <section>
                <h4>Your Choices Are:</h4>
                <ol>
                    {choices.map((choice) => (
                        <li key={choice}>{choice}</li>
                    ))}
                </ol>
            </section>

            <section className={styles.inputs}>
                <h4>Make Your Selections</h4>

                <Input
                    required
                    label={
                        options.numberChoices > 1 ? "First Choice" : "Choice"
                    }
                    type="select"
                    choices={choices.filter(
                        (x) =>
                            x !== secondChoice &&
                            x !== thirdChoice &&
                            x !== voteAgainst,
                    )}
                    value={firstChoice}
                    onChange={(val) => setFirstChoice(val)}
                />

                {options.numberChoices > 1 && (
                    <Input
                        label="Second Choice"
                        type="datalist"
                        choices={choices.filter(
                            (x) =>
                                x !== firstChoice &&
                                x !== thirdChoice &&
                                x !== voteAgainst,
                        )}
                        value={secondChoice}
                        onChange={(val) => setSecondChoice(val)}
                    />
                )}

                {options.numberChoices > 2 && (
                    <Input
                        label="Third Choice"
                        type="datalist"
                        choices={choices.filter(
                            (x) =>
                                x !== secondChoice &&
                                x !== firstChoice &&
                                x !== voteAgainst,
                        )}
                        value={thirdChoice}
                        onChange={(val) => setThirdChoice(val)}
                    />
                )}

                {options.voteAgainst && (
                    <Input
                        label="Choice You Are Against"
                        type="datalist"
                        choices={choices.filter(
                            (x) =>
                                x !== secondChoice &&
                                x !== firstChoice &&
                                x !== thirdChoice,
                        )}
                        value={voteAgainst}
                        onChange={(val) => setVoteAgainst(val)}
                    />
                )}

                {options.canAmend && (
                    <Input
                        label="Type the fully amended motion"
                        type="textarea"
                        value={amendment}
                        onChange={(val) => setAmendment(val)}
                    />
                )}
            </section>

            <section className={styles.selections}>
                <table>
                    <thead>
                        <tr>
                            <th colSpan={2}>
                                <h4>Your Selections</h4>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                {options.numberChoices === 1
                                    ? "Choice"
                                    : "First Choice"}
                            </td>
                            <td>{firstChoice ? `${firstChoice}` : "none"}</td>
                        </tr>

                        {options.numberChoices > 1 && (
                            <tr>
                                <td>Second Choice</td>
                                <td>{secondChoice ? secondChoice : "none"}</td>
                            </tr>
                        )}

                        {options.numberChoices > 2 && (
                            <tr>
                                <td>Third Choice</td>
                                <td>{thirdChoice ? thirdChoice : "none"}</td>
                            </tr>
                        )}

                        {options.voteAgainst && (
                            <tr>
                                <td>Vote Against</td>
                                <td>{voteAgainst ? voteAgainst : "none"}</td>
                            </tr>
                        )}

                        {options.canAmend && (
                            <tr>
                                <th>Amendment you are proposing</th>
                            </tr>
                        )}
                        {options.canAmend && (
                            <tr>
                                <td>{amendment ? amendment : "none"}</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <button className="button submit" onClick={handleSubmit}>
                    {submitted ? "Edit" : "Submit"} Vote
                </button>
            </section>
        </div>
    );
}
