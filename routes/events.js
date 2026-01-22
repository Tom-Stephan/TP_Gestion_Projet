const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User'); // Creator lookup if needed

// GET /api/events
// List all active rallies
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().populate('createur_id', 'pseudo clan_id');
        
        // Transform to match frontend expectations
        const formattedEvents = events.map(e => ({
            _id: e._id,
            titre: e.titre,
            date: e.createdAt, // Or specific event date if added to schema
            location: {
                lat: e.lat,
                lng: e.lon
            },
            description: `${e.type_dechet} (${e.poids_estime}kg)`, // Simplified description
            creator_id: e.createur_id?._id,
            faction: 'Rallye', // Default for now
            type: 'Rallye'
        }));

        res.json(formattedEvents);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/events
// Create a new rally
router.post('/', async (req, res) => {
    try {
        const { title, date, location, description, creator_id, faction } = req.body;

        if (!title || !location || !location.lat || !location.lng) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newEvent = new Event({
            titre: title,
            lat: location.lat,
            lon: location.lng,
            type_dechet: 'Rallye', // Default type
            poids_estime: 0,
            createur_id: creator_id, // Ensure this ID is valid Object ID in frontend
            est_valide: true
        });

        const savedEvent = await newEvent.save();

        // Return in expected format
        res.status(201).json({
            _id: savedEvent._id,
            titre: savedEvent.titre,
            date: savedEvent.createdAt,
            location: { lat: savedEvent.lat, lng: savedEvent.lon },
            description: description || 'Rallye User',
            creator_id,
            faction: faction || 'Neutre',
            type: 'Rallye'
        });
    } catch (err) {
        console.error("Create event error", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
