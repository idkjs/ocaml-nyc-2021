  [@bs.val]
  external addEventListener: (string, Js.t({..}) => unit) => unit =
    "window.addEventListener";
  let numHeads = 6;
  type control = {
    rAction: RemoteAction.t(ChatHead.action),
    animX: SpringAnimation.t,
    animY: SpringAnimation.t,
  };
  type state = {
    controls: array(control),
    chatHeads: array(React.element),
  };
  let createControl = () => {
    rAction: RemoteAction.create(),
    animX: SpringAnimation.create(0.),
    animY: SpringAnimation.create(0.),
  };
  [@react.component]
  let make = (~imageGallery) => {
    let initialState =()=> {
      let controls = Belt.Array.makeBy(numHeads, _ => createControl());
      let chatHeads =
        Belt.Array.makeBy(numHeads, i =>
          <ChatHead
            key={Key.gen()}
            imageGallery
            rAction={controls[i].rAction}
            headNum=i
          />
        );
      {controls, chatHeads};
    };
    let (state, _) = React.useState(_ => initialState());

    React.useEffect1(
      () => {
        let {controls, _} = state;
        let setupAnimation = headNum => {
          let setOnChange = (~isX, afterChange) => {
            let control = controls[headNum];
            let animation = isX ? control.animX : control.animY;
            animation
            |> SpringAnimation.setOnChange(
                 ~preset=Spring.gentle,
                 ~speedup=2.,
                 ~onChange=v => {
                   RemoteAction.send(
                     control.rAction,
                     ~action=isX ? MoveX(v) : MoveY(v),
                   );
                   afterChange(v);
                 },
               );
          };
          let isLastHead = headNum == numHeads - 1;
          let afterChangeX = x =>
            isLastHead
              ? ()
              : controls[headNum + 1].animX
                |> SpringAnimation.setFinalValue(x);
          let afterChangeY = y =>
            isLastHead
              ? ()
              : controls[headNum + 1].animY
                |> SpringAnimation.setFinalValue(y);
          setOnChange(~isX=true, afterChangeX);
          setOnChange(~isX=false, afterChangeY);
        };
        Belt.Array.forEachWithIndex(controls, (i, _) => setupAnimation(i));
        let onMove = e => {
          let x = e##pageX;
          let y = e##pageY;
          controls[0].animX |> SpringAnimation.setFinalValue(x);
          controls[0].animY |> SpringAnimation.setFinalValue(y);
        };
        addEventListener("mousemove", onMove);
        addEventListener("touchmove", onMove);

        Some(
          () =>
            Belt.Array.forEach(
              controls,
              ({animX, animY}) => {
                SpringAnimation.stop(animX);
                SpringAnimation.stop(animY);
              },
            ),
        );
      },
      [|state|],
    );
    <div> {React.array(state.chatHeads)} </div>;
  };
