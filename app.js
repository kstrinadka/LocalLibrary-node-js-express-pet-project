// import connectToDB from "./database/db.js";


import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import mongoose from "mongoose";
import {PORT} from "./bin/www.js";
import catalogRouter from "./routes/catalog.js"; //Import routes for "catalog" area of site

const DB_URL = 'mongodb+srv://user:user@cluster0.cyb4frz.mongodb.net/?retryWrites=true&w=majority'

var app = express();

// view engine setup
app.set('views', path.join(path.resolve(), 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/catalog", catalogRouter); // Add catalog routes to middleware chain.

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


async function startApp() {
  try {
    await mongoose.connect(DB_URL,  {useUnifiedTopology: true, useNewUrlParser: true})
    app.listen(PORT, () => console.log("SERVER STARTED ON PORT" + PORT))
  } catch (e) {
    console.log(e)
  }
}

startApp()


export default app;
// module.exports = app;
