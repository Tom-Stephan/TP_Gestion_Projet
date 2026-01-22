const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/scan/upload
// Simulate image analysis and waste declaration
// Returns: Success status, rewards (coins, xp), and updated user stats
router.post('/upload', async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Simulate "AI" Logic: Random Reward
        const earnedCoins = Math.floor(Math.random() * (150 - 50 + 1)) + 50; // Random between 50 and 150
        const earnedXp = 50; // Fixed XP for standard waste
        const weightAdd = 0.1; // 100g simulated

        // Update User Stats
        user.wallet_points = (user.wallet_points || 0) + earnedCoins;
        user.xp = (user.xp || 0) + earnedXp; // Note: Leveling up logic could be here, but using virtuals/frontend for now
        
        // Ensure stats object exists
        if (!user.stats) user.stats = {};
        user.stats.weight = (user.stats.weight || 0) + weightAdd;
        user.stats.missions = (user.stats.missions || 0) + 1; // Count as a "mission" or activity

        // Add to history
        if (!user.history) user.history = [];
        user.history.unshift({
            action: 'Déchet Ramassé',
            date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
            gain: `+${earnedCoins} 💰`
        });
        
        // Trim history if too long
        if (user.history.length > 20) user.history = user.history.slice(0, 20);

        await user.save();

        // Simulate network/analysis delay is handled in Frontend, 
        // but checking connection is fast.
        
        res.json({
            message: 'Scan validated',
            rewards: {
                coins: earnedCoins,
                xp: earnedXp,
                type: 'Plastique' // Hardcoded for MVP, or random
            },
            user: user // Return updated user to sync frontend
        });

    } catch (err) {
        console.error('Scan Upload Error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
