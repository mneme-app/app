"use client";

import styles from "./RightContainer.module.css";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Profile } from "@client";
import { links } from "@/lib/nav";
import Link from "next/link";

export function RightContainer({ user }) {
    const [open, setOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const pathname = usePathname();

    function handleClose() {
        setIsClosing(true);
        document.documentElement.style.overflow = "auto";

        setTimeout(() => {
            setOpen(false);
            setIsClosing(false);
        }, 200);
    }

    function handleOpen() {
        setOpen(true);
        setTimeout(() => {
            document.documentElement.style.overflow = "hidden";
        }, 200);
    }

    // useEffect(() => {
    //     handleClose();
    // }, [pathname]);

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth > 767) {
                handleClose();
            }
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className={styles.container}>
            {user ? (
                <Profile user={user} size={44} />
            ) : (
                <Link href="/login">Login</Link>
            )}

            {open && (
                <div
                    className={styles.menu}
                    style={{
                        animation: isClosing
                            ? `${styles.leftToRight} 0.21s cubic-bezier(0.25, 0.46, 0.45, 0.94)`
                            : "",
                    }}
                >
                    <nav>
                        <ul className={styles.list}>
                            {links.map((link) => (
                                <li
                                    key={link.name}
                                    onClick={() => handleClose()}
                                >
                                    <Link href={link.href}>{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            )}

            <button
                className={styles.button}
                onClick={() => {
                    if (open) return handleClose();
                    handleOpen();
                }}
            >
                <svg
                    className={`${styles.icon} ${open ? styles.open : ""}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 100"
                    width="24"
                    height="24"
                >
                    <rect
                        fill="currentColor"
                        width="100"
                        height="8"
                        x="0"
                        y="20"
                        rx="4"
                    />
                    <rect
                        fill="currentColor"
                        width="100"
                        height="8"
                        x="0"
                        y="45"
                        rx="4"
                    />
                    <rect
                        fill="currentColor"
                        width="100"
                        height="8"
                        x="0"
                        y="70"
                        rx="4"
                    />
                </svg>
            </button>
        </div>
    );
}
