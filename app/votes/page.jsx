import { useUser } from "@/lib/auth";
import { cookies } from "next/headers";
import BallotModel from "../api/models/Ballot";
import styles from "./votes.module.css";

export default async function VotesPage() {
    const user = await useUser({ token: cookies().get("token")?.value });
    if (!user) return;

    const ballots = await BallotModel.find().populate("voter");
    const voters = [];
    const motions = [];
    const rows = [];
    ballots.forEach((b) => {
        if (
            !b.motion ||
            b.motion === "What shall the name of our company be?" ||
            /Joseph Roper/.test(b.motion)
        )
            return;
        if (!voters.includes(b.voter.username)) {
            voters.push(b.voter.username);
        }
        if (!motions.includes(b.motion)) {
            motions.push(b.motion);
        }
        let row = rows.find((r) => r.motion === b.motion);
        if (!row) {
            row = {
                motion: b.motion,
                voters: {},
            };
            rows.push(row);
        }
        row.voters[b.voter.username] = b.firstChoice;
    });

    return (
        <main>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th></th>
                        {voters.map((m, index) => (
                            <th key={m + index}>{m}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, index) => (
                        <tr key={r.motion.split(" ").join("_") + index}>
                            <th>{r.motion}</th>
                            {voters.map((v, idx) => {
                                if (!v) return;
                                const voter = r.voters[v];
                                const key =
                                    v.split(" ").join("").slice(0, 10) +
                                    r.motion.split(" ").join("_").slice(0, 10) +
                                    index +
                                    idx;
                                if (voter == undefined) {
                                    return <td key={key}></td>;
                                }

                                return <td key={key}>{r.voters[v]}</td>;
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}
