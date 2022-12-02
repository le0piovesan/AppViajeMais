import db from "./SQLiteDatabase";

db.transaction((tx) => {
  // tx.executeSql("DROP TABLE viagens;");

  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS viagens (id INTEGER PRIMARY KEY AUTOINCREMENT, origemLat INT, origemLng INT, origemName TEXT, destinoLat INT, destinoLng INT, destinoName TEXT, veiculoReference INT);"
  );
});

const create = (obj) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO viagens (origemLat, origemLng, origemName, destinoLat, destinoLng, destinoName, veiculoReference) values (?, ?, ?, ?, ?, ?, ?);",
        [
          obj.origemLat,
          obj.origemLng,
          obj.origemName,
          obj.destinoLat,
          obj.destinoLng,
          obj.destinoName,
          obj.veiculoReference,
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
        "UPDATE viagens SET origemLat=?, origemLng=?, origemName=?, destinoLat=?, destinoLng=?, destinoName=? WHERE id=?;",
        [
          obj.origemLat,
          obj.origemLng,
          obj.origemName,
          obj.destinoLat,
          obj.destinoLng,
          obj.destinoName,
          id,
        ],
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
        "SELECT * FROM viagens WHERE id=?;",
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

const findviagensByVeiculoId = (veiculo) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM viagens WHERE veiculoReference = ?;",
        [veiculo],
        //-----------------------
        (_, { rows }) => {
          if (rows.length > 0) resolve(rows._array);
          // else reject("viagens not found: veiculo=" + veiculo);
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
        "SELECT * FROM viagens;",
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
        "DELETE FROM viagens WHERE id=?;",
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
  findviagensByVeiculoId,
  all,
  remove,
};
