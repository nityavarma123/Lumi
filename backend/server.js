const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

require('dotenv').config({ path: `${__dirname}/.env` });
dotenv.config();
connectDB();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/study', require('./routes/study.routes'));
app.use('/api/sleep', require('./routes/sleep.routes'));
app.use('/api/nutrition', require('./routes/nutrition.routes'));
app.use('/api/activity', require('./routes/activity.routes'));
app.use('/api/schedule', require('./routes/schedule.routes'));
app.use('/api/chat', require('./routes/chat.routes'));

app.get('/api/health', (_, res) => res.json({ status: 'ok', env: process.env.NODE_ENV }));
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🌟 lumi  →  http://localhost:${PORT}`));
