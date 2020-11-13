import { Router } from 'express';
import UsersController from './controllers/user.controller';
import TasksController from './controllers/task.controller';
import authenticate from './middleware/authenticate';
import errorHandler from './middleware/error-handler';

const routes = new Router();

// User Routes
routes.post('/register', UsersController.register);
routes.post('/login', UsersController.login);
routes.get('/user', authenticate, UsersController.getUser);

// Task Routes
routes.post('/create-task', authenticate, TasksController.createTask);
routes.get('/list-tasks', authenticate, TasksController.listTasks);

routes.use(errorHandler);

export default routes;
