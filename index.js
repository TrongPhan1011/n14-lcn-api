const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');

const userRoute = require('./src/routes/userRoute');
const groupChat = require('./src/routes/groupChatRoute');

const app = express();

dotenv.config();

// CONNECT DB
mongoose.connect(process.env.DATABASE_URL, () => {
    console.log('Connect db success!');
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());
app.use(morgan('common'));

app.use('/api/user', groupChat);

app.use('/api/chat/', groupChat);

app.listen(8080, () => {
    console.log('server is running...');
});
