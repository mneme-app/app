import styles from "./Spinner.module.css";

export function Spinner() {
    return (
        <svg className={styles.svg} viewBox="25 25 50 50">
            <circle cx="50" cy="50" r="20" />
        </svg>
    );
}
