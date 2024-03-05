"use client";

import { NoteInput, QuizInput, SourceInput } from "@client";
import { useMemo, useRef, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import styles from "./Create.module.css";
import "keen-slider/keen-slider.min.css";

export function Create() {
    const [loaded, setLoaded] = useState(false);
    const [current, setCurrent] = useState(0);

    const [sliderRef, instanceRef] = useKeenSlider(
        {
            initial: 0,
            slides: {
                spacing: 40,
            },
            slideChanged(slider) {
                setCurrent(slider.track.details.rel);
            },
            created() {
                setLoaded(true);
            },
            drag: false,
        },
        [],
    );

    const categories = [
        {
            name: "Note",
            component: <NoteInput />,
            ref: useRef(null),
        },
        {
            name: "Quizz",
            component: <QuizInput />,
            ref: useRef(null),
        },
        {
            name: "Source",
            component: <SourceInput />,
            ref: useRef(null),
        },
        {
            name: "Flashcard",
            component: <NoteInput />,
            ref: useRef(null),
        },
    ];

    const props = useMemo(() => {
        const element = categories[current].ref.current;

        if (!element || !loaded) return;

        const { offsetLeft, offsetWidth } = element;
        return {
            width: offsetWidth,
            left: offsetLeft,
        };
    }, [current, loaded]);

    return (
        <main className={styles.main}>
            <div>
                <ul className={styles.nav}>
                    {categories.map((c, i) => (
                        <li key={c.name} ref={categories[i].ref}>
                            <button
                                onClick={() => {
                                    instanceRef.current?.moveToIdx(i);
                                }}
                                className={`${styles.category} ${
                                    current === i ? styles.current : ""
                                }`}
                            >
                                {c.name}
                            </button>
                        </li>
                    ))}

                    <div className={styles.active} style={{ ...props }} />
                </ul>

                <section className={styles.section}>
                    <div
                        ref={sliderRef}
                        className="keen-slider"
                        style={{ opacity: loaded ? 1 : 0 }}
                    >
                        {categories.map((c) => (
                            <div
                                key={c.name}
                                className={`keen-slider__slide ${styles.content}`}
                            >
                                <h1>Create {c.name}</h1>

                                {c.component}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
