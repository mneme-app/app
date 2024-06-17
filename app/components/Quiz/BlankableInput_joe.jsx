"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./QuizInput.module.css";
import { Input } from "@client";
import { MAX } from "@/lib/constants";

export default function BlankableInput({
    prompt,
    setPrompt,
    promptError,
    setPromptError,
    responses,
    setResponses,
}) {
    const [promptInput, setPromptInput] = useState("");
    const [promptWords, setPromptWords] = useState([]);
    const promptBank = useRef(null);

    useEffect(() => {
        let resIndex = 0;
        const promptArray = prompt
            .split(/(<blank\s*\/>)|\b/)
            .filter((x) => x !== undefined && x !== "")
            .map((x) => {
                if (/(<blank\s*\/>)/.test(x)) {
                    let newWord = responses[resIndex];
                    resIndex++;
                    if (resIndex === responses.length) {
                        resIndex = 0;
                    }
                    return {
                        word: newWord,
                        isBlank: true,
                    };
                } else if (/[\s.,!?;:"'<>\[\]{}()]+/.test(x)) {
                    return {
                        punctuation: x,
                    };
                } else {
                    return {
                        word: x,
                        isBlank: false,
                    };
                }
            });

        setPromptWords(promptArray);
        setPromptInput(
            promptArray.map((x) => x.punctuation ?? x.word).join(""),
        );
    }, []);

    function handleChangePrompt(e) {
        // setPrompt(e.target.value);
        setPromptInput(e.target.value);
        setPromptError("");
        const promptArray = e.target.value
            .split(/\b/)
            .filter((x) => x !== undefined && x !== "")
            .map((x) => {
                if (/[\s.,!?;:"'<>\[\]{}()]+/.test(x)) {
                    return {
                        punctuation: x,
                    };
                } else {
                    return {
                        word: x,
                    };
                }
            });

        let words = [...promptWords];
        promptArray.forEach((wordObj, index) => {
            if (
                wordObj.word &&
                words[index].word &&
                wordObj.word === words[index].word
            ) {
                return;
            }
            if (
                wordObj.punctuation &&
                words[index].punctuation &&
                wordObj.punctuation === words[index].punctuation
            ) {
                return;
            }
            if (wordObj.word && words[index].punctuation) {
                if (promptArray.length > words.length) {
                    words.splice(index, 0, {
                        word: wordObj.word,
                        isBlank: false,
                    });
                } else if (promptArray.length === words.length) {
                    console.log(
                        "change is not word. wut do we do???",
                        wordObj,
                        words[index],
                    );
                } else {
                    console.log("when do we delete?");
                }
            }
            if (wordObj.punctuation && words[index].word) {
                if (promptArray.length > words.length) {
                    words.splice(index, 0, {
                        punctuation: wordObj.punctuation,
                    });
                } else if (promptArray.length === words.length) {
                    console.log(
                        "change is not word. wut do we do???",
                        wordObj,
                        words[index],
                    );
                } else {
                    console.log("when do we delete?");
                }
            }
            if (wordObj.word !== words[index].word) {
                if (promptArray.length > words.length) {
                    words.splice(index, 0, {
                        word: wordObj.word,
                        isBlank: false,
                    });
                } else if (promptArray.length === words.length) {
                    words[index].word = wordObj.word;
                } else {
                    let discard = words.splice(index, 3, {
                        word: wordObj.word,
                        isBlank: false,
                    });
                }
            }
            if (wordObj.punctuation !== words[index].punctuation) {
                if (promptArray.length > words.length) {
                    words.splice(index, 0, {
                        punctuation: wordObj.punctuation,
                    });
                } else if (promptArray.length === words.length) {
                    words[index].punctuation = wordObj.punctuation;
                } else {
                    console.log("when do we delete?");
                }
            }
            // if (
            //     wordObj.word &&
            //     (!newPromptWords[index] ||
            //         !newPromptWords[index].word ||
            //         wordObj.word !== newPromptWords[index].word)
            // ) {
            //     if (newPromptWords.length === promptArray.length) {
            //         // if lengths same, change word to promptArray's
            //         console.log("just change word");
            //         newPromptWords[index].word = wordObj.word;
            //     }
            //     if (newPromptWords.length < promptArray.length) {
            //         // if fewer items in promptWords, add word from promptArray
            //         console.log(
            //             "add word",
            //             wordObj.word,
            //             newPromptWords.length,
            //             promptArray.length,
            //         );
            //         newPromptWords.splice(index, 0, {
            //             word: wordObj.word,
            //             isBlank: false,
            //         });
            //     }

            //     if (newPromptWords.length > promptArray.length) {
            //         // if more items in promptWords, delete word
            //         console.log(
            //             "delete word",
            //             newPromptWords.length,
            //             promptArray.length,
            //         );
            //         newPromptWords.splice(index, 1);
            //         if (newPromptWords[index].word === wordObj.word) {
            //             console.log("resolved");
            //         } else {
            //             console.log(
            //                 "uh oh",
            //                 newPromptWords.length,
            //                 promptArray.length,
            //             );
            //         }
            //     }
            // }
            // if (
            //     wordObj.punctuation &&
            //     (!newPromptWords[index] ||
            //         !newPromptWords[index].punctuation ||
            //         wordObj.punctuation !== newPromptWords[index].punctuation)
            // ) {
            //     if (newPromptWords.length === promptArray.length) {
            //         // if lengths same, change word to promptArray's
            //         console.log("just change punctuation");
            //         newPromptWords[index].punctuation = wordObj.punctuation;
            //     }
            //     if (newPromptWords.length < promptArray.length) {
            //         // if fewer items in promptWords, add word from promptArray
            //         console.log(
            //             "add punctuation",
            //             wordObj.punctuation,
            //             newPromptWords.length,
            //             promptArray.length,
            //         );
            //         newPromptWords.splice(index, 0, {
            //             word: wordObj.punctuation,
            //         });
            //     }

            //     if (newPromptWords.length > promptArray.length) {
            //         // if more items in promptWords, delete word
            //         console.log(
            //             "delete punctuation",
            //             newPromptWords.length,
            //             promptArray.length,
            //         );
            //         newPromptWords.splice(index, 1);
            //         if (
            //             newPromptWords[index].punctuation ===
            //             wordObj.punctuation
            //         ) {
            //             console.log("resolved");
            //         } else {
            //             console.log(
            //                 "uh oh",
            //                 newPromptWords.length,
            //                 promptArray.length,
            //             );
            //         }
            //     }
            // }
        });

        setPromptWords(words);
    }

    function handleChangeBlank() {
        const spans = promptBank.current.querySelectorAll("span");

        let promptArray = [];
        let responseArray = [];
        let words = [...promptWords];
        spans.forEach((x, index) => {
            let input = x.querySelector("input");
            if (input && input.checked) {
                promptArray.push("<blank />");
                words[index].isBlank = true;
                responseArray.push(x.getAttribute("data-word"));
                return;
            }
            let word = x.getAttribute("data-word");
            if (word) {
                promptArray.push(word);
                return;
            }
            promptArray.push(x.textContent);
        });
        setPrompt(promptArray.join(""));
        setPromptWords(words);
        setResponses(responseArray);
    }

    return (
        <div>
            <Input
                label={"Enter text that you wish to make blanks within"}
                description={"Question prompt. Can be a question or statement"}
                required={true}
                value={promptInput}
                maxLength={MAX.prompt}
                error={promptError}
                onChange={handleChangePrompt}
            />
            <div className={styles.blankBank} ref={promptBank}>
                <p>Click the words you would like to be blank.</p>
                {promptWords.map((x, index) => {
                    if (x.punctuation) {
                        return <span key={index}>{x.punctuation}</span>;
                    } else {
                        return (
                            <span key={index} data-word={x.word}>
                                <input
                                    type="checkbox"
                                    id={`${index}_${x.word}`}
                                    checked={x.isBlank}
                                    onChange={handleChangeBlank}
                                />
                                <label htmlFor={`${index}_${x.word}`}>
                                    {x.word}
                                </label>
                            </span>
                        );
                    }
                })}
            </div>
        </div>
    );
}
