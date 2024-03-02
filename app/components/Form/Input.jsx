"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import makeUniqueId from "@/lib/uniqueId";
import styles from "./Input.module.css";
import inputSize from "@/lib/inputSize";

export function Label({ required, label, htmlFor, checkbox }) {
    return (
        <div
            className={`${styles.labelContainer} ${checkbox && styles.normal}`}
        >
            <label htmlFor={htmlFor}>
                {label} {required && <span>*</span>}
            </label>
        </div>
    );
}

export function Input({
    type,
    pattern,
    description,
    autoComplete,
    choices,
    required,
    onChange,
    value,
    min,
    max,
    minLength,
    maxLength,
    error,
    label,
    onFocus,
    onBlur,
    readOnly,
    disabled,
    autoFocus,
    inline,
    placeholder,
    removeItem,
    big,
    maxValues,
}) {
    const [inputId, setInputId] = useState("");
    const [errorId, setErrorId] = useState("");

    const [showChoices, setShowChoices] = useState(false);
    const [search, setSearch] = useState("");

    const input = useRef(null);
    const container = useRef(null);
    const firstItem = useRef(null);
    const lastItem = useRef(null);

    useEffect(() => {
        if (!label) return;
        const id = `${label.split(" ").join("_")}-${makeUniqueId()}`;

        setInputId(id);
        setErrorId(`${id}-error`);
    }, []);

    useEffect(() => {
        function handleKeyDown(e) {
            if (!container.current || !firstItem.current || !lastItem.current) {
                return;
            }

            if (e.key === "Escape" && showChoices) {
                setShowChoices(false);
                const element = document.getElementById(inputId);
                if (element) element.focus();
            }

            if (e.key === "ArrowDown") {
                e.preventDefault();

                if (!container.current.contains(document.activeElement)) {
                    firstItem.current.focus();
                } else {
                    const currentFocused = document.activeElement;

                    if (currentFocused === lastItem.current) {
                        // firstItem.current.focus();
                        return;
                    }

                    let nextItem = currentFocused.nextSibling;
                    if (!nextItem) nextItem = nextItem.nextSibling;

                    if (nextItem) nextItem.focus();
                }
            }

            if (e.key === "ArrowUp") {
                e.preventDefault();

                if (!container.current.contains(document.activeElement)) {
                    lastItem.current.focus();
                } else {
                    const currentFocused = document.activeElement;

                    if (currentFocused === firstItem.current) {
                        // lastItem.current.focus();
                        return;
                    }

                    let prevItem = currentFocused.previousSibling;
                    if (!prevItem) prevItem = prevItem.previousSibling;

                    if (prevItem) prevItem.focus();
                }
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [showChoices, firstItem, lastItem, container, input]);

    useEffect(() => {
        if (!showChoices) return;

        function handleClick(e) {
            if (container.current && !container.current.contains(e.target)) {
                console.log("click");
                setShowChoices(false);
            }
        }

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [showChoices]);

    // Multiple is true if value is an array
    const multiple = Array.isArray(value);

    const filteredChoices = useMemo(() => {
        if (choices) {
            return choices.filter(
                (c) =>
                    c &&
                    c.toString().toLowerCase().includes(search.toLowerCase()),
            );
        }

        return [];
    }, [choices, search]);

    if (value === undefined) value = "";

    return (
        <div
            className={`
                ${styles.wrapper}
                ${inline ? styles.inline : ""}
                ${disabled ? styles.disabled : ""}
                ${type === "toggle" ? styles.toggle : ""}
                ${type === "select" ? styles.select : ""}
                ${big ? styles.big : ""}
                ${multiple ? styles.multiple : ""}
                ${readOnly ? styles.readonly : ""}
                ${showChoices ? styles.popupOpen : ""}
            `}
            onClick={() => {
                if (type === "toggle" && onChange) {
                    onChange();
                }
            }}
        >
            {label && (
                <div className={styles.label}>
                    <label htmlFor={inputId}>
                        {label} {required && <span>*</span>}
                    </label>
                </div>
            )}

            <div
                ref={input}
                className={`${styles.container} ${error ? styles.error : ""}`}
                onMouseDown={() => {
                    const element = document.getElementById(inputId);
                    if (element) element.focus();

                    console.log(element);

                    if (type === "select" && readOnly) {
                        setShowChoices(!showChoices);
                    }
                }}
            >
                {type === "select" && (
                    <div
                        className={styles.selectIcon}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            setShowChoices(!showChoices);
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 15 15"
                            width="18"
                            height="18"
                            fill="none"
                            className="base"
                        >
                            <path
                                d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                                className="base"
                            />
                        </svg>
                    </div>
                )}

                {multiple &&
                    value.map((v, index) => (
                        <div
                            key={v}
                            className={`${styles.value} ${
                                maxValues && index >= maxValues
                                    ? styles.overflow
                                    : ""
                            }`}
                        >
                            <span>{v}</span>

                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (removeItem) {
                                        removeItem(v);
                                    }
                                }}
                                onMouseUp={(e) => e.preventDefault()}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 15 15"
                                    width="14"
                                    height="16"
                                    fill="none"
                                    className="base"
                                >
                                    <path
                                        d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        className="base"
                                    />
                                </svg>
                            </button>
                        </div>
                    ))}

                {type === "textarea" ? (
                    <textarea
                        id={inputId}
                        disabled={disabled || false}
                        className="thinScroller"
                        autoCapitalize="none"
                        placeholder={placeholder || ""}
                        autoFocus={autoFocus || false}
                        autoComplete={autoComplete || "off"}
                        aria-describedby={description || ""}
                        aria-required={`${required || false}`}
                        aria-disabled={`${disabled || false}`}
                        aria-invalid={error ? "true" : "false"}
                        aria-errormessage={error ? errorId : ""}
                        onChange={(e) => onChange(e.target.value)}
                        value={value || ""}
                        required={required}
                        readOnly={readOnly}
                        minLength={minLength}
                        maxLength={maxLength}
                    />
                ) : type === "toggle" ? (
                    <div
                        className={styles.toggleContainer}
                        style={{
                            backgroundColor: value
                                ? "var(--accent-1)"
                                : "var(--background-4)",
                        }}
                    >
                        <svg
                            viewBox="0 0 28 20"
                            preserveAspectRatio="xMinYMid meet"
                            aria-hidden="true"
                            style={{ left: value ? "12px" : "-3px" }}
                            className="base"
                        >
                            <rect
                                className="base"
                                fill="white"
                                x="4"
                                y="0"
                                height="20"
                                width="20"
                                rx="10"
                            />

                            {value ? (
                                <svg
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    className="base"
                                >
                                    <path
                                        className="base"
                                        fill="var(--accent-1)"
                                        d="M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z"
                                    />
                                    <path
                                        className="base"
                                        fill="var(--accent-1)"
                                        d="M4.08643 11.0903L5.67742 9.49929L9.4485 13.2704L7.85751 14.8614L4.08643 11.0903Z"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    className="base"
                                >
                                    <path
                                        className="base"
                                        fill="rgba(128, 132, 142, 1)"
                                        d="M5.13231 6.72963L6.7233 5.13864L14.855 13.2704L13.264 14.8614L5.13231 6.72963Z"
                                    />
                                    <path
                                        className="base"
                                        fill="rgba(128, 132, 142, 1)"
                                        d="M13.2704 5.13864L14.8614 6.72963L6.72963 14.8614L5.13864 13.2704L13.2704 5.13864Z"
                                    />
                                </svg>
                            )}
                        </svg>

                        <input
                            type="checkbox"
                            id={inputId}
                            autoCapitalize="none"
                            autoFocus={autoFocus || false}
                            autoComplete={autoComplete || "off"}
                            aria-describedby={description || ""}
                            aria-required={required || false}
                            aria-disabled={disabled || false}
                            aria-invalid={error ? "true" : "false"}
                            aria-errormessage={error ? errorId : ""}
                            required={required}
                            disabled={disabled || false}
                            checked={value}
                        />
                    </div>
                ) : (
                    <input
                        min={min}
                        max={max}
                        id={inputId}
                        pattern={pattern}
                        required={required}
                        type={type || "text"}
                        autoCapitalize="none"
                        placeholder={placeholder || ""}
                        autoFocus={autoFocus || false}
                        autoComplete={autoComplete || "off"}
                        aria-describedby={description || ""}
                        aria-required={`${required || false}`}
                        aria-disabled={`${disabled || false}`}
                        aria-invalid={error ? "true" : "false"}
                        aria-errormessage={error ? errorId : ""}
                        size={inline ? inputSize(String(value)) : undefined}
                        onChange={(e) => {
                            if (type !== "select" && !multiple) {
                                onChange(e.target.value);
                            }

                            if ((type === "select" || multiple) && !readOnly) {
                                setSearch(e.target.value);
                                setShowChoices(true);
                            }
                        }}
                        value={
                            (type === "select" || multiple) && !readOnly
                                ? search
                                : value
                        }
                        readOnly={readOnly}
                        disabled={disabled || false}
                        minLength={minLength}
                        maxLength={maxLength}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") e.preventDefault();

                            if (
                                e.key === "Backspace" &&
                                !readOnly &&
                                multiple &&
                                search.length === 0 &&
                                value.length > 0
                            ) {
                                removeItem(value[value.length - 1]);
                            }

                            if (
                                e.key === "Enter" &&
                                type !== "select" &&
                                multiple &&
                                search.length > 0 &&
                                !value.includes(search)
                            ) {
                                e.preventDefault();
                                onChange([...value, search]);
                                setSearch("");
                            }

                            if (e.key === "Enter" && type === "select") {
                                setShowChoices(true);
                            }
                        }}
                        onBlur={(e) => {
                            if (onBlur) onBlur(e);

                            if (search && type === "select") {
                                setShowChoices(true);
                                setSearch("");
                            }
                        }}
                        onFocus={(e) => {
                            if (onFocus) onFocus(e);
                        }}
                    />
                )}

                <ul
                    ref={container}
                    aria-haspopup="listbox"
                    aria-expanded={`${showChoices}`}
                    aria-owns={inputId}
                    className={styles.choices}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseUp={(e) => e.preventDefault()}
                    style={{
                        display: type === "select" && showChoices ? "" : "none",
                    }}
                >
                    {filteredChoices.map((choice, index) => (
                        <li
                            role="option"
                            aria-selected={
                                type === "select" && multiple
                                    ? value.includes(choice)
                                    : value === choice
                            }
                            aria-disabled={disabled}
                            aria-label={choice}
                            aria-setsize={filteredChoices.length}
                            tabIndex={0}
                            key={choice + index}
                            ref={
                                index === 0
                                    ? firstItem
                                    : index === filteredChoices.length - 1
                                      ? lastItem
                                      : undefined
                            }
                            className={styles.choice}
                            onClick={(e) => {
                                e.preventDefault();
                                onChange(choice);
                                if (!multiple) {
                                    setShowChoices(false);
                                    const element =
                                        document.getElementById(inputId);
                                    if (element) element.focus();
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    onChange(choice);
                                    if (!multiple) {
                                        setShowChoices(false);
                                        const element =
                                            document.getElementById(inputId);
                                        if (element) element.focus();
                                    }
                                }
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.focus();
                            }}
                        >
                            {type === "select" && multiple
                                ? value.includes(choice) && (
                                      <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 10 7"
                                          width="10"
                                          height="7"
                                          fill="none"
                                          className="base"
                                      >
                                          <path
                                              d="M4 4.586L1.707 2.293A1 1 0 1 0 .293 3.707l3 3a.997.997 0 0 0 1.414 0l5-5A1 1 0 1 0 8.293.293L4 4.586z"
                                              fill="currentColor"
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              className="base"
                                          />
                                      </svg>
                                  )
                                : value === choice && (
                                      <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 10 7"
                                          width="10"
                                          height="9"
                                          fill="none"
                                          className="base"
                                      >
                                          <path
                                              d="M4 4.586L1.707 2.293A1 1 0 1 0 .293 3.707l3 3a.997.997 0 0 0 1.414 0l5-5A1 1 0 1 0 8.293.293L4 4.586z"
                                              fill="currentColor"
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              className="base"
                                          />
                                      </svg>
                                  )}

                            {choice}
                        </li>
                    ))}

                    {choices?.length === 0 && (
                        <div className={`${styles.choice} ${styles.disabled}`}>
                            No choices available
                        </div>
                    )}

                    {choices?.length > 0 && filteredChoices.length === 0 && (
                        <div className={`${styles.choice} ${styles.disabled}`}>
                            Nothing found
                        </div>
                    )}
                </ul>
            </div>

            {(maxLength > 0 || error) && (
                <div className={styles.subtext}>
                    <div>
                        {error && (
                            <span id={errorId} aria-live="polite">
                                {error}
                            </span>
                        )}
                    </div>

                    {maxLength > 0 && (
                        <div className={styles.count}>
                            {multiple && !readOnly
                                ? search.length
                                : value.length}
                            /{maxLength}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
