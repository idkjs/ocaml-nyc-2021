

/* Desugars to

   `React.createElement(HooksPage.make, HooksPage.makeProps(~message="hello", ()))` */
ReactDOMRe.renderToElementWithId(<HooksPage message="Hello!" />, "index");
