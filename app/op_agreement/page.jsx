import styles from "../ballot/ballot.module.css";
import { Ballot } from "../components/Ballot/Ballot";
import BallotModel from "../api/models/Ballot";
import { useUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { serializeOne } from "@/lib/db";
import { BallotProgress } from "../ballot/ballotProgress";
import decisions from "./decisions";

export default async function OpAgreementPage() {
    const user = await useUser({ token: cookies().get("token")?.value });
    const motions = [];
    const votes = [];

    const questionsPromises = decisions.map(async (point) => {
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
            <BallotProgress motions={motions} ballots={votes} />

            {questions.map((point, index) => (
                <section key={index}>
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
        </main>
    );
}
