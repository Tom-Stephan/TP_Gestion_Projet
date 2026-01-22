const express = require('express');
const router = express.Router();
const Clan = require('../models/Clan');
const User = require('../models/User');

// GET /api/clans/war-stats
// Returns the two factions and their scores
router.get('/war-stats', async (req, res) => {
    try {
        const clans = await Clan.find({});
        // Transform user-friendly data if needed
        const stats = {
            corsaires: clans.find(c => c.faction === 'Corsaires') || { score_actuel: 0 },
            krakens: clans.find(c => c.faction === 'Krakens') || { score_actuel: 0 }
        };
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/clans
// Create a new clan
router.post('/', async (req, res) => {
    console.log('POST /api/clans called with:', req.body);
    try {
        const { name, slogan, color, userId } = req.body;

        if (!name || !userId) {
            return res.status(400).json({ message: 'Nom du clan et ID utilisateur requis' });
        }

        // Check if clan name exists
        const existingClan = await Clan.findOne({ nom: name });
        if (existingClan) {
            console.log('Clan name already exists:', name);
            return res.status(400).json({ message: 'Ce nom de clan est déjà pris !' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        if (user.clan_id) {
             // Optional: Allow switching clans? For now, assume fresh creation or overwrite.
             // If strictly "Founding", usually implies leaving old one.
             // Let's just proceed.
             console.log('User already has a clan, switching...');
        }

        const newClan = new Clan({
            nom: name,
            slogan: slogan,
            couleur_hex: color,
            chef_id: user._id,
            members: [user._id],
            faction: 'Custom', // Default or derived from color
            total_points: 0,
            score_actuel: 0
        });

        const savedClan = await newClan.save();
        console.log('Clan created:', savedClan._id);

        // Update User
        user.clan_id = savedClan._id;
        await user.save();
        console.log('User updated with new clan ID');

        res.status(201).json(savedClan);

    } catch (err) {
        console.error('Error creating clan:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
