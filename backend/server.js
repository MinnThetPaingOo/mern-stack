const express = require('express')
require('dotenv').config()
var morgan = require('morgan')
const recipesroute = require('./routes/recipes')
const userRoute = require('./routes/users')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const AuthMiddleware = require('./middlewares/AuthMiddleware')
const cron = require('node-cron');
const sendEmail = require('./helpers/sendEmail');

const app = express()
const port = process.env.PORT || 3000
mongoose.set('debug', true);
const mongoUrl = 'mongodb+srv://thetpaingoo2k20:test123@cluster0.aapue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(mongoUrl)
    .then(() => {
        console.log("connect to db")
        app.listen(port, () => {
            console.log("server is running at " + process.env.PORT)
            // cron.schedule('*/4 * * * * *', () => {
            //     console.log('running a task every 4 seconds');
            // });
        })
    })
    .catch(err => console.error('MongoDB connection error:', err));

app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
))
app.use(express.json())
app.use(express.static('public'))
app.use(morgan('dev'))
app.use(cookieParser())

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('email');
});

app.use('/api/recipes', AuthMiddleware, recipesroute)
app.use('/api/users', userRoute)

app.get('/set-cookie', (req, res) => {
    res.cookie('name', 'thetpaingoo');
    res.cookie('important-key', 'value', { httpOnly: true });

    return res.send("cookie already set")
})

app.get('/get-cookie', (req, res) => {
    let cookies = req.cookies
    return res.send(cookies)
})

app.get('/sendemail', async (req, res) => {
    try {
        await sendEmail({
            view: 'email',
            data: {
                name: "AungAung"
            },
            from: "mgmg@gmail.com",
            to: "aungaung@gmail.com",
            subject: "Hello AungAung"
        });
        return res.send('email already sent');
    } catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500
        })
    }
})


