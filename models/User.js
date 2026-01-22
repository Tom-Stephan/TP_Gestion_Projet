const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "default_avatar.png",
    },
    wallet_points: {
      type: Number,
      default: 0,
    },
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    clan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clan",
    },
    inventory_cards: [
      {
        type: String, // Stocke les IDs ou noms des cartes collectées
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
