import Author from "../models/author.js";

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
export function author_detail(req, res) {
    res.send("NOT IMPLEMENTED: Author detail: " + req.params.id);
}

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
