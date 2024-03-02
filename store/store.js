import makeUniqueId from "@/lib/uniqueId";
import { create } from "zustand";

export const stores = {
    source: "sourceStore",
    note: "noteStore",
    quiz: "quizStore",
    course: "courseStore",
    group: "groupStore",
    user: "userStore",
};

export const useStore = create((set) => ({
    user: undefined,
    sources: [],
    notes: [],
    quizzes: [],
    courses: [],
    groups: [],
    associates: [],
    notifications: [],

    setUser: (user) => {
        return set(() => ({
            user: !user
                ? undefined
                : {
                      id: user.id,
                      username: user.username,
                      displayName: user.displayName,
                      description: user.description,
                      avatar: user.avatar,
                      email: user.email,
                      isPublic: user.isPublic,
                      createdAt: user.createdAt,
                  },
        }));
    },

    fillInitialData: (data) => {
        return set(() => ({
            user: data.user,
            sources: data.sources || [],
            notes: data.notes || [],
            quizzes: data.quizzes || [],
            courses: data.courses || [],
            groups: data.groups || [],
            associates: data.associates || [],
            notifications: data.notifications || [],
        }));
    },

    addSource: (source) => {
        return set((state) => ({ sources: [...state.sources, source] }));
    },

    removeSource: (id) => {
        return set((state) => ({
            sources: state.sources.filter((source) => source._id !== id),
        }));
    },

    addNote: (note) => {
        return set((state) => ({ notes: [...state.notes, note] }));
    },

    removeNote: (id) => {
        return set((state) => ({
            notes: state.notes.filter((note) => note._id !== id),
        }));
    },

    addQuiz: (quiz) => {
        return set((state) => ({ quizzes: [...state.quizzes, quiz] }));
    },

    removeQuiz: (id) => {
        return set((state) => ({
            quizzes: state.quizzes.filter((quiz) => quiz._id !== id),
        }));
    },

    addCourse: (course) => {
        return set((state) => ({ courses: [...state.courses, course] }));
    },

    removeCourse: (id) => {
        return set((state) => ({
            courses: state.courses.filter((course) => course._id !== id),
        }));
    },

    addGroup: (group) => {
        return set((state) => ({ groups: [...state.groups, group] }));
    },

    removeGroup: (id) => {
        return set((state) => ({
            groups: state.groups.filter((group) => group._id !== id),
        }));
    },

    addAssociate: (associate) => {
        return set((state) => ({
            associates: [...state.associates, associate],
        }));
    },

    removeAssociate: (id) => {
        return set((state) => ({
            associates: state.associates.filter(
                (associate) => associate._id !== id,
            ),
        }));
    },

    addNotification: (notification) => {
        return set(() => ({ notifications: [...notifications, notification] }));
    },

    removeNotification: (id) => {
        return set((state) => ({
            notifications: state.notifications.filter(
                (notification) => notification._id !== id,
            ),
        }));
    },
}));

// Daily Train Store

export const useDailyTrain = create()((set) => ({
    start: false,
    isPaused: false,
    settings: {
        timeLimit: 60 * 15,
        tags: [],
        courses: [],
    },

    setStart: (start) => set(() => ({ start })),
    setIsPaused: (isPaused) => set(() => ({ isPaused })),
    setTimeLimit: (timeLimit) => set(() => ({ timeLimit })),
    setSettings: (newValues) =>
        set((state) => ({
            settings: {
                ...state.settings,
                ...newValues,
            },
        })),
}));

// Alerts Store

export const useAlerts = create()((set) => ({
    alerts: [],

    addAlert: (alert) =>
        set((state) => ({
            alerts: [
                ...state.alerts,
                {
                    id: makeUniqueId(),
                    ...alert,
                },
            ],
        })),

    removeAlert: (id) =>
        set((state) => ({
            alerts: state.alerts.filter((alert) => alert.id !== id),
        })),
}));

// Modals Store

export const useModals = create()((set) => ({
    modals: [],

    addModal: (modal) =>
        set((state) => ({
            modals: [
                ...state.modals,
                {
                    id: makeUniqueId(),
                    ...modal,
                },
            ],
        })),

    removeModal: (id) => {
        if (!id) {
            return set((state) => {
                let newModals = [...state.modals];
                newModals.pop();
                return {
                    modals: newModals,
                };
            });
        }

        return set((state) => ({
            modals: state.modals.filter((modal) => modal.id !== id),
        }));
    },
}));

// Menu Store

export const useMenu = create()((set) => ({
    menu: null,
    setMenu: (menu) => set(() => ({ menu })),
}));

// Tooltip Store

export const useTooltip = create()((set) => ({
    tooltip: null,
    setTooltip: (tooltip) => set(() => ({ tooltip })),
}));
