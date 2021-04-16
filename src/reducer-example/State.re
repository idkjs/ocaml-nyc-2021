 type action =
    | SetAct(action => unit)
    | AddSelf
    | AddButton(bool)
    | AddButtonFirst(bool)
    | AddImage(bool)
    | DecrementAllButtons
    /* Remove from the list the button uniquely identified by its height RemoteAction */
    | FilterOutItem(HooksRemoteAction.t(AnimateHeight.action))
    | IncrementAllButtons
    | CloseAllButtons
    | RemoveItem
    | ResetAllButtons
    | ReverseItemsAnimation
    | CloseHeight(HooksAnimation.onStop) /* Used by ReverseAnim */
    | ReverseWithSideEffects(unit => unit) /* Used by ReverseAnim */
    | OpenHeight(HooksAnimation.onStop) /* Used by ReverseAnim */
    | ToggleRandomAnimation;
    
type item = {
  element: React.element,
  rActionButton: HooksRemoteAction.t(AnimatedButton.action),
  rActionHeight: HooksRemoteAction.t(AnimateHeight.action),
  /* used while removing items, to find the first item not already closing */
  mutable closing: bool,
};

type t = {
  act: action => unit,
  randomAnimation: HooksAnimation.t,
  items: list(item),
};
let initial = () => {
  act: _action => (),
  randomAnimation: HooksAnimation.create(),
  items: [],
};
let getElements = ({items}) =>
  Belt.List.toArray(Belt.List.mapReverse(items, x => x.element));
let createButton = (~removeFromList, ~animateMount=?, number) => {
  let rActionButton = HooksRemoteAction.create();
  let rActionHeight = HooksRemoteAction.create();
  let key = Key.gen();
  let onClose = () =>
    HooksRemoteAction.send(
      rActionHeight,
      ~action=
        AnimateHeight.Close(Some(() => removeFromList(rActionHeight))),
    );
  let element: React.element =
    <AnimateHeight
      key rAction=rActionHeight targetHeight=AnimatedButton.targetHeight>
      <AnimatedButton
        key
        text={"Button#" ++ string_of_int(number)}
        rAction=rActionButton
        ?animateMount
        onClose
      />
    </AnimateHeight>;
  {element, rActionButton, rActionHeight, closing: false};
};
let createImage = (~animateMount=?, number) => {
  let key = Key.gen();
  let rActionButton = HooksRemoteAction.create();
  let imageGalleryAnimation =
    <ImageGalleryAnimation
      key={Key.gen()}
      initialImage=number
      ?animateMount
    />;
  let rActionHeight = HooksRemoteAction.create();
  let element =
    <AnimateHeight
      key
      rAction=rActionHeight
      targetHeight={float_of_int(
        ImageTransition.ImageTransition.displayHeight,
      )}>
      imageGalleryAnimation
    </AnimateHeight>;
  {element, rActionButton, rActionHeight, closing: false};
};
// type t = State.t;
