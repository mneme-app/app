"use client";

import { useBallots } from "@/store/store";
import { useEffect } from "react";

export function BallotProgress({ motions, ballots }) {
    const addAllBallots = useBallots((state) => state.addAllBallots);
    const votes = useBallots((state) => state.ballots);

    useEffect(() => {
        addAllBallots(ballots);
    }, []);

    return (
        <div
            style={{
                padding: "1rem",
                position: "fixed",
                right: "1rem",
                backgroundColor: "black",
                color: "white",
                fontWeight: "bolder",
                borderRadius: "20px",
                zIndex: 1,
            }}
        >
            Progress: {votes.length}/{motions.length}
        </div>
    );
}
