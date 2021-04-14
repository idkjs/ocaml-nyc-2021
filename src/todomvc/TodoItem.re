type todo = {
  id: string,
  title: string,
  completed: bool,
};

type state = {
  editText: string,
  editing: bool,
  editFieldRef: ref(option(Dom.element)),
};

type action =
  | Edit
  | Submit
  | KeyDown(int)
  | Change(string);

[@react.component]
let make =
    (
      ~todo,
      ~editing,
      ~onDestroy,
      ~onSave,
      ~onEdit,
      ~onToggle: unit => unit,
      ~onCancel,
    ) => {
  let submitHelper = (~state) =>
    switch (String.trim(state.editText)) {
    | "" =>
      onDestroy();
      state;
    | nonEmptyValue =>
      onSave(nonEmptyValue);
      {...state, editText: nonEmptyValue};
    };
  let (state, dispatch) =
    React.useReducer(
      (state, action) =>
        switch (action) {
        | Edit => {...state, editText: todo.title}
        | Submit => submitHelper(~state)
        | Change(text) => state.editing ? {...state, editText: text} : state
        | KeyDown(27) =>
          onCancel();
          {...state, editText: todo.title};
        | KeyDown(13) => submitHelper(~state)
        | KeyDown(_) => state
        },
      {editText: todo.title, editFieldRef: ref(None), editing},
    );

  let editFieldRef = React.useRef(Js.Nullable.null);

  let className =
    [todo.completed ? "completed" : "", editing ? "editing" : ""]
    |> String.concat(" ");
  <li className>
    <div className="view">
      <input
        className="toggle"
        type_="checkbox"
        checked={todo.completed}
        onChange={_ => onToggle()}
      />
      <label
        onDoubleClick={_event => {
          onEdit();
          dispatch(Edit);
        }}>
        {React.string(todo.title)}
      </label>
      <button className="destroy" onClick={_ => onDestroy()} />
    </div>
    <input
      ref={ReactDOM.Ref.domRef(editFieldRef)}
      className="edit"
      value={state.editText}
      onBlur={_event => dispatch(Submit)}
      onChange={event =>
        dispatch(Change(ReactEvent.Form.target(event)##value))
      }
      onKeyDown={event =>
        dispatch(KeyDown(ReactEvent.Keyboard.which(event)))
      }
    />
  </li>;
};
