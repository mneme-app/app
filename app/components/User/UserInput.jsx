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
    const [usernameError, setUsernameError] = useState("");

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const [loading, setLoading] = useState(false);

    const [passwordFocus, setPasswordFocus] = useState(false);

    const addAlert = useAlerts((state) => state.addAlert);
    const addModal = useModals((state) => state.addModal);

    const passwordTooltip = useRef(null);
    const passwordInput = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (
                passwordFocus &&
                !passwordTooltip.current?.contains(e.target) &&
                !passwordInput.current?.contains(e.target)
            ) {
                setPasswordFocus(false);
            }
        };

        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
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
            setUsernameError("Username cannot be empty");
        }

        if (password.length === 0) {
            setPasswordError("Password cannot be empty");
        }

        if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&:]).{8,}$/g.test(
                password,
            )
        ) {
            setPasswordError("Password is too weak");
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
            setConfirmPasswordError("Passwords do not match");
            return;
        }

        if (username.length === 0 || password.length === 0) {
            return;
        }

        const user = { username, password };

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
            setUsernameError("Username already exists");
            return;
        }

        if (response.status === 201) {
            if (!onSubmit) router.push("/login");

            setUsername("");
            setPassword("");
            setConfirmPassword("");
            setUsernameError("");
            setPasswordError("");
            setConfirmPasswordError("");
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
            setUsernameError("Username cannot be empty");
        }

        if (password.length === 0) {
            setPasswordError("Password cannot be empty");
        }

        if (username.length === 0 || password.length === 0) {
            return;
        }

        const user = { username, password };

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
            setUsernameError("");
            setPasswordError("");
            setConfirmPasswordError("");
            setPasswordFocus(false);

            addAlert({
                success: true,
                message: "Logged in successfully",
            });
            if (onSubmit) onSubmit();
        } else {
            setUsernameError("Invalid username or password");
        }
    }

    return (
        <form className="formGrid">
            <Input
                required
                onChange={(val) => {
                    setUsername(val);
                    setUsernameError("");
                }}
                value={username}
                error={usernameError}
                label={"Username"}
                autoFocus={true}
            />

            <div style={{ position: "relative" }} ref={passwordInput}>
                <Input
                    type={"password"}
                    required={true}
                    onChange={(val) => {
                        setPassword(val);
                        setPasswordError("");
                    }}
                    value={password}
                    error={isRegistering && passwordError}
                    label={"Password"}
                    onFocus={() => setPasswordFocus(true)}
                    onBlur={() => setPasswordFocus(false)}
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
                    type={"password"}
                    required={true}
                    onChange={(val) => {
                        setConfirmPassword(val);
                        setConfirmPasswordError("");
                    }}
                    value={confirmPassword}
                    error={confirmPasswordError}
                    label={"Password Match"}
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
