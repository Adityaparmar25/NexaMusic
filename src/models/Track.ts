import { Schema, model, models } from "mongoose";

const TrackSchema = new Schema(
  {
    title:       { type: String, required: true, trim: true },
    artist:      { type: String, required: true, trim: true },
    album:       { type: String, trim: true },
    genre:       { type: [String], default: [] },
    duration:    { type: Number, required: true, min: 0 },
    driveFileId: { type: String, trim: true },
    coverArtUrl: { type: String, trim: true },  // stored name in DB
    featured:    { type: Boolean, default: false },
    playCount:   { type: Number,  default: 0, min: 0 },
    order:       { type: Number,  default: 0 },
    isActive:    { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

TrackSchema.virtual("src").get(function () {
  if (this.driveFileId) {
    return `https://drive.google.com/uc?export=download&id=${this.driveFileId}`;
  }
  return "";
});

TrackSchema.virtual("cover").get(function () {
  return this.coverArtUrl ?? "";
});

TrackSchema.index({ isActive: 1, order: 1 });
TrackSchema.index({ isActive: 1, featured: 1 });
TrackSchema.index({ title: "text", artist: "text" });

export const TrackModel = models.Track ?? model("Track", TrackSchema);