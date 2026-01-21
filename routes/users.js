const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users/top-contributors
// Returns top 3 users by wallet_points
router.get('/top-contributors', async (req, res) => {
    try {
        const topUsers = await User.find({})
            .sort({ wallet_points: -1 })
            .limit(3)
            .populate('clan_id', 'nom faction couleur_hex');
            
        res.json(topUsers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
