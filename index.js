const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const userRoute = require('./src/routes/userRoute');
const groupChat = require('./src/routes/groupChatRoute');
const messageRoute = require('./src/routes/messageRoute');
const authRoute = require('./src/routes/autthRoute');

const app = express();

dotenv.config();

// CONNECT DB
mongoose.connect(process.env.DATABASE_URL, () => {
    console.log('Connect db success!');
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors({ credentials: true, origin: true }));
app.use(morgan('common'));
app.use(cookieParser());

app.use('/api/user', userRoute);
app.use('/api/chat', groupChat);
app.use('/api/message', messageRoute);
app.use('/api/auth', authRoute);

app.listen(8080, () => {
    console.log('server is running...');
});
