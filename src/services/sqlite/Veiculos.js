import db from "./SQLiteDatabase";

db.transaction((tx) => {
  // tx.executeSql("DROP TABLE veiculos;");

  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS veiculos (id INTEGER PRIMARY KEY AUTOINCREMENT, placa TEXT, descricao TEXT, tanque INT, combustivel TEXT, userReference INT);"
  );
});

const create = (obj) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO veiculos (placa, descricao, tanque, combustivel, userReference) values (?, ?, ?, ?, ?);",
        [
          obj.placa,
          obj.descricao,
          obj.tanque,
          obj.combustivel,
          obj.userReference,
        ],
        //-----------------------
        (_, { rowsAffected, insertId }) => {
          if (rowsAffected > 0) resolve(insertId);
          else reject("Error inserting obj: " + JSON.stringify(obj));
        },
        (_, error) => reject(error)
      );
    });
  });
};

const update = (id, obj) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE veiculos SET placa=?, descricao=?, tanque=?, combustivel=? WHERE id=?;",
        [obj.placa, obj.descricao, obj.tanque, obj.combustivel, id],
        //-----------------------
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) resolve(rowsAffected);
          else reject("Error updating obj: id=" + id);
        },
        (_, error) => reject(error)
      );
    });
  });
};

const find = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM veiculos WHERE id=?;",
        [id],
        //-----------------------
        (_, { rows }) => {
          if (rows.length > 0) resolve(rows._array[0]);
          else reject("Obj not found: id=" + id);
        },
        (_, error) => reject(error)
      );
    });
  });
};

const findVeiculosByUserId = (user) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM veiculos WHERE userReference = ?;",
        [user],
        //-----------------------
        (_, { rows }) => {
          if (rows.length > 0) resolve(rows._array);
          // else reject("veiculos not found: user=" + user);
        },
        (_, error) => reject(error)
      );
    });
  });
};

const all = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM veiculos;",
        [],
        //-----------------------
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

const remove = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM veiculos WHERE id=?;",
        [id],
        //-----------------------
        (_, { rowsAffected }) => {
          resolve(rowsAffected);
        },
        (_, error) => reject(error)
      );
    });
  });
};

export default {
  create,
  update,
  find,
  findVeiculosByUserId,
  all,
  remove,
};
