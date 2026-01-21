const express = require('express');
const router = express.Router();
const Clan = require('../models/Clan');

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

module.exports = router;
