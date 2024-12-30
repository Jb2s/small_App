let userCount = 0;
let todoListCount = 0;
let todoTaskCount = 0;

export function generateUserId() {
    userCount++;
    return `USER${userCount}`;
}

export function generateTodoListId() {
    todoListCount++;
    return `TODO${todoListCount}`;
}

export function generateTodoTaskId() {
    todoTaskCount++;
    return `TODOTASK${todoTaskCount}`;
}

const users = [
    {
        id: generateUserId(),
        user_name: 'Jean.Dupont',
        first_name: 'Dupont',
        last_name: 'Jean',
        password: 'password123',
        is_authenticated: false,
        todoList: [
            {
                id: generateTodoListId(),
                title: 'Task1',
                // description: 'Description Task1', 
                status: false,
                todoTask: [
                    { id: generateTodoTaskId(), titre: 'Detail1 Task1 User1' }, 
                    { id: generateTodoTaskId(), titre: 'Detail2 Task1 User1' }
                ]
            },
            {
                id: generateTodoListId(),
                title: 'Task2',
                // description: 'Description Task2',
                status: false,
                todoTask: [
                    { id: generateTodoTaskId(), titre: 'Detail1 Task2 User1' }, 
                    { id: generateTodoTaskId(), titre: 'Detail2 Task2 User1' }
                ]
            }
        ]
    },
    {
      id: generateUserId(),
      user_name: 'Jean.Doe',
      first_name: 'Doe',
      last_name: 'Jean',
      password: 'password123',
      is_authenticated: false,
      todoList: [
          {
              id: generateTodoListId(),
              title: 'Task1',
            //   description: 'Description Task1', 
              status: false,
              todoTask: [
                  { id: generateTodoTaskId(), titre: 'Detail1 Task1 User2' }, 
                  { id: generateTodoTaskId(), titre: 'Detail2 Task1 User2' }
              ]
          },
          {
              id: generateTodoListId(),
              title: 'Task2',
            //   description: 'Description Task2',
              status: false,
              todoTask: [
                  { id: generateTodoTaskId(), titre: 'Detail1 Task2 User2' }, 
                  { id: generateTodoTaskId(), titre: 'Detail2 Task2 User2' }
              ]
          }
      ]
  }
];
export const initData = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(users));
}
}
