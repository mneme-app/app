"use client";

import { useStore } from "@/store/store";
import { useEffect } from "react";

export function FillStore({
    user,
    sources,
    notes,
    quizzes,
    courses,
    groups,
    associates,
    notifications,
    webSocketURL,
}) {
    const fillInitialData = useStore((state) => state.fillInitialData);
    const setUser = useStore((state) => state.setUser);

    useEffect(() => {
        const ws = webSocketURL
            ? new WebSocket(webSocketURL)
            : { close: () => {} };

        ws.onopen = () => {
            console.log(`Web socket connection opened to ${webSocketURL}`);
        };

        ws.onmessage = (message) => {
            const record = JSON.parse(message.data);
            console.log(`Web socket message received: ${record}`);

            if (!record.ns) return;

            const operation = record.operationType;
            const collection = record.ns.coll;
            const resource = record.fullDocument;
        };

        setUser(user);

        fillInitialData({
            user,
            sources,
            notes,
            quizzes,
            courses,
            groups,
            associates,
            notifications,
        });

        return () => {
            ws.close();
            console.log(`Web socket connection closed to ${webSocketURL}`);
        };
    }, []);
}
