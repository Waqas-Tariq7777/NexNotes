import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        trim: true,
        default: ""
    },
    content: {
        type: String,
        trim: true,
        default: ""
    },
    images: [{
        type: String // Cloudinary URLs
    }],
    checklists: [{
        text: String,
        isCompleted: {
            type: Boolean,
            default: false
        }
    }],
    color: {
        type: String,
        default: "bg-primary/5"
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    isTrash: {
        type: Boolean,
        default: false
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    labels: [{
        type: String
    }],
    reminder: {
        type: Date
    }
}, { timestamps: true });

export const Note = mongoose.model("Note", noteSchema);
