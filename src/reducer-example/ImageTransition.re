// module SpringAnimation = HooksSpringAnimation
// module RemoteAction = HooksRemoteAction
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
  let displayHeightString = Px.i(displayHeight);
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
    (Px.f(width), Px.f(left1), Px.f(left2));
  };

  let renderImage = (~left, i) => {
    let src = {
      "./" ++ string_of_int((i + numImages) mod numImages) ++ ".jpg";
    };
    Js.log("src: " ++ src);
    <img
      className="photo-inner"
      style={ReactDOMRe.Style.make(~height=displayHeightString, ~left, ())}
      src={"./" ++ string_of_int((i + numImages) mod numImages) ++ ".jpg"}
    />;
  };
  let render = (~phase, image1, image2) => {
    Js.log("ImageRender called");
    Js.log4("ImageRender args: ", phase, image1, image2);
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
