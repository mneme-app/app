"use client";

import styles from "./Select.module.css";
import { useEffect } from "react";

export function Select({
    listChosen,
    listChoices,
    listProperty,
    listSetter,
    createNew,
    disabled,
    setSelectState,
}) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && setSelectState) {
                setSelectState(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const clickEvent = (choice) => {
        if (!listChosen.find((x) => (x ? x._id === choice._id : false))) {
            listSetter([...listChosen, choice]);
        } else {
            listSetter(listChosen.filter((x) => x._id !== choice._id));
        }
    };

    if (disabled) return;

    return (
        <div
            aria-modal="true"
            className={`${styles.picker} thinScroller`}
            onClick={(e) => e.stopPropagation()}
        >
            <div
                role="listbox"
                aria-multiselectable="true"
                aria-orientation="vertical"
            >
                {createNew != undefined && createNew}

                {listChoices &&
                    listChoices.map((choice, index) => {
                        if (!choice) return;
                        const isChosen =
                            listChosen.find((x) => {
                                if (!x) return false;
                                return x._id === choice._id;
                            }) != undefined;

                        let prop;
                        if (Array.isArray(listProperty)) {
                            prop = listProperty.find((p) => choice[p]);
                            if (!prop) prop = "_id";
                        } else {
                            prop = listProperty;
                        }

                        return (
                            <div
                                key={choice._id}
                                tabIndex={0}
                                role="option"
                                aria-selected={isChosen}
                                aria-setsize={listChoices.length}
                                aria-posinset={index + 1}
                                className={styles.item}
                                onClick={() => clickEvent(choice)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        clickEvent(choice);
                                    }
                                }}
                            >
                                <span title={choice[prop]}>{choice[prop]}</span>

                                <div
                                    role="checkbox"
                                    aria-checked={isChosen}
                                    className={styles.checkbox}
                                >
                                    {isChosen && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M5 12l5 5l10 -10" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                {(!listChoices || listChoices.length === 0) && (
                    <div
                        aria-labelledby="emptyList"
                        className={styles.item + " " + styles.nothing}
                    >
                        No choices available
                    </div>
                )}
            </div>
        </div>
    );
}
