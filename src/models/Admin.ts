
// ═══════════════════════════════════════════
//  models/Admin.ts
// ═══════════════════════════════════════════
import { Schema, model, models } from "mongoose";

const AdminSchema = new Schema(
  {
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name:         { type: String, trim: true },
    role:         { type: String, default: "admin", enum: ["admin", "superadmin"] },
    lastLoginAt:  { type: Date },
  },
  { timestamps: true }
);

export const AdminModel = models.Admin ?? model("Admin", AdminSchema);