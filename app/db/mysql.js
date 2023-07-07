module.exports = (connection) => ({
    getNews(entity, fields) {
        return new Promise((res, rej) => {
            connection.query(`select ${fields} from ?? `, [entity], (err, result) => {
                if (err) {
                    rej(err)
                }
                res(result);
            })
        })
    },

    getComments(entity, fields, condition) {
        return new Promise((res, rej) => {
            const strQuery = `select ${fields} from ${entity} where ${condition}`;

            connection.query(strQuery, [], (err, result) => {
                if (err) {
                    rej(err)
                }
                res(result);
            })
        })
    },

    getItem(entity, id) {
        return new Promise((res, rej) => {
            connection.query("select * from ?? where id = ?", [entity, id], (err, result) => {
                if (err) {
                    rej(err)
                }
                res(result);
            })
        })
    },

    addItem(entity, data) {
        return new Promise((res, rej) => {
            connection.query("insert into ?? set ?", [entity, data], (err, result) => {
                if (err) {
                    rej(err)
                }
                data.id = result.insertId;
                res(data);
            })
        })
    },

    removeComments(news_id, comment_id) {
        return new Promise((res, rej) => {
            if (news_id !== "") {
                connection.query("delete from comments where news_id = ?", [news_id], (err, result) => {
                    if (err) {
                        rej(err)
                    }
                    res("The request was executed without errors");
                })
            }
            else if (comment_id !== "") {
                connection.query("delete from comments where id = ?", [comment_id], (err, result) => {
                    if (err) {
                        rej(err)
                    }
                    res("The request was executed without errors");
                })
            }
        })
    },

    removeNews(id) {
        return new Promise((res, rej) => {
            connection.query("delete from news where id = ?", [id], (err, result) => {
                if (err) {
                    rej(err)
                }
                res("The request was executed without errors");
            })
        })
    }
})
