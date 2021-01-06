export default class TodoController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.subscribe('createTask', this.createTask.bind(this));
    this.view.subscribe('removeTask', this.removeTask.bind(this));
    this.view.subscribe('editTask', this.editTask.bind(this));
  }

  createTask(text) {
    this.model.addTask(text);
  }

  removeTask(id) {
    this.model.removeTask(+id);
  }

  editTask({ id, type, value }) {
    const updateTask = {};

    if (type === 'checkbox') {
      updateTask.isComplete = value;
      this.model.updateTask(+id, updateTask);
    } else {
      updateTask.title = value;

      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(() => {
        this.model.updateTask(+id, updateTask);
        clearTimeout(this.timer);
      }, 500);
    }
  }

  show() {
    this.view.render();
  }
}
