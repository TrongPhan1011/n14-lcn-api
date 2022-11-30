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
const otpRoute = require('./src/routes/otpRoute');
const fileRoute = require('./src/routes/fileRoute');

const app = express();

dotenv.config();

// CONNECT DB
mongoose.connect(process.env.DATABASE_URL, () => {
    console.log('Connect db success!');
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(
    cors({
        origin: process.env.URL_FRONTEND,
        credentials: true,
        origin: true,
    }),
);
app.use(morgan('common'));
app.use(cookieParser());

app.use('/api/user', userRoute);
app.use('/api/chat', groupChat);
app.use('/api/message', messageRoute);
app.use('/api/auth', authRoute);
app.use('/api/otp', otpRoute);
app.use('/api/file', fileRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log('server is running...');
});
