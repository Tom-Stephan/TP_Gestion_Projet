const mongoose = require('mongoose');

const clanSchema = new mongoose.Schema({
    nom: { 
        type: String, 
        required: true, 
        unique: true 
    },
    faction: { 
        type: String, 
        enum: ['Corsaires', 'Krakens'], 
        required: true 
    },
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
        match: /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
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
