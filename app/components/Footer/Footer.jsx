import styles from "./Footer.module.css";
import { footerLinks } from "@/lib/nav";
import Link from "next/link";

export function Footer() {
    return (
        <footer className={styles.footer}>
            <nav className={styles.links}>
                {footerLinks.map((link) => (
                    <ol key={encodeURI(link.category)}>
                        <div className={styles.title}>{link.category}</div>

                        {link.links.map((link, index) => (
                            <li key={`${encodeURI(link.name)}_${index}`}>
                                <Link
                                    tabIndex={link.link === "#" ? -1 : 0}
                                    className={`${styles.link} ${
                                        link.link === "#" ? styles.disabled : ""
                                    }`}
                                    href={link.link}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ol>
                ))}
            </nav>

            <div>
                <Link href="/">Mneme</Link>© {new Date().getFullYear()} LLAMA
            </div>
        </footer>
    );
}
