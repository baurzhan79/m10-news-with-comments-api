module.exports = (connection) => ({
    getItems(entity, fields) {
        return new Promise((res, rej) => {
            connection.query(`select ${fields} from ??`, [entity], (err, result) => {
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

    removeItem(entity, id) {
        return new Promise((res, rej) => {
            connection.query("delete from ?? where id = ?", [entity, id], (err, result) => {
                if (err) {
                    rej(err)
                }
                res("The request was executed without errors");
            })
        })
    }
})
