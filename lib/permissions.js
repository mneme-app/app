export const getPermission = (user, permissions) => {};

export const buildPermissions = (permissions) => {
    const payload = {};
    if (!permissions) {
        payload.allRead = false;
        payload.allWrite = false;
        return payload;
    }

    if (permissions.allRead === true && permissions.allWrite === true) {
        payload.allRead = true;
        payload.allWrite = true;
        return payload;
    }

    payload.allRead = permissions.allRead || false;
    payload.allWrite = permissions.allWrite || false;
    if (!payload.allRead) {
        if (permissions.usersRead && permissions.usersRead.length > 0) {
            payload.usersRead = permissions.usersRead.map((user) => {
                if (typeof user === "object" && user._id) return user._id;
                return user;
            });
        }

        if (permissions.groupsRead && permissions.groupsRead.length > 0) {
            payload.groupsRead = permissions.groupsRead.map((group) => {
                if (typeof group === "object" && group._id) return group._id;
                return group;
            });
        }
    }

    if (!payload.allWrite) {
        if (permissions.usersWrite && permissions.usersWrite.length > 0) {
            payload.usersWrite = permissions.usersWrite.map((user) => {
                if (typeof user === "object" && user._id) return user._id;
                return user;
            });
        }

        if (permissions.groupsWrite && permissions.groupsWrite.length > 0) {
            payload.groupsWrite = permissions.groupsWrite.map((group) => {
                if (typeof group === "object" && group._id) return group._id;
                return group;
            });
        }
    }

    return payload;
};

export function doesUserMeetPrerequisites(courses, prerequisites) {
    // for the function to return true, the user must have all of the courses
    // listed in the prerequisites array, as well as the required average level
    // for each course

    prerequisites.forEach((prerequisite) => {
        const course = courses.find((c) => c.course === prerequisite.course);
        if (!course) return false;

        if (course.progress < prerequisite.averageLevelRequired) return false;
    });

    return true;
}
