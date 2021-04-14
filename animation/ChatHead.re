let pxI = i => string_of_int(i) ++ "px";

let pxF = v => pxI(int_of_float(v));

type action =
    | MoveX(float)
    | MoveY(float);
  type state = {
    x: float,
    y: float,
  };
  [@react.component]
  let make = (~rAction, ~headNum, ~imageGallery) => {
    let (state, dispatch) =
      React.useReducer(
        (state: state, action) =>
          switch (action) {
          | MoveX(x) => {...state, x}
          | MoveY(y) => {...state, y}
          },
        {x: 0., y: 0.},
      );

    React.useEffect0(() => {
      RemoteAction.subscribe(~send=dispatch, rAction) |> ignore;
      None;
    });

    let {x, y} = state;
    let left = pxF(x -. 25.);
    let top = pxF(y -. 25.);
    imageGallery
      ? <div
          className="chat-head-image-gallery"
          style={ReactDOMRe.Style.make(
            ~left,
            ~top,
            ~zIndex=string_of_int(- headNum),
            (),
          )}>
          <ImageGalleryAnimation initialImage=headNum />
        </div>
      : <div
          className={"chat-head chat-head-" ++ string_of_int(headNum mod 6)}
          style={ReactDOMRe.Style.make(
            ~left,
            ~top,
            ~zIndex=string_of_int(- headNum),
            (),
          )}
        />;
  };
