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
        let news_id = 0;

        if (req.query.news_id !== undefined) {
            const value = parseInt(req.query.news_id);
            if (!isNaN(value)) news_id = value;
        }

        const fields = "*";

        let condition = "1 = 1";
        if (news_id > 0) condition = "news_id = " + news_id;

        try {
            const items = await db.getComments("comments", fields, condition);
            res.send(items);
        }
        catch (err) {
            res.send(err);
        }
    });

    router.post("/", upload.single("image"), async (req, res) => {
        const data = req.body;

        let err = false;

        if (typeof data["news_id"] === "undefined") err = true;
        else if (data["news_id"] === "") err = true;

        if (typeof data["comment"] === "undefined") err = true;
        else if (data["comment"] === "") err = true;

        if (err) res.status(400).send({ error: "'news_id' and 'comment' must be present in the request" })
        else {
            try {
                const items = await db.getItem("news", data.news_id);
                if (items.length > 0) {
                    const newItem = await db.addItem("comments", data);
                    res.send(newItem);
                }
                else res.send(`You cannot add new comment to a non-existent news (news_id=${data.news_id})`);
            }
            catch (err) {
                res.send(err);
            }
        }
    });

    router.delete("/:id", async (req, res) => {
        try {
            const result = await db.removeComments("", req.params.id);
            res.send(result);
        }
        catch (err) {
            res.send(err);
        }
    });

    return router;
}


module.exports = createRouter;