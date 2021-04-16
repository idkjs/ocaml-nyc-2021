[@react.component]
let make = (~repeat=1, ~hide=false, ~title, ~action:State.action) =>{
      hide
        ? React.null
        : <div
            className="exampleButton large"
            style={ReactDOMRe.Style.make(~width="220px", ())}
            // onClick={_e =>
            //   for (_ in 1 to repeat) {
            //     state.act(action);
            //   }
            // }
            onClick={e => Js.log(e)
            }
            >
            {React.string(title)}
          </div>};
