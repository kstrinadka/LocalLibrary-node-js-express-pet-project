import BookInstance from "../models/bookinstance.js";
import Book from "../models/book.js";
import expressAsyncHandler from "express-async-handler";
import {body, validationResult} from "express-validator";


// Display list of all BookInstances.
export async function bookinstance_list(req, res, next) {
    try {
        const list_bookinstances = await BookInstance.find({})
            .populate("book");

        res.render("bookinstance_list", {
            title: "Book Instance List",
            bookinstance_list: list_bookinstances,
        })
    } catch (err) {
        return next(err);
    }
}


// Display detail page for a specific BookInstance.
export const bookinstance_detail = expressAsyncHandler
        (async (req, res, next) => {

    const bookInstance = await BookInstance.findById(req.params.id)
        .populate("book")
        .exec();

    if (bookInstance === null) {
        // No results.
        const err = new Error("Book copy not found");
        err.status = 404;
        return next(err);
    }

    res.render("bookinstance_detail", {
        title: "Book:",
        bookinstance: bookInstance,
    });
});


// Display BookInstance create form on GET.
export async function bookinstance_create_get(req, res, next) {
    try {
        const books = await Book.find({}, "title")

        res.render("bookinstance_form", {
            title: "Create BookInstance",
            book_list: books,
        });
    } catch (err) {
        next(err);
    }
}

// Handle BookInstance create on POST.
export const bookinstance_create_post = [
    // Validate fields.
    body("book", "Book must be specified").isLength({min: 1}).trim(),
    body("imprint", "Imprint must be specified").isLength({min: 1}).trim(),
    body("due_back", "Invalid date").optional({checkFalsy: true}).isISO8601(),

    // Sanitize fields.
    body("book").escape(),
    body("imprint").escape(),
    body("status").trim().escape(),
    body("due_back").toDate(),

    // Process request after validation and sanitization.
    async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
        var bookinstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
        });

        try {
            if (!errors.isEmpty()) {
                // There are errors. Render form again with sanitized values and error messages.
                const books = Book.find({}, "title")

                // Successful, so render.
                res.render("bookinstance_form", {
                    title: "Create BookInstance",
                    book_list: books,
                    selected_book: bookinstance.book._id,
                    errors: errors.array(),
                    bookinstance: bookinstance,
                });
            } else {
                await bookinstance.save();
                res.redirect(bookinstance.url);
            }
        } catch (err) {
            next(err);
        }


    },
];

// Display BookInstance delete form on GET.
export function bookinstance_delete_get(req, res) {
    res.send("NOT IMPLEMENTED: BookInstance delete GET");
}

// Handle BookInstance delete on POST.
export function bookinstance_delete_post(req, res) {
    res.send("NOT IMPLEMENTED: BookInstance delete POST");
}

// Display BookInstance update form on GET.
export function bookinstance_update_get(req, res) {
    res.send("NOT IMPLEMENTED: BookInstance update GET");
}

// Handle bookinstance update on POST.
export function bookinstance_update_post(req, res) {
    res.send("NOT IMPLEMENTED: BookInstance update POST");
}
