"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Card.module.css";
import { useState } from "react";
import Link from "next/link";

export function Card({
    title,
    subtitle,
    description,
    image,
    url,
    urlLabel,
    buttons,
    children,
    border,
}) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div
            className={`${styles.container} ${isFocused ? styles.focused : ""}`}
            tabIndex={0}
            onFocus={() => {
                setIsFocused(true);
            }}
            onBlur={() => {
                setIsFocused(false);
            }}
        >
            <span className={styles.span}></span>

            <div className={styles.content_container}>
                <div className={styles.content}>
                    {image && (
                        <div>
                            <img src={image} alt={title} />
                        </div>
                    )}

                    {(title || subtitle || description) && (
                        <div className={styles.textContent}>
                            {(title || subtitle) && (
                                <header>
                                    {title && (
                                        <h4
                                            style={{
                                                marginBottom: subtitle
                                                    ? "14px"
                                                    : "0",
                                            }}
                                            title={title}
                                        >
                                            {url ? (
                                                url.startsWith("http") ? (
                                                    <a href={url}>
                                                        {urlLabel ?? title}
                                                    </a>
                                                ) : (
                                                    <Link href={url}>
                                                        {urlLabel ?? title}
                                                    </Link>
                                                )
                                            ) : (
                                                title
                                            )}
                                        </h4>
                                    )}

                                    {subtitle && <h5>{subtitle}</h5>}
                                </header>
                            )}

                            {description && (
                                <p className={styles.description}>
                                    {description}
                                </p>
                            )}
                        </div>
                    )}

                    <div className={styles.childrenContent}>{children}</div>

                    {buttons?.length > 0 && (
                        <div className={styles.buttonContainer}>
                            {buttons.map((button) => {
                                if (button.link) {
                                    if (button.link.startsWith("http")) {
                                        return (
                                            <a
                                                key={button.label}
                                                href={button.link}
                                                target={
                                                    button.sameTab
                                                        ? ""
                                                        : "_blank"
                                                }
                                                rel="noreferrer"
                                                className={`button ${button.color}`}
                                                style={{
                                                    backgroundColor:
                                                        button.color,
                                                }}
                                            >
                                                {button.label}

                                                {button.icon && (
                                                    <FontAwesomeIcon
                                                        icon={button.icon}
                                                    />
                                                )}
                                            </a>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={button.label}
                                            href={button.link}
                                            target={
                                                button.sameTab ? "" : "_blank"
                                            }
                                            rel="noreferrer"
                                            className={`button ${button.color}`}
                                            style={{
                                                backgroundColor: button.color,
                                            }}
                                        >
                                            {button.label}

                                            {button.icon && (
                                                <FontAwesomeIcon
                                                    icon={button.icon}
                                                />
                                            )}
                                        </Link>
                                    );
                                } else {
                                    return (
                                        <button
                                            key={button.label}
                                            onClick={button.onClick}
                                            style={{
                                                backgroundColor: button.color,
                                            }}
                                        >
                                            {button.label}{" "}
                                            {button.icon && (
                                                <FontAwesomeIcon
                                                    icon={button.icon}
                                                />
                                            )}
                                        </button>
                                    );
                                }
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
