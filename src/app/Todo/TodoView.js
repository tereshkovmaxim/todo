import EventObserver from '../lib/EventObserver';
import tasksHTML from './tasks.tmpl.hbs';
import todoHTML from './todo.tmpl.hbs';
import './style.scss';

export default class TodoView extends EventObserver {
  constructor(model) {
    super();
    this.model = model;
    this.model.subscribe('addTask', this.insertTask.bind(this));
    this.model.subscribe('removeTask', this.removeTask.bind(this));

    this.root = document.getElementById('app');

    this.buildTemplate();
    this.setHandlers();
  }

  buildTemplate() {
    const taskList = this.model.getTasks();
    const taskTemplate = this.buildTasksTemplate(taskList);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = todoHTML({ taskItems: taskTemplate });
    this.template = wrapper.firstElementChild;
  }

  // eslint-disable-next-line class-methods-use-this
  buildTasksTemplate(taskList) {
    taskList.forEach((value) => {
      if (value.isComplete === true) {
        value.isComplete = 'checked';
      } else {
        value.isComplete = '';
      }
    });
    return tasksHTML({ tasks: taskList });
  }

  setHandlers() {
    this.containerTasks = this.template.querySelector('.tasks');
    this.buttonNew = this.template.querySelector('.new-task-button');
    this.textNew = this.template.querySelector('.new-task-text');
    // this.buttonRemove = this.template.querySelector('.task-remove');

    this.buttonNew.addEventListener('click', this.createHandler.bind(this));
    this.textNew.addEventListener('keyup', this.handlerKeyUp.bind(this));
    this.containerTasks.addEventListener('click', this.removeHandler.bind(this));
    this.containerTasks.addEventListener('input', this.editHandler.bind(this));
    this.containerTasks.addEventListener('mousedown', this.focusHandler.bind(this));
    this.containerTasks.addEventListener('dblclick', this.focusHandler.bind(this));
    this.containerTasks.addEventListener('blur', (e) => { e.target.disabled = true; });
  }

  render() {
    this.root.append(this.template);
  }

  insertTask(newTask) {
    if (this.containerTasks.querySelectorAll('li').length === 0) {
      this.containerTasks.innerHTML = this.buildTasksTemplate([newTask]);
    } else {
      this.containerTasks.insertAdjacentHTML('beforeend', this.buildTasksTemplate([newTask]));
    }
  }

  removeTask(taskId) {
    const li = this.containerTasks.querySelectorAll('li');
    li.forEach((element) => {
      if (+element.dataset.id === taskId) {
        element.remove();
      }
    });
    if (this.containerTasks.children.length === 0) {
      this.containerTasks.innerHTML = '<p class="task-empty">No Tasks</p>';
    }
  }

  createHandler() {
    this.publish('createTask', this.textNew.value);
    this.textNew.value = '';
  }

  removeHandler(event) {
    const target = event.target.closest('.task-remove');
    if (!target) {
      return;
    }
    this.publish('removeTask', target.closest('.tasks-item').dataset.id);
  }

  editHandler(event) {
    this.publish('editTask', {
      id: event.target.closest('.tasks-item').dataset.id,
      type: event.target.type,
      value: (event.target.type === 'checkbox' ? event.target.checked : event.target.value),
    });
  }

  handlerKeyUp(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
      this.createHandler();
    }
  }

  focusHandler(event) {
    if (event.target.closest('.task-title') && event.type == 'mousedown') {
      event.preventDefault();
      return;
    }

    if (event.target.closest('.task-title')) {
      event.target.focus();
      event.target.setSelectionRange(event.target.value.length, event.target.value.length);
    }
  }
}
