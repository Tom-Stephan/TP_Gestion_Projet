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

// GET /api/clans
// List all clans (for directory/leaderboard)
router.get('/', async (req, res) => {
    try {
        // Fetch specific fields, maybe sort by total_points descending
        const clans = await Clan.find({})
            .select('nom slogan faction total_points score_actuel couleur_hex members')
            .sort({ total_points: -1 });
        
        // Return array with member count computed if needed, or just length in frontend
        res.json(clans);
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

// GET /api/clans/:id
// Get clan details with members
router.get('/:id', async (req, res) => {
    try {
        const clan = await Clan.findById(req.params.id)
            .populate({
                path: 'members',
                select: 'pseudo avatar wallet_points', // Level/Title are virtuals
                options: { sort: { wallet_points: -1 } } // Sort by score (wallet_points) descending
            });

        if (!clan) {
            return res.status(404).json({ message: 'Clan non trouvé' });
        }
        res.json(clan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/clans/:id/join
router.post('/:id/join', async (req, res) => {
    try {
        const { userId } = req.body;
        const clanId = req.params.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.clan_id) {
            return res.status(400).json({ message: 'Vous avez déjà un clan ! Quittez-le d\'abord.' });
        }

        const clan = await Clan.findById(clanId);
        if (!clan) return res.status(404).json({ message: 'Clan not found' });

        // Add to clan members
        if (!clan.members.includes(userId)) {
            clan.members.push(userId);
            // Update total points (simple addition)
            clan.total_points += user.wallet_points || 0;
            // Update score_actuel potentially? keeping it synced
            clan.score_actuel += user.wallet_points || 0; 
            await clan.save();
        }

        // Update user
        user.clan_id = clan._id;
        await user.save();

        // Return updated clan with members populated for UI
        const updatedClan = await Clan.findById(clanId).populate('members', 'pseudo avatar wallet_points');
        res.json(updatedClan);

    } catch (err) {
        console.error('Join error:', err);
        res.status(500).json({ message: err.message });
    }
});

// POST /api/clans/leave
router.post('/leave', async (req, res) => {
    try {
        const { userId } = req.body;
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.clan_id) {
            return res.status(400).json({ message: 'Vous n\'avez pas de clan à quitter.' });
        }

        const clanId = user.clan_id;
        const clan = await Clan.findById(clanId);

        if (clan) {
            // Remove user from members
            clan.members = clan.members.filter(id => id.toString() !== userId);
            
            // Subtract points
            clan.total_points = Math.max(0, clan.total_points - (user.wallet_points || 0));
            
            // Handle Chef leaving case (simple MVP: if members empty, delete clan? if not, assign random new chef?)
            if (clan.chef_id && clan.chef_id.toString() === userId) {
                 if (clan.members.length > 0) {
                     // Promote first member
                     clan.chef_id = clan.members[0];
                 } else {
                     // Empty clan -> could delete, but let's just keep it or handled externally.
                     clan.chef_id = null;
                 }
            }

            await clan.save();
        }

        // Update User
        user.clan_id = null;
        await user.save();

        res.json({ message: 'Clan quitté avec succès', user });

    } catch (err) {
        console.error('Leave error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
