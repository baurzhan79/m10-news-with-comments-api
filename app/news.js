const express = require("express");
const router = express.Router();

// ------------------------------
const { nanoid } = require("nanoid");

const multer = require("multer");
const path = require("path");
const config = require("../config");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });
// ------------------------------

const createRouter = (db) => {
    router.get("/", async (req, res) => {
        const fields = "id, title, image, publication_date";

        try {
            const items = await db.getNews("news", fields);
            res.send(items);
        }
        catch (err) {
            res.send(err);
        }
    });

    router.get("/:id", async (req, res) => {
        try {
            const items = await db.getItem("news", req.params.id);
            if (items.length > 0) res.send(items[0]);
            else res.status(400).send({ error: `There is no post with id ${req.params.id} in the database` })
        }
        catch (err) {
            res.send(err);
        }
    });

    router.post("/", upload.single("image"), async (req, res) => {
        const data = req.body;

        let err = false;

        if (typeof data["title"] === "undefined") err = true;
        else if (data["title"] === "") err = true;

        if (typeof data["content"] === "undefined") err = true;
        else if (data["content"] === "") err = true;

        if (err) res.status(400).send({ error: "'title' and 'content' must be present in the request" })
        else {
            if (req.file) {
                data.image = req.file.filename;
            }

            try {
                const newItem = await db.addItem("news", data);
                res.send(newItem);
            }
            catch (err) {
                res.send(err);
            }
        }
    });

    router.delete("/:id", async (req, res) => {
        try {
            await db.removeComments(req.params.id, "");

            const result = await db.removeNews(req.params.id);
            res.send(result);
        }
        catch (err) {
            res.send(err);
        }
    });

    return router;
}


module.exports = createRouter;