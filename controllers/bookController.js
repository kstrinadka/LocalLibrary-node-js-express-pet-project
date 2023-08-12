import Book from "../models/book.js";
import Author from "../models/author.js";
import Genre from "../models/genre.js";
import BookInstance from "../models/bookinstance.js";
import async from "async";
import expressAsyncHandler from "express-async-handler";

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
export function book_create_get(req, res) {
    res.send("NOT IMPLEMENTED: Book create GET");
}

// Handle book create on POST.
export function book_create_post(req, res) {
    res.send("NOT IMPLEMENTED: Book create POST");
}

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
