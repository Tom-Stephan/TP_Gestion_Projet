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
    history: [
      {
        action: String,
        date: String,
        gain: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);



// Virtual for Title based on level
userSchema.virtual('title').get(function () {
  const lvl = Math.floor((this.wallet_points || 0) / 1000) + 1;
  if (lvl < 2) return 'Moussaillon';
  if (lvl < 5) return 'Matelot';
  if (lvl < 10) return 'Quartier-Maitre';
  if (lvl < 20) return 'Capitaine';
  return 'Légende des Mers';
});

module.exports = mongoose.model("User", userSchema);
