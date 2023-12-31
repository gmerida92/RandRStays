const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { environment } = require('./config');
const isProduction = environment === 'production';

const routes = require('./routes');

const app = express();

app.use(morgan('dev'));

app.use(cookieParser());
app.use(express.json());

//Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
);

// Set the _csrf token and create req.csrfToken method
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);

// backend/app.js
app.use(routes); // Connect all the routes

module.exports = app;


// // backend/app.js
// const routes = require('./routes');
// const { sequelize } = require('./db/models');

// app.use(routes); // connect all the routes

// // backend/app.js
// // Catch unhandled requests and forward to error handler.
// app.use((req, res, next) => {
//     const err = new Error("The requested resource couldn't be found.");
// });