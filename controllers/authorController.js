import Author from "../models/author.js";
import expressAsyncHandler from "express-async-handler";
import Book from "../models/book.js";

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
export function author_create_get(req, res) {
    res.send("NOT IMPLEMENTED: Author create GET");
}

// Создать автора по запросу POST.
export function author_create_post(req, res) {
    res.send("NOT IMPLEMENTED: Author create POST");
}

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
