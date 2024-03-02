import PermissionSchema from "./PermissionSchema";
import { model, models, Schema } from "mongoose";
import { MIN, MAX } from "@/lib/constants";

//  Needs either lastAccessed or publishDate
//  URL has to match http format

const SourceSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            minLength: MIN.sourceTitle,
            maxLength: MAX.sourceTitle,
        },
        authors: [
            {
                type: String,
                required: true,
                minLength: MIN.author,
                maxLength: MAX.author,
            },
        ],
        medium: {
            type: String,
            enum: {
                values: ["book", "article", "video", "podcast", "website"],
                message: "Invalid medium",
            },
        },
        url: {
            type: String,
        },
        tags: [
            {
                type: String,
                minLength: MIN.tag,
                maxLength: MAX.tag,
            },
        ],
        courses: [
            {
                type: Schema.Types.ObjectId,
                ref: "course",
            },
        ],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        publishedAt: {
            type: Date,
        },
        lastAccessed: {
            type: Date,
        },
        permissions: PermissionSchema,
        locationTypeDefault: {
            type: String,
            default: "page",
            enum: {
                values: ["page", "id reference", "section", "timestamp"],
                message: "Invalid location identifier for a source reference",
            },
        },
    },
    {
        timestamps: true,
    },
);

SourceSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

SourceSchema.set("toJSON", {
    virtuals: true,
});

export default models?.source || model("source", SourceSchema);
