
// ═══════════════════════════════════════════
//  scripts/seed-admin.ts
//  Run once: npx ts-node scripts/seed-admin.ts
//  Creates the first admin user in MongoDB.
// ═══════════════════════════════════════════
import mongoose from "mongoose";
import bcrypt   from "bcryptjs";
import dotenv   from "dotenv";

dotenv.config({ path: ".env.local" });

const ADMIN_SCHEMA = new mongoose.Schema({
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name:         { type: String },
  role:         { type: String, default: "admin" },
  lastLoginAt:  { type: Date },
}, { timestamps: true });

async function seed() {
  const uri   = process.env.MONGODB_URI;
  const email = process.env.ADMIN_SEED_EMAIL;
  const pass  = process.env.ADMIN_SEED_PASSWORD;

  if (!uri || !email || !pass) {
    console.error("❌  Missing env vars: MONGODB_URI, ADMIN_SEED_EMAIL, ADMIN_SEED_PASSWORD");
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName: "nexamusic" });

  const Admin = mongoose.models.Admin ?? mongoose.model("Admin", ADMIN_SCHEMA);

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`ℹ️  Admin already exists: ${email}`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(pass, 12);
  await Admin.create({ email, passwordHash, name: "NexaMusic Admin", role: "admin" });

  console.log(`✅  Admin created: ${email}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});