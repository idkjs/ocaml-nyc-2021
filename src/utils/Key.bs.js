'use strict';


var counter = {
  contents: 0
};

function gen(param) {
  counter.contents = counter.contents + 1 | 0;
  return String(counter.contents);
}

exports.counter = counter;
exports.gen = gen;
/* No side effect */
