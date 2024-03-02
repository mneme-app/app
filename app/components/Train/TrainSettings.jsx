"use client";

import { useDailyTrain, useStore } from "@/store/store";
import styles from "./DailyTrain.module.css";
import { useState, useEffect } from "react";
import { Input, ListAdd } from "@client";

export function TrainSettings({ tags, courses }) {
    const settings = useDailyTrain((state) => state.settings);
    const setSettings = useDailyTrain((state) => state.setSettings);
    const availableCourses = useStore((state) => state.courses);

    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [minutes, setMinutes] = useState("00");
    const [seconds, setSeconds] = useState("00");

    useEffect(() => {
        let time = settings.timeLimit;
        if (isNaN(time) || time < 0) time = 0;
        if (time > 3600) time = 3600;
        let minutes = String(Math.floor(time / 60)).padStart(2, "0");
        let seconds = String(time % 60).padStart(2, "0");
        setMinutes(minutes);
        setSeconds(seconds);
    }, [settings]);

    const tagOptions = tags.map((t, index) => ({ tag: t, _id: index }));
    const courseOptions = courses.map((c_id) => {
        const course = availableCourses.find((c) => c._id === c_id);
        return course;
    });

    function updateTime(denomination, value) {
        let timeLimit;
        if (denomination === "minutes") {
            timeLimit = value * 60 + Number(seconds);
        }
        if (denomination === "seconds") {
            timeLimit = Number(minutes) * 60 + value;
        }
        setSettings({ timeLimit });
    }

    function setSettingTags(tagsChosen) {
        setSelectedTags(tagsChosen);
        setSettings({ tags: tagsChosen.map((t) => t.tag) });
    }

    function setSettingCourses(coursesChosen) {
        setSelectedCourses(coursesChosen);
        setSettings({ courses: coursesChosen.map((c) => c._id) });
    }

    return (
        <div className={styles.settings}>
            <div>
                <h3>Time Limit</h3>
                <Input
                    inline
                    label={"Minutes"}
                    type="number"
                    min={0}
                    max={60}
                    value={minutes}
                    onChange={(val) => updateTime("minutes", Number(val))}
                />
                :
                <Input
                    inline
                    label={"Seconds"}
                    type="number"
                    min={-10}
                    max={60}
                    value={seconds}
                    onChange={(val) => updateTime("seconds", Number(val))}
                />
            </div>

            <div>
                <h3>Filter by Tags</h3>

                <ListAdd
                    item="Select Tags"
                    listChosen={selectedTags}
                    listChoices={tagOptions}
                    listProperty={"tag"}
                    listSetter={setSettingTags}
                />
            </div>

            <div>
                <h3>Filter by Courses</h3>

                <ListAdd
                    item="Select Courses"
                    listChosen={selectedCourses}
                    listChoices={courseOptions}
                    listProperty={"name"}
                    listSetter={setSettingCourses}
                />
            </div>
        </div>
    );
}
