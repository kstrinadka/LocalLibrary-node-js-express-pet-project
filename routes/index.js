import express from "express";
import PostController from "../controller/PostController.js";

var indexRouter = express.Router();
// let router = express.Router();

/* GET home page. */
// indexRouter.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// GET home page.
indexRouter.get("/", function (req, res) {
  res.redirect("/catalog");
});

// создадим маршруты для всех операций
// router.post('/posts', PostController.create)
// router.get('/posts', PostController.getAll)
// router.get('/posts/:id', PostController.getOne)
// router.put('/posts', PostController.update)
// router.delete('/posts/:id', PostController.delete)

export default indexRouter;
