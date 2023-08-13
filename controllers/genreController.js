import Genre from "../models/genre.js";
import Book from "../models/book.js";
import validator from "express-validator";

// Display list of all Genre.
export async function genre_list(req, res) {
    try {
        const list_genres = await Genre.find({});
        res.render("genre_list", {
            title: "Genre list",
            genre_list: list_genres
        })
    } catch (err) {
        return next(err);
    }

}

export async function genre_detail(req, res, next) {
    try {
        const genre = await Genre.findById(req.params.id)
        const genre_books = await Book.find({genre: req.params.id})

        if (genre == null) {
            // No results.
            var err = new Error("Genre not found");
            err.status = 404;
            return next(err);
        }

        res.render("genre_detail", {
            title: "Genre Detail",
            genre: genre,
            genre_books: genre_books,
        });
    } catch (err) {
        return next(err);
    }
}

// Display Genre create form on GET.
export function genre_create_get(req, res, next) {
    res.render("genre_form", { title: "Create Genre" });
}

// Handle Genre create on POST
export const genre_create_post = [
    // Validate that the name field is not empty.
    validator.body("name", "Genre name required").trim().isLength({min: 1}),

    // Sanitize (escape) the name field.
    validator.body("name").escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validator.validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var genre = new Genre({ name: req.body.name });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render("genre_form", {
                title: "Create Genre",
                genre: genre,
                errors: errors.array(),
            });
        } else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            (async () => {
                try {
                    // Используем await для запроса и сохраняем результат в переменной
                    const found_genre = await Genre.findOne({ name: req.body.name });

                    if (found_genre) {
                        // Genre exists, redirect to its detail page.
                        res.redirect(found_genre.url);
                    } else {
                        // Используем await для сохранения жанра и обрабатываем ошибки
                        await genre.save();
                        // Genre saved. Redirect to genre detail page.
                        res.redirect(genre.url);
                    }
                } catch (err) {
                    // Обрабатываем ошибку
                    return next(err);
                }
            })();
        }
    },
];

// Display Genre delete form on GET.
export function genre_delete_get(req, res) {
    res.send("NOT IMPLEMENTED: Genre delete GET");
}

// Handle Genre delete on POST.
export function genre_delete_post(req, res) {
    res.send("NOT IMPLEMENTED: Genre delete POST");
}

// Display Genre update form on GET.
export function genre_update_get(req, res) {
    res.send("NOT IMPLEMENTED: Genre update GET");
}

// Handle Genre update on POST.
export function genre_update_post(req, res) {
    res.send("NOT IMPLEMENTED: Genre update POST");
}
