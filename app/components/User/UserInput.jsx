"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAlerts, useModals } from "@/store/store";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";
import styles from "./UserInput.module.css";
import { useRouter } from "next/navigation";
import { Input, Spinner } from "@client";

export function UserInput({ isRegistering, onSubmit }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [passwordFocus, setPasswordFocus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const addAlert = useAlerts((state) => state.addAlert);
    const addModal = useModals((state) => state.addModal);

    const passwordTooltip = useRef(null);
    const passwordInput = useRef(null);
    const router = useRouter();

    useEffect(() => {
        function handleClick(e) {
            if (
                passwordFocus &&
                !passwordTooltip.current?.contains(e.target) &&
                !passwordInput.current?.contains(e.target)
            ) {
                setPasswordFocus(false);
            }
        }

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [passwordFocus]);

    const passwordWeaknesses = [
        "At least 8 characters",
        "Upper & lowercase letters",
        "A number",
        "A special character (@$!%*?&:)",
    ];

    function getWeaknesses() {
        let weaknesses = [];

        if (password.length < 8) {
            weaknesses.push("At least 8 characters");
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z]).+$/.test(password)) {
            weaknesses.push("Upper & lowercase letters");
        }

        if (!/(?=.*\d)/.test(password)) {
            weaknesses.push("A number");
        }

        if (!/(?=.*[@$!%*?&:])/.test(password)) {
            weaknesses.push("A special character (@$!%*?&:)");
        }

        return weaknesses;
    }

    async function handleRegister(e) {
        e.preventDefault();

        if (username.length === 0) {
            setErrors((prev) => ({
                ...prev,
                username: "Username cannot be empty",
            }));
        }

        if (password.length === 0) {
            setErrors((prev) => ({
                ...prev,
                password: "Password cannot be empty",
            }));
        }

        if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&:]).{8,}$/g.test(
                password,
            )
        ) {
            setErrors((prev) => ({ ...prev, password: "Invalid password" }));
            setPasswordFocus(true);
            let weaknessesModal = (
                <ul>
                    {getWeaknesses().map((w, index) => (
                        <li key={index}>{w}</li>
                    ))}
                </ul>
            );
            addModal({
                title: "Please correct in password",
                content: weaknessesModal,
            });
            return;
        }

        if (password !== confirmPassword) {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: "Passwords do not match",
            }));
            return;
        }

        if (username.length === 0 || password.length === 0) {
            return;
        }

        const user = { username: username.trim(), password };

        setLoading(true);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASEPATH ?? ""}/api/auth/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            },
        );

        setLoading(false);

        if (response.status === 400) {
            setErrors((prev) => ({
                ...prev,
                username: "Username already exists",
            }));
            return;
        }

        if (response.status === 201) {
            if (!onSubmit) router.push("/login");

            setUsername("");
            setPassword("");
            setConfirmPassword("");
            setErrors({});
            setPasswordFocus(false);

            addAlert({
                success: true,
                message: "Account created successfully",
            });

            if (onSubmit) onSubmit();
        } else {
            addAlert({
                success: false,
                message: "Something went wrong",
            });
        }
    }

    async function handleLogin(e) {
        e.preventDefault();

        if (username.length === 0) {
            setErrors((prev) => ({
                ...prev,
                username: "Username cannot be empty",
            }));
        }

        if (password.length === 0) {
            setErrors((prev) => ({
                ...prev,
                password: "Password cannot be empty",
            }));
        }

        if (username.length === 0 || password.length === 0) {
            return;
        }

        const user = { username: username.trim(), password };

        setLoading(true);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASEPATH ?? ""}/api/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            },
        );

        setLoading(false);

        if (response.status === 200) {
            if (!onSubmit) router.push(`/users/${username}`);
            router.refresh();

            setUsername("");
            setPassword("");
            setConfirmPassword("");
            setErrors({});
            setPasswordFocus(false);

            addAlert({
                success: true,
                message: "Logged in successfully",
            });
            if (onSubmit) onSubmit();
        } else {
            setErrors({ username: "Invalid username or password" });
        }
    }

    return (
        <form
            className="formGrid"
            onSubmit={(e) => {
                e.preventDefault();
                isRegistering ? handleRegister(e) : handleLogin(e);
            }}
        >
            <Input
                required
                label="Username"
                value={username}
                autoFocus={true}
                error={errors.username}
                onChange={(val) => {
                    setUsername(val);
                    setErrors((prev) => ({ ...prev, username: "" }));
                }}
            />

            <div style={{ position: "relative" }} ref={passwordInput}>
                <Input
                    required
                    type="password"
                    label="Password"
                    value={password}
                    error={isRegistering && errors.password}
                    onFocus={() => setPasswordFocus(true)}
                    onBlur={() => setPasswordFocus(false)}
                    onChange={(val) => {
                        setPassword(val);
                        setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                />

                {passwordFocus && isRegistering && (
                    <div
                        className={styles.passwordTooltip}
                        ref={passwordTooltip}
                        aria-live="polite"
                    >
                        <p>Your password must contain:</p>

                        <ul>
                            {passwordWeaknesses.map((weakness, index) => {
                                return (
                                    <li
                                        key={index}
                                        className={
                                            !getWeaknesses().includes(weakness)
                                                ? styles.weakness
                                                : ""
                                        }
                                    >
                                        <div>
                                            {!getWeaknesses().includes(
                                                weakness,
                                            ) && (
                                                <FontAwesomeIcon
                                                    icon={faCheck}
                                                />
                                            )}
                                        </div>
                                        <span>{weakness}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>

            {isRegistering && (
                <Input
                    required
                    type="password"
                    label="Password Match"
                    value={confirmPassword}
                    error={errors.confirmPassword}
                    onChange={(val) => {
                        setConfirmPassword(val);
                        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }}
                />
            )}

            <button
                onClick={isRegistering ? handleRegister : handleLogin}
                className="button submit"
            >
                {loading ? <Spinner /> : isRegistering ? "Register" : "Login"}
            </button>
        </form>
    );
}
