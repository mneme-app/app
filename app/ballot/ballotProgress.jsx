"use client";

import { useEffect, useState } from "react";
import { useBallots } from "@/store/store";
import styles from "./ballot.module.css";

export function BallotProgress({ questions, motions, ballots }) {
    const [hasScrolled, setHasScrolled] = useState(false);

    const addAllBallots = useBallots((state) => state.addAllBallots);
    const votes = useBallots((state) => state.ballots);

    useEffect(() => {
        addAllBallots(ballots);
        handleScroll();

        function handleScroll() {
            if (window.scrollY > 200) {
                setHasScrolled(true);
            } else {
                setHasScrolled(false);
            }
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        const link = document.querySelector(`a[href="#${id}"]`);
                        link.classList.add(styles.active);
                    } else {
                        const id = entry.target.id;
                        const link = document.querySelector(`a[href="#${id}"]`);
                        link.classList.remove(styles.active);
                    }
                });
            },
            {
                rootMargin: "0px",
                threshold: 0.01,
            },
        );

        document.querySelectorAll(`.${styles.ballot}`).forEach((section) => {
            observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <aside className={styles.progress}>
                <div>
                    <svg
                        className={styles.svg}
                        width="56"
                        height="56"
                        viewBox="0 0 100 100"
                    >
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="var(--background-4)"
                            strokeWidth="5"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="var(--accent-1)"
                            strokeWidth="5"
                            pathLength="100"
                            strokeDasharray="100"
                            strokeDashoffset="var(--offset)"
                            style={{
                                "--offset":
                                    100 - (votes.length / motions.length) * 100,
                            }}
                        />

                        <text
                            x="50"
                            y="50"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="20"
                            fill="var(--foreground-3)"
                            transform="rotate(90, 50, 50)"
                        >
                            {votes.length}/{motions.length}
                        </text>
                    </svg>

                    <ol className={styles.categories}>
                        {questions.map((c, i) => (
                            <li key={i}>
                                <a href={`#${c.heading}`}>
                                    <span>
                                        {
                                            c.ballots.filter((b) => {
                                                return votes
                                                    .map((v) => v.motion)
                                                    .includes(b.motion);
                                            }).length
                                        }
                                        /{c.ballots.length}
                                    </span>

                                    {c.heading}
                                </a>
                            </li>
                        ))}
                    </ol>
                </div>
            </aside>

            {hasScrolled && (
                <button
                    className={styles.returnTop}
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                    >
                        <path d="M12 5l0 14" />
                        <path d="M18 11l-6 -6" />
                        <path d="M6 11l6 -6" />
                    </svg>
                </button>
            )}
        </>
    );
}
