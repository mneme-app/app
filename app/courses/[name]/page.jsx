import { redirect } from "next/navigation";
import { Course } from "@/app/api/models";
import { cookies } from "next/headers";
import { canRead, useUser } from "@/lib/auth";
import { CourseDash } from "./CourseDash";
import { serializeOne } from "@/lib/db";

export default async function CoursePage({ params }) {
    const user = await useUser({ token: cookies().get("token")?.value });

    const { name } = params;
    const nameDecoded = decodeURIComponent(name);

    const course = await Course.findOne({ name: nameDecoded })
        .populate("prerequisites.course")
        .populate("parentCourses");

    if (!course || !canRead(course, user)) return redirect("/courses");

    return <CourseDash course={serializeOne(course)} isLogged={user ? true : false} />;
}
