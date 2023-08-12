import Genre from "../models/genre.js";
import Book from "../models/book.js";
import async from "async";

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

// Display detail page for a specific Genre.
export function genre_detailf(req, res, next) {
    async.parallel(
        {
            genre: function (callback) {
                Genre.findById(req.params.id).exec(callback);
            },

            genre_books: function (callback) {
                Book.find({ genre: req.params.id }).exec(callback);
            },
        },
        function (err, results) {
            if (err) {
                return next(err);
            }
            if (results.genre == null) {
                // No results.
                var err = new Error("Genre not found");
                err.status = 404;
                return next(err);
            }
            // Successful, so render
            res.render("genre_detail", {
                title: "Genre Detail",
                genre: results.genre,
                genre_books: results.genre_books,
            });
        },
    );
}


// Display detail page for a specific Genre.
// export function genre_detail(req, res) {
//     res.send("NOT IMPLEMENTED: Genre detail: " + req.params.id);
// }

// Display Genre create form on GET.
export function genre_create_get(req, res) {
    res.send("NOT IMPLEMENTED: Genre create GET");
}

// Handle Genre create on POST.
export function genre_create_post(req, res) {
    res.send("NOT IMPLEMENTED: Genre create POST");
}

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
