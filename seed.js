const mongoose = require('mongoose');
const Clan = require('./models/Clan');
const User = require('./models/User');
const Event = require('./models/Event');
const fs = require('fs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/zero_dechets';

const seedData = JSON.parse(fs.readFileSync('./seed_data.json', 'utf-8'));

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('🌱 Connected to MongoDB for Seeding...');

    // Clear DB
    await Clan.deleteMany({});
    await User.deleteMany({});
    await Event.deleteMany({});
    console.log('🧹 Database Cleared.');

    // Log ids map for reference
    const idsMap = {};

    // 1. Insert Clans
    // Need to handle ObjectIDs from JSON manually if raw insert, 
    // or let Mongoose create them if we don't care about preserving exact IDs from JSON.
    // However, Users reference Clan IDs, so we must preserve them or remap them.
    // The JSON uses "$oid". We need to clean that.
    
    // Helper to sanitize $oid
    const sanitize = (obj) => {
        const newObj = { ...obj };
        if (newObj._id && newObj._id.$oid) newObj._id = newObj._id.$oid;
        
        // Handle refs
        for (const key in newObj) {
            if (newObj[key] && typeof newObj[key] === 'object' && newObj[key].$oid) {
                newObj[key] = newObj[key].$oid;
            }
        }
        return newObj;
    };

    const clans = seedData.clans.map(sanitize);
    await Clan.insertMany(clans);
    console.log(`✅ Inserted ${clans.length} Clans`);

    const users = seedData.users.map(sanitize);
    await User.insertMany(users);
    console.log(`✅ Inserted ${users.length} Users`);

    const events = seedData.events.map(sanitize);
    await Event.insertMany(events);
    console.log(`✅ Inserted ${events.length} Events`);

    console.log('🏁 Seeding Complete!');
    process.exit(0);
})
.catch(err => {
    console.error('❌ Seeding Failed:', err);
    process.exit(1);
});
