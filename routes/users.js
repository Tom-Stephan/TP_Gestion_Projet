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

// PUT /api/users/:id
// Updates wallet and inventory
router.put('/:id', async (req, res) => {
    try {
        const { wallet_points, inventory_cards } = req.body;

        // Construct update object safely
        const updateData = {};
        if (wallet_points !== undefined) updateData.wallet_points = wallet_points;
        if (inventory_cards !== undefined) updateData.inventory_cards = inventory_cards;
        if (req.body.xp !== undefined) updateData.xp = req.body.xp;
        if (req.body.level !== undefined) updateData.level = req.body.level;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true } // Return updated doc
        ).populate('clan_id');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ message: 'Server error during update' });
    }
});

module.exports = router;
