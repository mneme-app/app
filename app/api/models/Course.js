import PermissionSchema from "./PermissionSchema";
import { model, models, Schema } from "mongoose";
import { MIN, MAX } from "@/lib/constants";

const CourseSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minLength: MIN.courseName,
            maxLength: MAX.courseName,
        },
        description: {
            type: String,
            required: true,
            minLength: MIN.courseDescription,
            maxLength: MAX.courseDescription,
        },
        parentCourses: [
            {
                type: Schema.Types.ObjectId,
                ref: "course",
            },
        ],
        prerequisites: [
            {
                course: {
                    type: Schema.Types.ObjectId,
                    ref: "course",
                },
                averageLevelRequired: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        permissions: PermissionSchema,
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        students: [
            {
                type: Schema.Types.ObjectId,
                ref: "user",
            },
        ],
        tutors: [
            {
                type: Schema.Types.ObjectId,
                ref: "user",
            },
        ],
        enrollment: {
            type: String,
            default: "private",
            enum: {
                values: ["open", "paid", "private"],
                message: "Invalid enrollment type",
            },
        },
    },
    {
        timestamps: true,
    },
);

CourseSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

CourseSchema.set("toJSON", {
    virtuals: true,
});

export default models?.course || model("course", CourseSchema);
