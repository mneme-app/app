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
                            <h2>{point.heading}</h2>

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
