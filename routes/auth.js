const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email, password });

        // Check if user exists
        const user = await User.findOne({ email }).populate('clan_id');

        if (!user) {
            console.log('User not found in DB');
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        console.log('User found:', user.email);

        // Simple password check (plaintext as requested for TP)
        if (password !== user.password) {
            console.log('Password mismatch');
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        // Return user data
        res.json(user);

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { pseudo, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        // Create new user
        const newUser = new User({
            pseudo,
            email,
            password, // PlainText for TP
            wallet_points: 0,
            xp: 0,
            level: 1,
            title: 'Moussaillon',
            inventory_cards: [],
            history: [],
            stats: { weight: 0, missions: 0 }
        });

        await newUser.save();

        console.log('New user created:', newUser.email);
        res.status(201).json(newUser);

    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Erreur lors de l\'inscription' });
    }
});

module.exports = router;
