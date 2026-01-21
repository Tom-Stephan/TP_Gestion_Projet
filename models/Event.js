const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    titre: { 
        type: String, 
        required: true 
    },
    lat: { 
        type: Number, 
        required: true 
    },
    lon: { 
        type: Number, 
        required: true 
    },
    type_dechet: { 
        type: String, 
        required: true 
    },
    poids_estime: { 
        type: Number // Poids en kg
    },
    createur_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    est_valide: { 
        type: Boolean, 
        default: false 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Event', eventSchema);
