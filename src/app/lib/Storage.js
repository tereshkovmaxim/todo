export default class Storage {
  constructor(name) {
    this.dbName = name;

    if (!localStorage.getItem(this.dbName)) {
      const data = [];
      localStorage.setItem(this.dbName, JSON.stringify(data));
    }
  }

  save({ id, updateData }) {
    const data = JSON.parse(localStorage.getItem(this.dbName));

    if (id) {
      for (let i = 0; i < data.length; i += 1) {
        if (data[i].id === id) {
          Object.keys(updateData).forEach((value) => {
            data[i][value] = updateData[value];
          });
        }
      }
    } else {
      data.push(updateData);
    }

    localStorage.setItem(this.dbName, JSON.stringify(data));
  }

  findAll() {
    const data = JSON.parse(localStorage.getItem(this.dbName));

    return data;
  }

  remove(id) {
    let result = false;
    const data = JSON.parse(localStorage.getItem(this.dbName));

    for (let i = 0; i < data.length; i += 1) {
      if (data[i].id === id) {
        data.splice(i, 1);
        result = true;
      }
    }

    localStorage.setItem(this.dbName, JSON.stringify(data));
    return result;
  }
}
