import { CourseInput } from "../components/Course/CourseInput";
import { canEdit, canRead, useUser } from "@/lib/auth";
import { cookies } from "next/headers";
import styles from "@/app/page.module.css";
import Course from "../api/models/Course";
import { CourseDisplay } from "../components/Course/CourseDisplay";
import { InputPopup } from "../components/client";
import { serializeOne } from "@/lib/db";

export default async function CoursesPage({ searchParams }) {
    const user = await useUser({ token: cookies().get("token")?.value });
    const courses = await Course.find();

    return (
        <main className={styles.main}>
            {courses.length > 0 && (
                <section>
                    <h3>Available Courses</h3>

                    <ol className={styles.listGrid}>
                        {courses.map((course) => (
                            <li key={course._id}>
                                <CourseDisplay
                                    course={course}
                                    canRead={canRead(course, user)}
                                />

                                {user && canEdit(course, user) && (
                                    <InputPopup
                                        type="course"
                                        resource={serializeOne(course)}
                                    />
                                )}
                            </li>
                        ))}
                    </ol>
                </section>
            )}

            {user && (
                <section>
                    <h3>Create new course</h3>

                    <CourseInput />
                </section>
            )}
        </main>
    );
}
