"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTrackData = exports.saveOrUpdateTrack = void 0;
const track_model_1 = __importDefault(require("../models/track.model"));
const saveOrUpdateTrack = async (trackData) => {
    await track_model_1.default.findOneAndUpdate({ _id: trackData._id }, trackData, {
        upsert: true,
    });
};
exports.saveOrUpdateTrack = saveOrUpdateTrack;
const extractTrackData = (row) => {
    return {
        id: row['ID'],
        title: row['Title'],
        isrc: row['ISRC'].replace(/[^a-zA-Z0-9]/g, ''),
        contractId: row['Contract'],
        aliases: (row['Aliases']) ? (row['Aliases'])
            .split(';')
            .map((alias) => alias.trim()) : [],
        artist: row['Artist'],
        version: row['Version'],
        pLine: row['P Line'],
    };
};
exports.extractTrackData = extractTrackData;
