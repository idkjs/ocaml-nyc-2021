module SpringAnimation = HooksSpringAnimation
module Spring = HooksSpring
module Animation = HooksAnimation
module RemoteAction = HooksRemoteAction
let pxI = i => string_of_int(i) ++ "px";

let pxF = v => pxI(int_of_float(v));

module ImageTransition: {
  /***
   * Render function for a transition between two images.
   * phase is a value between 0.0 (first image) and 1.0 (second image).
   **/
  let render: (~phase: float, int, int) => React.element;
  let displayHeight: int;
} = {
  let numImages = 6;
  let displayHeight = 200;
  let displayHeightString = pxI(displayHeight);
  let sizes = [|
    (500, 350),
    (800, 600),
    (800, 400),
    (700, 500),
    (200, 650),
    (600, 600),
  |];
  let displayWidths =
    Belt.Array.map(sizes, ((w, h)) => w * displayHeight / h);
  let getWidth = i => displayWidths[(i + numImages) mod numImages];

  /***
   * Interpolate width and left for 2 images, phase is between 0.0 and 1.0.
   **/
  let interpolate = (~width1, ~width2, phase) => {
    let width1 = float_of_int(width1);
    let width2 = float_of_int(width2);
    let width = width1 *. (1. -. phase) +. width2 *. phase;
    let left1 = -. (width1 *. phase);
    let left2 = left1 +. width1;
    (pxF(width), pxF(left1), pxF(left2));
  };
  let renderImage = (~left, i) =>{
    let src={"./" ++ string_of_int((i + numImages) mod numImages) ++ ".jpg"};
    Js.log("src: " ++ src);
    <img
      className="photo-inner"
      style={ReactDOMRe.Style.make(~height=displayHeightString, ~left, ())}
      src={"./" ++ string_of_int((i + numImages) mod numImages) ++ ".jpg"}
    />;}
  let render = (~phase, image1, image2) => {
    let width1 = getWidth(image1);
    let width2 = getWidth(image2);
    let (width, left1, left2) = interpolate(~width1, ~width2, phase);
    <div>
      <div
        className="photo-outer"
        style={ReactDOMRe.Style.make(~height=displayHeightString, ~width, ())}>
        {renderImage(~left=left1, image1)}
        {renderImage(~left=left2, image2)}
      </div>
    </div>;
  };
};

type action =
    | Click
    | SetCursor(float);
  type state = {
    animation: SpringAnimation.t,
    /* cursor value 3.5 means half way between image 3 and image 4 */
    cursor: float,
    targetImage: int,
  };
  [@react.component]
  let make = (~initialImage=0, ~animateMount=true) => {
    let (state, dispatch) =
      React.useReducer(
        (state, action) =>
          switch (action) {
          | Click =>
            state.animation
            |> SpringAnimation.setFinalValue(float_of_int(state.targetImage));
            {...state, targetImage: state.targetImage + 1};
          | SetCursor(cursor) => {...state, cursor}
          },
        {
          animation: SpringAnimation.create(float_of_int(initialImage)),
          cursor: float_of_int(initialImage),
          targetImage: initialImage,
        },
      );
    React.useEffect1(
      () => {
        // had to disable warning 48 but want to understand how to pass optional args. None of these worked.
        // (~preset: Spring.preset=?, ~speedup: float=?, ~precision: float=?,

        // ~finalValue: float=?, SpringAnimation.t) => unit

        //  state.animation
        //   |> SpringAnimation.setOnChange(~preset=?, ~precision=0.05, ~speedup=?, ~onStop?, ~finalValue?, ~onChange=cursor =>
        //        dispatch(SetCursor(state.cursor))

        //         state.animation

        // ~onStop?,~finalValue?, ~onChange=state.cursor => dispatch(SetCursor(cursor)));
        state.animation
        |> SpringAnimation.setOnChange(~precision=0.05, ~onChange=cursor =>
             dispatch(SetCursor(cursor))
           );
        if (animateMount) {
          dispatch(Click);
        };
        Some(() => SpringAnimation.stop(state.animation));
      },
      [|state|],
    );

    let cursor = state.cursor;
    let image = int_of_float(cursor);
    let phase = cursor -. float_of_int(image);
    <div onClick={_e => dispatch(Click)}>
      {ImageTransition.render(~phase, image, image + 1)}
    </div>;
  };
