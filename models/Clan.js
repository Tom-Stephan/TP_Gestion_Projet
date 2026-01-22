const mongoose = require('mongoose');

const clanSchema = new mongoose.Schema({
    nom: { 
        type: String, 
        required: true, 
        unique: true 
    },
    slogan: {
        type: String,
        trim: true
    },
    faction: { 
        type: String, 
        // Removing strict enum to allow custom clan types if needed, or keep 'Corsaires'/'Krakens' if they map specific colors. 
        // For now, making it just a String to be flexible with the new "Colors/Factions" requirement.
        required: false 
    },
    chef_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    total_points: { 
        type: Number, 
        default: 0 
    },
    score_actuel: { 
        type: Number, 
        default: 0 
    },
    couleur_hex: { 
        type: String, 
        // Allow hex or tailwind class strings if needed, but existing regex is specific to hex.
        // Prompt says "format Hex OR Tailwind class". Let's relax validation or assume frontend sends Hex.
        // I will keep validation simple or remove match for flexibility if tailwind classes are stored.
        // Let's remove regex to allow Tailwind classes like 'bg-red-500'.
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Méthode virtuelle pour calculer le rang basé sur les points
clanSchema.virtual('rank').get(function() {
    if (this.total_points < 1000) return 'Moussaillon';
    if (this.total_points < 5000) return 'Quartier-Maitre';
    if (this.total_points < 10000) return 'Capitaine';
    return 'Amiral';
});

module.exports = mongoose.model('Clan', clanSchema);
