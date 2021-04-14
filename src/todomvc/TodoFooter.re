type showingState =
  | AllTodos
  | ActiveTodos
  | CompletedTodos;


let push = (path, event) => {
  ReactEvent.Mouse.preventDefault(event);
  ReasonReact.Router.push("#" ++ path);
};
[@react.component]

let make =
    (~count, ~completedCount, ~nowShowing, ~onClearCompleted) => {


    let activeTodoWord = count === 1 ? "item" : "items";
    let clearButton =
      completedCount > 0 ?
        <button className="clear-completed" onClick=onClearCompleted>
          {React.string("Clear completed")}
        </button> :
        React.null;
    let (all, active, completed) =
      switch (nowShowing) {
      | AllTodos => ("selected", "", "")
      | ActiveTodos => ("", "selected", "")
      | CompletedTodos => ("", "", "selected")
      };
    <footer className="footer">
      <span className="todo-count">
        <strong> (React.string(string_of_int(count))) </strong>
        {React.string(" " ++ activeTodoWord ++ " left")}
      </span>
      <ul className="filters">
        <li>
          <a onClick=(push("")) className=all>
            {React.string("All")}
          </a>
        </li>
        {React.string(" ")}
        <li>
          <a onClick=(push("active")) className=active>
            {React.string("Active")}
          </a>
        </li>
        {React.string(" ")}
        <li>
          <a onClick=(push("completed")) className=completed>
            {React.string("Completed")}
          </a>
        </li>
      </ul>
      clearButton
    </footer>;

};
