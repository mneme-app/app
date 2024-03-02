import { model, models, Schema } from "mongoose";
import { MIN, MAX } from "@/lib/constants";

const TQuiz = new Schema({
    quizId: {
        type: Schema.Types.ObjectId,
        ref: "quiz",
        required: true,
    },
    lastCorrect: {
        type: Date,
    },
    level: {
        type: Number,
        default: 0,
    },
    hiddenUntil: {
        type: Date,
    },
});

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            minLength: MIN.username,
            maxLength: MAX.username,
        },
        displayName: {
            type: String,
            minLength: MIN.displayName,
            maxLength: MAX.displayName,
        },
        description: {
            type: String,
            minLength: MIN.description,
            maxLength: MAX.description,
        },
        avatar: {
            type: String,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        refreshTokens: {
            type: [String],
            default: [],
        },
        email: {
            type: String,
            minLength: MIN.email,
            maxLength: MAX.email,
        },
        associates: [
            {
                type: Schema.Types.ObjectId,
                ref: "user",
            },
        ],
        groups: [
            {
                type: Schema.Types.ObjectId,
                ref: "group",
            },
        ],
        courses: [
            {
                course: {
                    type: Schema.Types.ObjectId,
                    ref: "course",
                },
                progress: {
                    type: Number,
                    default: 0,
                },
                lastViewed: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        quizzes: [TQuiz],
        notifications: [Object],
        lastLogin: {
            type: Date,
        },
        isPublic: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

UserSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

UserSchema.set("toJSON", {
    virtuals: true,
});

export default models?.user || model("user", UserSchema);
