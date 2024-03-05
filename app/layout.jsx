import { Source, Note, Quiz, Notification, Course } from "@models";
import { FillStore, Timer, Alerts, Modals, Menu } from "@client";
import { Header, Footer, DBConnectError } from "@server";
import { queryReadableResources } from "@/lib/auth";
import { serialize, serializeOne } from "@/lib/db";
import { metadatas } from "@/lib/metadatas";
import { cookies } from "next/headers";
import { useUser } from "@/lib/auth";
import connectDB from "./api/db";
import "./globals.css";

const connection = await connectDB();

export const metadata = {
    metadataBase: new URL(metadatas.layout.url),
    title: metadatas.layout.title,
    description: metadatas.layout.description,
    keywords: metadatas.layout.keywords.join(", "),
    openGraph: {
        title: metadatas.layout.title,
        description: metadatas.layout.description,
        url: metadatas.layout.url,
        type: "website",
        siteName: metadatas.layout.title,
        locale: "en_US",
        images: metadatas.layout.images,
    },
};

export default async function RootLayout({ children }) {
    if (connection === false) {
        return (
            <html lang="en">
                <body>
                    <Header />
                    <DBConnectError />
                    <Footer />
                </body>
            </html>
        );
    }

    const user = await useUser({ token: cookies().get("token")?.value });
    user &&
        (await user.populate(
            "associates",
            "id username avatar displayName description",
        ));
    user && (await user.populate("groups"));
    user && (await user.populate("courses.course"));

    const notifications = user
        ? serialize(await Notification.find({ recipient: user.id }))
        : [];

    const query = queryReadableResources(user);

    const sources = user ? serialize(await Source.find(query)) : [];
    const notes = user ? serialize(await Note.find(query)) : [];
    const quizzes = user ? serialize(await Quiz.find(query)) : [];
    const courses = user
        ? [
              ...serialize(await Course.find({ createdBy: user.id })),
              ...serialize(user.courses.map((course) => course.course)),
          ]
        : [];

    return (
        <html lang="en">
            {user && (
                <FillStore
                    user={serializeOne(user)}
                    sources={sources}
                    notes={notes}
                    quizzes={quizzes}
                    courses={courses}
                    groups={serialize(user.groups)}
                    associates={serialize(user.associates)}
                    notifications={notifications}
                />
            )}

            <body>
                <Header />
                {children}
                <Footer />

                <Timer />
                <Alerts />
                <Modals />
                <Menu />
            </body>
        </html>
    );
}
