import Book from "../models/book.js";
import Author from "../models/author.js";
import Genre from "../models/genre.js";
import BookInstance from "../models/bookinstance.js";
import expressAsyncHandler from "express-async-handler";
import {body, validationResult} from "express-validator";

export async function index(req, res) {
    try {
        // Используем await для каждого запроса и сохраняем результаты в переменных
        const book_count = await Book.countDocuments({});
        const book_instance_count = await BookInstance.countDocuments({});
        const book_instance_available_count = await BookInstance.countDocuments({ status: "Available" });
        const author_count = await Author.countDocuments({});
        const genre_count = await Genre.countDocuments({});

        // Передаем результаты в шаблон
        res.render("index", {
            title: "Local Library Home",
            data: {
                book_count,
                book_instance_count,
                book_instance_available_count,
                author_count,
                genre_count
            }
        });
    } catch (err) {
        // Обрабатываем ошибки
        res.render("index", {
            title: "Local Library Home",
            error: err,
            data: null
        });
    }
}

// Display list of all Books.
export async function book_list(req, res, next) {
    try {
        // Используем await для запроса и сохраняем результат в переменной
        const list_books = await Book.find({}, "title author")
            .populate("author");
        // Успешно, поэтому рендерим
        res.render("book_list", { title: "Book List", book_list: list_books });
    } catch (err) {
        // Обрабатываем ошибку
        return next(err);
    }
}



// Display detail page for a specific book.
export const book_detail = expressAsyncHandler
        (async (req, res, next) => {

    // Get details of books, book instances for specific book
    const [book, bookInstances] = await Promise.all([
        Book.findById(req.params.id).populate("author").populate("genre").exec(),
        BookInstance.find({ book: req.params.id }).exec(),
    ]);

    if (book === null) {
        // No results.
        const err = new Error("Book not found");
        err.status = 404;
        return next(err);
    }

    res.render("book_detail", {
        title: book.title,
        book: book,
        book_instances: bookInstances,
    });
});

// Display book create form on GET.
export const book_create_get = expressAsyncHandler(async (req, res, next) => {

    // Get all authors and genres, which we can use for adding to our book.
    const [allAuthors, allGenres] = await Promise.all([
        Author.find().exec(),
        Genre.find().exec(),
    ]);

    res.render("book_form", {
        title: "Create Book",
        authors: allAuthors,
        genres: allGenres,
    });
});


// Handle book create on POST.
// Handle book create on POST.
export const book_create_post = [

    // Convert the genre to an array.
    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === "undefined") req.body.genre = [];
            else req.body.genre = new Array(req.body.genre);
        }
        next();
    },

    // Validate and sanitize fields.
    body("title", "Title must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("author", "Author must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("summary", "Summary must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
    body("genre.*").escape(),

    // Process request after validation and sanitization.
    expressAsyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            const [allAuthors, allGenres] = await Promise.all([
                Author.find().exec(),
                Genre.find().exec(),
            ]);

            // Mark our selected genres as checked.
            for (const genre of allGenres) {
                if (book.genre.includes(genre._id)) {
                    genre.checked = "true";
                }
            }

            res.render("book_form", {
                title: "Create Book",
                authors: allAuthors,
                genres: allGenres,
                book: book,
                errors: errors.array(),
            });
        } else {
            // Data from form is valid. Save book.
            await book.save();
            res.redirect(book.url);
        }
    }),
];


// Display book delete form on GET.
export function book_delete_get(req, res) {
    res.send("NOT IMPLEMENTED: Book delete GET");
}

// Handle book delete on POST.
export function book_delete_post(req, res) {
    res.send("NOT IMPLEMENTED: Book delete POST");
}

// Display book update form on GET.
export function book_update_get(req, res) {
    res.send("NOT IMPLEMENTED: Book update GET");
}

// Handle book update on POST.
export function book_update_post(req, res) {
    res.send("NOT IMPLEMENTED: Book update POST");
}
