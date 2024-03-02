import styles from "./Avatar.module.css";
import Image from "next/image";

const cdn = process.env.NEXT_PUBLIC_CDN_URL;

export function Avatar({ src, username, size = 40, outline, background }) {
    const letter = username?.[0]?.toUpperCase();

    return (
        <div
            className={styles.container}
            style={{
                width: size,
                minWidth: size,
                height: size,
                minHeight: size,
                fontSize: size / 3,
                lineHeight: `${size / 3}px`,
                outline: outline ? "" : "0px solid transparent",
                background: background || "",
            }}
        >
            {/* {src ? (
                <Image
                    draggable={false}
                    alt={`Avatar for ${username}`}
                    width={size}
                    height={size}
                    src={`${cdn}/${src}/`}
                />
            ) : (
                <div>{letter}</div>
            )} */}

            {letter}
        </div>
    );
}
