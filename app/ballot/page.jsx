import { Ballot } from "../components/Ballot/Ballot";
import { BallotProgress } from "./ballotProgress";
import BallotModel from "../api/models/Ballot";
import questionnaire from "./questionnaire";
import styles from "./ballot.module.css";
import { serializeOne } from "@/lib/db";
import { cookies } from "next/headers";
import { useUser } from "@/lib/auth";

export default async function BallotPage() {
    const user = await useUser({ token: cookies().get("token")?.value });
    const motions = [];
    const votes = [];

    const questionsPromises = questionnaire.map(async (point) => {
        const ballotsPromises = point.questions.map(async (q) => {
            const ballot = user
                ? await BallotModel.findOne({
                      voter: user._id,
                      motion: q.motion,
                  })
                : undefined;

            motions.push(q.motion);
            if (user && ballot != undefined) {
                votes.push(serializeOne(ballot));
            }

            return {
                motion: q.motion,
                choices: q.choices,
                ballot: serializeOne(ballot),
            };
        });

        const ballots = await Promise.all(ballotsPromises);

        return {
            ballots,
            heading: point.heading,
        };
    });

    const questions = await Promise.all(questionsPromises);

    return (
        <main className={styles.main}>
            <div>
                <BallotProgress
                    questions={questions}
                    motions={motions}
                    ballots={votes}
                />

                <div className={styles.ballots}>
                    {questions.map((point, index) => (
                        <section
                            key={index}
                            className={styles.ballot}
                            id={point.heading}
                        >
                            <h2>
                                <a href={`#${point.heading}`}>
                                    {point.heading}{" "}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                    >
                                        <path d="M9 15l6 -6" />
                                        <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
                                        <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
                                    </svg>
                                </a>
                            </h2>

                            <ol>
                                {point.ballots.map((ballot, index) => (
                                    <li key={index}>
                                        <Ballot
                                            motion={ballot.motion}
                                            choices={ballot.choices}
                                            ballot={ballot.ballot}
                                        />
                                    </li>
                                ))}
                            </ol>
                        </section>
                    ))}
                </div>

                <div />
            </div>
        </main>
    );
}
