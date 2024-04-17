import { useUser, canEdit, queryReadableResources } from "@/lib/auth";
import { QuizInput, InputPopup, UserStats, QuizDisplay } from "@client";
import { serialize, serializeOne } from "@/lib/db";
import styles from "@/app/page.module.css";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Quiz, User } from "@models";
import Link from "next/link";

export default async function QuizzesPage({ searchParams }) {
    const user = await useUser({ token: cookies().get("token")?.value });
    User.populate(user, ["groups", "associates"]);
    const query = queryReadableResources(user);

    let userQuizzes;
    if (user) {
        userQuizzes = user.quizzes;
    }

    const page = Number(searchParams["page"] ?? 1);
    const amount = Number(searchParams["amount"] ?? 10);
    if (page < 1 || amount < 1) {
        return redirect(
            `/quizzes?page=${page < 1 ? 1 : page}&amount=${
                amount < 1 ? 10 : amount
            }`,
        );
    }

    const quizzes = serialize(
        await Quiz.find(query)
            .limit(amount)
            .skip((page - 1) * amount),
    );

    const hasMore =
        (
            await Quiz.find(query)
                .limit(1)
                .skip((page - 1) * amount + amount)
        )?.length > 0;

    if (page > 1 && quizzes.length === 0) {
        return redirect("/quizzes?page=1&amount=" + amount);
    }

    return (
        <main className={styles.main}>
            <div className={styles.titleBlock}>
                <h2>Quiz Cards</h2>

                <p>
                    A quiz is a question that challenges your understanding and
                    recall of information from a source or note.
                    <br />
                    {user
                        ? `These are the quizzes that are publicly viewable, as well as the ones you made.`
                        : `You are only viewing the publicly available quizzes.
                           Log in to see quizzes available to you and create your own quizzes.`}
                </p>
            </div>

            {quizzes.length > 0 && (
                <section>
                    <h3>Available Quiz Questions</h3>

                    <ol className={styles.listGrid}>
                        {quizzes.map((quiz) => {
                            const quizInUser = userQuizzes?.find(
                                (q) =>
                                    q.quizId.toString() === quiz._id.toString(),
                            );

                            return (
                                <li key={quiz.id}>
                                    <QuizDisplay
                                        quiz={quiz}
                                        canClientCheck={user ? false : true}
                                    />

                                    {quizInUser && (
                                        <UserStats userQuizInfo={quizInUser} />
                                    )}

                                    {user &&
                                        canEdit(quiz, serializeOne(user)) && (
                                            <InputPopup
                                                type="quiz"
                                                resource={serializeOne(quiz)}
                                            />
                                        )}
                                    <Link href={`/quizzes/${quiz.id}`}>Go to Quiz Page</Link>
                                </li>
                            );
                        })}
                    </ol>

                    <div className={styles.paginationButtons}>
                        {page > 1 ? (
                            <Link
                                className="button submit"
                                href={`/quizzes?page=${
                                    page - 1
                                }&amount=${amount}`}
                            >
                                Previous page
                            </Link>
                        ) : (
                            <button disabled className="button submit">
                                Previous page
                            </button>
                        )}

                        {hasMore ? (
                            <Link
                                className="button submit"
                                href={`/quizzes?page=${
                                    page + 1
                                }&amount=${amount}`}
                            >
                                Next page
                            </Link>
                        ) : (
                            <button disabled className="button submit">
                                Next page
                            </button>
                        )}
                    </div>
                </section>
            )}
        </main>
    );
}
