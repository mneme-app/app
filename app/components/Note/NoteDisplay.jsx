import styles from "./NoteDisplay.module.css";
import { Card, ListItem } from "@client";
import { Note, User } from "@models";

export async function NoteDisplay({ note }) {
    const user = await User.findById(note.createdBy);
    const dbNote = await Note.findById(note._id)
        .populate("sources")
        .populate("courses");

    return (
        <Card title={note.title} description={note.text}>
            {note.tags?.length > 0 && (
                <section className={styles.section}>
                    <h5>Tags</h5>

                    <ol className="chipList">
                        {note.tags?.map((cont) => (
                            <ListItem key={cont} item={cont} />
                        ))}
                    </ol>
                </section>
            )}

            {dbNote?.sources?.length > 0 && (
                <section className={styles.section}>
                    <h5>Sources linked</h5>

                    <ul>
                        {dbNote.sources.map((source) => (
                            <ListItem
                                key={source._id}
                                item={source.title}
                                link={source.url}
                            />
                        ))}
                    </ul>
                </section>
            )}

            {dbNote?.courses?.length > 0 && (
                <section className={styles.section}>
                    <h5>This note belongs to the following courses</h5>

                    <ul>
                        {dbNote.courses.map((course) => (
                            <ListItem key={course._id} item={course.name} />
                        ))}
                    </ul>
                </section>
            )}

            <p>Created by: {user?.username ?? "Unknown"}</p>
        </Card>
    );
}
