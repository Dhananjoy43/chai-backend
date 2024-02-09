import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    if (!name || !description) throw new ApiError(400, 'Please provide all fields');
    //TODO: create playlist
    try {
        const playlist = await Playlist.create({
            name,
            description,
            owner: req.user._id
        })

        if (!playlist) {
            throw new ApiError(400, "Insufficient information to create playlist")
        }

        return res.status(200).json(new ApiResponse(200, playlist, "Playlist created successfully"))
    } catch (error) {
        throw new ApiError(error?.statusCode || 500, error.message || "Error occured while creating the playlist")
    }
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    //TODO: get user playlists
    try {
        const playlists = await Playlist.findOne({ owner: userId });
        if (!playlists) {
            throw new ApiError(400, "No playlist found");
        }
        return res.status(200).json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
    } catch (error) {
        throw new ApiError(error?.statusCode || 500, error?.message || "Cannot get the playlists");

    }
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id
    try {
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            throw new ApiError(400, "Playlist cannot be found");
        }
        return res.status(200).json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
    } catch (error) {
        throw new ApiError(error?.statusCode || 500, error?.message || "Cannot get the playlist");
    }
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    try {
        const playlist = await Playlist.findByIdAndUpdate(playlistId, { $push: { videos: videoId } }, { new: true });

        if (!playlist) {
            throw new ApiError(404, "Playlist not found");
        }

        return res.status(200).json(new ApiResponse(200, playlist, "video added to the playlist"));
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Error occured  while adding the video to the playlist");
    }
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist
    try {
        const playlist = await Playlist.findByIdAndUpdate(playlistId, { $pull: { videos: { _id: videoId } } }, { new: true });

        if (!playlist) {
            throw new ApiError(400, "Playlist not found");
        }

        return res.status(200).json(new ApiResponse(200, playlist, "Video removed from playlist"));
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Error occured  while removing the video from the playlist");
    }

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist
    try {
        const playlist = await Playlist.findByIdAndDelete(playlistId);
        if (!playlist) {
            throw new ApiError(400, "Error occured while deleting the playlist");
        }
        return res.status(200).json(new ApiResponse(200, [], "Playlist deleted"));
    } catch (error) {
        throw new ApiError(error?.statusCode || 500, error?.message || "Error occured while deleting the playlist");
    }
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    if (!name && !description) {
        throw new ApiError(401, "Atleast one field is required");
    }
    //TODO: update playlist
    try {
        const playlist = await Playlist.findByIdAndUpdate(playlistId, {
            name,
            description
        }, { new: true });

        if (!playlist) {
            throw new ApiError(404, "Playlist not found");
        }

        return res.status(200).json(new ApiResponse(200, playlist, "Playlist updated"));
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Error occured  while updating the playlist");
    }

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
