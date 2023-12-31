import { useUser, queryReadableResources } from "@/lib/auth";
import shuffleArray from "@/lib/shuffleArray";
import styles from "@/app/page.module.css";
import { cookies } from "next/headers";
import { Quiz, User } from "@models";
import { serialize } from "@/lib/db";
import { DailyTrain } from "@client";

export default async function DailyPage({ searchParams }) {
    const user = await useUser({ token: cookies().get("token")?.value });
    User.populate(user, ["groups", "associates"]);
    const query = queryReadableResources(user);

    const userQuizzes = user?.quizzes;
    const allQuizzes = await Quiz.find(query);
    const quizzes = shuffleArray(
        serialize(
            allQuizzes.filter((q) => {
                const quizInUser = userQuizzes?.find(
                    (quiz) => quiz.quizId.toString() === q._id.toString(),
                );
                if (!quizInUser) return true;
                const hidden = new Date(quizInUser.hiddenUntil);
                return hidden.getTime() <= Date.now();
            }),
        ),
    );

    return (
        <main className={styles.main}>
            <div className={styles.titleBlock}>
                <h2>Daily Train</h2>

                <p>
                    Daily Training is a spaced repetition system that helps you
                    remember information from your notes and sources.
                </p>
            </div>

            <section className="paragraph">
                <p>
                    The Daily Train page is where you can practice on the quiz
                    questions.
                </p>

                <p>
                    When you get a quiz question correct, it levels up, and you
                    do not see it again until later. Say you achieve level 7
                    with a quiz question when you get it right today. That quiz
                    question will not appear in Daily Training for another 7
                    days.
                </p>

                <p>
                    But if you get a quiz question wrong, you go down one level,
                    and you have to try to get it right again before it
                    disappears from Daily Training.
                </p>
            </section>

            <section>
                <h3>Ready to test your knowledge?</h3>

                {user ? (
                    <DailyTrain quizzes={quizzes} />
                ) : (
                    <p className={styles.centered}>
                        Please log in to start training
                    </p>
                )}
            </section>
        </main>
    );
}
