type action;
// type item = {
//   element: React.element,
//   rActionButton: HooksRemoteAction.t(AnimatedButton.action),
//   rActionHeight: HooksRemoteAction.t(AnimateHeight.action),
//   /* used while removing items, to find the first item not already closing */
//   mutable closing: bool,
// };
type item
type t = {
  act: action => unit,
  randomAnimation: HooksAnimation.t,
  items: list(item),
};
let createButton:
  (
    ~removeFromList: HooksRemoteAction.t(AnimateHeight.action) => unit,
    ~animateMount: bool=?,
    int
  ) =>
  item;
let createImage: (~animateMount: bool=?, int) => item;
let getElements: t => array(React.element);
let initial: unit => t;
