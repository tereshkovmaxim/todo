import EventObserver from '../lib/EventObserver';
import Storage from '../lib/Storage';

export default class TodoModel extends EventObserver {
  constructor() {
    super();

    this.storage = new Storage('todosina');
    this.data = [];
  }

  getTasks() {
    const data = this.storage.findAll();
    return data;
  }

  addTask(text) {
    const newItem = {
      id: Date.now(),
      title: text,
      isComplete: false,
    };

    this.storage.save({ updateData: newItem });
    this.publish('addTask', newItem);
  }

  updateTask(updateId, updateTask) {
    this.storage.save({ id: updateId, updateData: updateTask });
  }

  removeTask(id) {
    if (this.storage.remove(id)) {
      this.publish('removeTask', id);
    }
  }
}
