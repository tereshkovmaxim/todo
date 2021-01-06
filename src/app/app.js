import TodoController from "./Todo/TodoController";
import TodoModel from "./Todo/TodoModel";
import TodoView from "./Todo/TodoView";

const app = function () {
  const model = new TodoModel();
  const view = new TodoView(model);
  const controller = new TodoController(model, view);

  controller.show();
};

export default app;
