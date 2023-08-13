import Author from "../models/author.js";
import expressAsyncHandler from "express-async-handler";
import Book from "../models/book.js";
import {body, validationResult} from "express-validator";


export default Book;


class AuthorController {



}

// Показать список всех авторов.
// Display list of all Authors.
export async function author_list(req, res, next) {
    try {
        const list_authors = await Author.find({})
            .sort([["family_name", "ascending"]]);

        res.render("author_list", {
            title: "Author List",
            author_list: list_authors,
        });
    } catch (err) {
        return next(err);
    }
}


// Показать подробную страницу для данного автора.
// Display detail page for a specific Author.
export const author_detail = expressAsyncHandler
        (async (req, res, next) => {

    // Get details of author and all their books (in parallel)
    const [author, allBooksByAuthor] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({ author: req.params.id }, "title summary").exec(),
    ]);

    if (author === null) {
        // No results.
        const err = new Error("Author not found");
        err.status = 404;
        return next(err);
    }

    res.render("author_detail", {
        title: "Author Detail",
        author: author,
        author_books: allBooksByAuthor,
    });
});


// Показать форму создания автора по запросу GET.
// Display Author create form on GET.
export function author_create_get(req, res, next) {
    res.render("author_form", { title: "Create Author" });
}


// Создать автора по запросу POST.
// Handle Author create on POST.
export const author_create_post = [

    // Validate and sanitize fields.
        body("first_name")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("First name must be specified.")
        .isAlphanumeric()
        .withMessage("First name has non-alphanumeric characters."),

    body("family_name")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("Family name must be specified.")
        .isAlphanumeric()
        .withMessage("Family name has non-alphanumeric characters."),

    body("date_of_birth", "Invalid date of birth")
        .optional({values: "falsy"})
        .isISO8601()
        .toDate(),

    body("date_of_death", "Invalid date of death")
        .optional({values: "falsy"})
        .isISO8601()
        .toDate(),


    // Process request after validation and sanitization.
    expressAsyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Author object with escaped and trimmed data
        const author = new Author({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render("author_form", {
                title: "Create Author",
                author: author,
                errors: errors.array(),
            });

        } else {
            // Data from form is valid.

            // Save author.
            await author.save();
            // Redirect to new author record.
            res.redirect(author.url);
        }
    }),
];


// Показать форму удаления автора по запросу GET.
export function author_delete_get(req, res) {
    res.send("NOT IMPLEMENTED: Author delete GET");
}

// Удалить автора по запросу POST.
export function author_delete_post(req, res) {
    res.send("NOT IMPLEMENTED: Author delete POST");
}

// Показать форму обновления автора по запросу GET.
export function author_update_get(req, res) {
    res.send("NOT IMPLEMENTED: Author update GET");
}

// Обновить автора по запросу POST.
export function author_update_post(req, res) {
    res.send("NOT IMPLEMENTED: Author update POST");
}
