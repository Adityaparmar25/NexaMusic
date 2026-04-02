
// ═══════════════════════════════════════════
//  scripts/seed-tracks.ts
//  Optional: seeds sample tracks into MongoDB.
//  Run: npx ts-node scripts/seed-tracks.ts
// ═══════════════════════════════════════════
import mongoose from "mongoose";
import dotenv   from "dotenv";

dotenv.config({ path: ".env.local" });

// Inline schema to avoid circular imports in script context
const TRACK_SCHEMA = new mongoose.Schema({
  title: String, artist: String, album: String,
  genre: [String], duration: Number, driveFileId: String,
  coverArtUrl: String, featured: Boolean,
  playCount: { type: Number, default: 0 },
  order: Number, isActive: { type: Boolean, default: true },
}, { timestamps: true });

const SEED_DATA = [
  { title:"Midnight Dreams", artist:"Luna Eclipse",    album:"Cosmic Vibes",       genre:["Lo-Fi","Chill"],       duration:213, featured:true,  playCount:1247, order:1, coverArtUrl:"https://picsum.photos/seed/nex1/400/400" },
  { title:"Electric Pulse",  artist:"Neon Circuits",   album:"Digital Horizon",    genre:["Hype","Electronic"],   duration:186, featured:true,  playCount:892,  order:2, coverArtUrl:"https://picsum.photos/seed/nex2/400/400" },
  { title:"Forest Walk",     artist:"Acoustic Soul",   album:"Nature's Call",      genre:["Acoustic","Ambient"],  duration:241, featured:false, playCount:634,  order:3, coverArtUrl:"https://picsum.photos/seed/nex3/400/400" },
  { title:"Jazz in the Rain",artist:"Miles & Friends", album:"Rainy Nights",       genre:["Jazz","Chill"],        duration:198, featured:false, playCount:445,  order:4, coverArtUrl:"https://picsum.photos/seed/nex4/400/400" },
  { title:"City Lights",     artist:"Urban Groove",    album:"Metropolitan",       genre:["Electronic","Hype"],   duration:225, featured:true,  playCount:2103, order:5, coverArtUrl:"https://picsum.photos/seed/nex5/400/400" },
  { title:"Serene Valley",   artist:"Nature Beats",    album:"Earthly Sounds",     genre:["Ambient","Chill"],     duration:312, featured:false, playCount:378,  order:6, coverArtUrl:"https://picsum.photos/seed/nex6/400/400" },
  { title:"Lo-Fi Study",     artist:"ChillHop Master", album:"Study Beats Vol.2",  genre:["Lo-Fi","Chill"],       duration:267, featured:true,  playCount:3421, order:7, coverArtUrl:"https://picsum.photos/seed/nex7/400/400" },
  { title:"Mountain Echo",   artist:"Sky Voyager",     album:"Above The Clouds",   genre:["Acoustic","Ambient"],  duration:189, featured:false, playCount:521,  order:8, coverArtUrl:"https://picsum.photos/seed/nex8/400/400" },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error("❌  MONGODB_URI not set"); process.exit(1); }

  await mongoose.connect(uri, { dbName: "nexamusic" });
  const Track = mongoose.models.Track ?? mongoose.model("Track", TRACK_SCHEMA);

  const count = await Track.countDocuments();
  if (count > 0) {
    console.log(`ℹ️  Tracks already exist (${count}). Skipping seed.`);
    await mongoose.disconnect();
    return;
  }

  await Track.insertMany(SEED_DATA.map((t) => ({ ...t, isActive: true })));
  console.log(`✅  Seeded ${SEED_DATA.length} tracks.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });