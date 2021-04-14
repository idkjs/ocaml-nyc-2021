  type state =
    | StartMessage
    | ChatHeads
    | ImageGalleryHeads;
  // type action =
  //   | StartMessage
  //   | ChatHeads
  //   | ImageGalleryHeads;

  [@react.component]
  let make = () => {
    // let (state, actionIsState) =
    //   React.useReducer(
    //     (_, actionIsState) =>
    //       switch (actionIsState) {
    //       | StartMessage => StartMessage
    //       | ChatHeads => ChatHeads
    //       | ImageGalleryHeads => ImageGalleryHeads
    //       },
    //     StartMessage,
    //   );
    let (state, actionIsState) = React.useState(() => StartMessage);
    switch (state) {
    | StartMessage =>
      <div>
        <div>
          <button onClick={_e => actionIsState(_ => ChatHeads)}>
            {React.string("Start normal chatheads")}
          </button>
        </div>
        <button onClick={_e => actionIsState(_ => ImageGalleryHeads)}>
          {React.string("Start image gallery chatheads")}
        </button>
      </div>
    | ChatHeads => <ChatHeadsExample imageGallery=false />
    | ImageGalleryHeads => <ChatHeadsExample imageGallery=true />
    };
  };
