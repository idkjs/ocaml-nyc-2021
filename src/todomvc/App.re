/* The new stdlib additions */
open Belt;

[@bs.val] external unsafeJsonParse: string => 'a = "JSON.parse";

let localStorageNamespace = "reason-react-todos";

let saveLocally = todos =>
  switch (Js.Json.stringifyAny(todos)) {
  | None => ()
  | Some(stringifiedTodos) =>
    Dom.Storage.(
      localStorage |> setItem(localStorageNamespace, stringifiedTodos)
    )
  };

module Top = {
  type action =
    | Navigate(TodoFooter.showingState)
    /* todo actions */
    | NewTodoEnterKeyDown
    | NewTodoOtherKeyDown
    | ClearCompleted
    | Cancel
    | ChangeTodo(string)
    | Save(TodoItem.todo, string)
    | Edit(TodoItem.todo)
    | Destroy(TodoItem.todo)
    | Toggle(TodoItem.todo)
    | ToggleAll(bool);
  type state = {
    nowShowing: TodoFooter.showingState,
    editing: option(string),
    newTodo: string,
    todos: list(TodoItem.todo),
  };
  let urlToShownPage = hash =>
    switch (hash) {
    | "active" => TodoFooter.ActiveTodos
    | "completed" => CompletedTodos
    | _ => AllTodos
    };
  [@react.component]
  let make = () => {
    let (state, dispatch) =
      React.useReducer(
        (state, action) =>
          switch (action) {
          | Navigate(page) => {...state, nowShowing: page}
          | Cancel => {...state, editing: None}
          | ChangeTodo(text) => {...state, newTodo: text}
          | NewTodoOtherKeyDown => state
          | NewTodoEnterKeyDown =>
            switch (String.trim(state.newTodo)) {
            | "" => state
            | nonEmptyValue =>
              let todos =
                state.todos
                @ [
                  {
                    id: Js.Float.toString(Js.Date.now()),
                    title: nonEmptyValue,
                    completed: false,
                  },
                ];
              saveLocally(todos);
              {...state, newTodo: "", todos};
            }
          | ClearCompleted =>
            let todos =
              List.keep(state.todos, todo => !TodoItem.(todo.completed));
            saveLocally(todos);
            {...state, todos};
          | ToggleAll(checked) =>
            let todos =
              List.map(state.todos, todo =>
                {...todo, TodoItem.completed: checked}
              );
            saveLocally(todos);
            {...state, todos};
          | Save(todoToSave, text) =>
            let todos =
              List.map(state.todos, todo =>
                todo == todoToSave ? {...todo, TodoItem.title: text} : todo
              );
            saveLocally(todos);
            {...state, editing: None, todos};
          | Edit(todo) => {...state, editing: Some(TodoItem.(todo.id))}
          | Destroy(todo) =>
            let todos =
              List.keep(state.todos, candidate => candidate !== todo);
            saveLocally(todos);
            {...state, todos};
          | Toggle(todoToToggle) =>
            let todos =
              List.map(state.todos, todo =>
                todo == todoToToggle
                  ? {...todo, TodoItem.completed: !TodoItem.(todo.completed)}
                  : todo
              );
            saveLocally(todos);
            {...state, todos};
          },
        {
          let todos =
            switch (
              Dom.Storage.(localStorage |> getItem(localStorageNamespace))
            ) {
            | None => []
            | Some(todos) => unsafeJsonParse(todos)
            };
          {
            nowShowing:
              urlToShownPage(
                ReasonReact.Router.dangerouslyGetInitialUrl().hash,
              ),
            editing: None,
            newTodo: "",
            todos,
          };
        },
      );
    React.useEffect0(() => {
      let token =
        ReasonReactRouter.watchUrl(url =>
          dispatch(Navigate(urlToShownPage(url.hash)))
        );
      Some(() => ReasonReactRouter.unwatchUrl(token));
    });

    /* router actions */

    let {todos, editing} = state;
    let todoItems =
      List.keep(todos, todo =>
        TodoItem.(
          switch (state.nowShowing) {
          | ActiveTodos => !todo.completed
          | CompletedTodos => todo.completed
          | AllTodos => true
          }
        )
      )
      |> List.map(
           _,
           todo => {
             let editing =
               switch (editing) {
               | None => false
               | Some(editing) => editing === TodoItem.(todo.id)
               };
             <TodoItem
               key={todo.id}
               todo
               onToggle={_event => dispatch(Toggle(todo))}
               onDestroy={_event => dispatch(Destroy(todo))}
               onEdit={_event => dispatch(Edit(todo))}
               editing
               onSave={(text:string) => dispatch(Save(todo, text))}
               onCancel={_event => dispatch(Cancel)}
             />;
           },
         );
    let todosLength = List.length(todos);
    let completedCount =
      List.keep(todos, todo => TodoItem.(todo.completed)) |> List.length;
    let activeTodoCount = todosLength - completedCount;
    let footer =
      switch (activeTodoCount, completedCount) {
      | (0, 0) => React.null
      | _ =>
        <TodoFooter
          count=activeTodoCount
          completedCount
          nowShowing={state.nowShowing}
          onClearCompleted={_event => dispatch(ClearCompleted)}
        />
      };
    let main =
      todosLength === 0
        ? React.null
        : <section className="main">
            <input
              className="toggle-all"
              type_="checkbox"
              onChange={event => {
                let checked = ReactEvent.Form.target(event)##checked;
                dispatch(ToggleAll(checked));
              }}
              checked={activeTodoCount === 0}
            />
            <ul className="todo-list">
              {React.array(List.toArray(todoItems))}
            </ul>
          </section>;
    <div>
      <header className="header">
        <h1> {React.string("todos")} </h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={state.newTodo}
          onKeyDown={event =>
            if (ReactEvent.Keyboard.keyCode(event) === 13) {
              ReactEvent.Keyboard.preventDefault(event);
              dispatch(NewTodoEnterKeyDown);
            } else {
              dispatch(NewTodoOtherKeyDown);
            }
          }
          onChange={event =>
            dispatch(ChangeTodo(ReactEvent.Form.target(event)##value))
          }
          autoFocus=true
        />
      </header>
      main
      footer
    </div>;
  };
};

ReactDOMRe.renderToElementWithClassName(<Top />, "todoapp");
