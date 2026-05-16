import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Note } from "../models/note.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createNote = asyncHandler(async (req, res) => {
    const { title, content, checklists, color, reminder, labels } = req.body;
    
    let parsedChecklists = [];
    if (checklists) {
        try {
            parsedChecklists = typeof checklists === 'string' ? JSON.parse(checklists) : checklists;
        } catch (error) {
            throw new ApiError(400, "Invalid checklist format");
        }
    }

    let parsedLabels = [];
    if (labels) {
        try {
            parsedLabels = typeof labels === 'string' ? JSON.parse(labels) : labels;
        } catch (error) {
            throw new ApiError(400, "Invalid labels format");
        }
    }

    const imageLocalPaths = req.files?.map(file => file.path) || [];
    const imageUrls = [];

    if (imageLocalPaths.length > 0) {
        for (const path of imageLocalPaths) {
            const result = await uploadOnCloudinary(path);
            if (result) {
                imageUrls.push(result.url);
            }
        }
    }

    const note = await Note.create({
        userId: req.user._id,
        title: title || "",
        content: content || "",
        checklists: parsedChecklists,
        labels: parsedLabels,
        images: imageUrls,
        color: color || "bg-primary/5",
        reminder: reminder || null
    });

    if (!note) {
        throw new ApiError(500, "Something went wrong while creating the note");
    }

    return res.status(201).json(
        new ApiResponse(201, note, "Note created successfully")
    );
});

const getNotes = asyncHandler(async (req, res) => {
    // Return ALL notes for the user and let the frontend filter, or we can add query params
    // To fix the "Archive/Trash/Reminders" tab issue, we fetch all relevant notes
    const notes = await Note.find({ 
        userId: req.user._id
    }).sort({ isPinned: -1, createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, notes, "Notes fetched successfully")
    );
});

const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "No image file provided");
    }

    const result = await uploadOnCloudinary(req.file.path);
    if (!result) {
        throw new ApiError(500, "Failed to upload image to Cloudinary");
    }

    return res.status(200).json(
        new ApiResponse(200, { url: result.url }, "Image uploaded successfully")
    );
});

const updateNote = asyncHandler(async (req, res) => {
    const { noteId } = req.params;
    const { title, content, color, isArchived, isTrash, isPinned, removedImages, checklists, reminder, labels } = req.body;

    const note = await Note.findById(noteId);
    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    if (note.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You do not have permission to update this note");
    }

    if (removedImages) {
        const removed = typeof removedImages === 'string' ? JSON.parse(removedImages) : removedImages;
        note.images = note.images.filter(img => !removed.includes(img));
    }

    const imageLocalPaths = req.files?.map(file => file.path) || [];
    if (imageLocalPaths.length > 0) {
        for (const path of imageLocalPaths) {
            const result = await uploadOnCloudinary(path);
            if (result) {
                note.images.push(result.url);
            }
        }
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (color !== undefined) note.color = color;
    if (isArchived !== undefined) note.isArchived = isArchived;
    if (isTrash !== undefined) note.isTrash = isTrash;
    if (isPinned !== undefined) note.isPinned = isPinned;
    if (reminder !== undefined) note.reminder = reminder === "" ? null : reminder;

    if (checklists) {
        try {
            note.checklists = typeof checklists === 'string' ? JSON.parse(checklists) : checklists;
        } catch (error) {
            throw new ApiError(400, "Invalid checklist format");
        }
    }

    if (labels) {
        try {
            note.labels = typeof labels === 'string' ? JSON.parse(labels) : labels;
        } catch (error) {
            throw new ApiError(400, "Invalid labels format");
        }
    }

    await note.save();

    return res.status(200).json(
        new ApiResponse(200, note, "Note updated successfully")
    );
});

const deleteNote = asyncHandler(async (req, res) => {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);
    if (!note) throw new ApiError(404, "Note not found");
    if (note.userId.toString() !== req.user._id.toString()) throw new ApiError(403, "Unauthorized");

    await Note.findByIdAndDelete(noteId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Note deleted permanently")
    );
});

export {
    createNote,
    getNotes,
    uploadImage,
    updateNote,
    deleteNote
};
