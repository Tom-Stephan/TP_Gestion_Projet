const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = 'mongodb://localhost:27017/zero_dechets';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('Connected to DB');
        const users = await User.find({});
        console.log('Users in DB:');
        users.forEach(u => console.log(`${u.email} - ${u.password}`));

        // Check specific user
        const lucas = await User.findOne({ email: 'lucas@example.com' });
        console.log('Lucas search:', lucas);

        mongoose.connection.close();
    })
    .catch(err => console.error(err));
