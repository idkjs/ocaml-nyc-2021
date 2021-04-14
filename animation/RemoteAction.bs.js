'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var Caml_obj = require("bs-platform/lib/js/caml_obj.js");

function sendDefault(_action) {
  
}

function create(param) {
  return {
          send: sendDefault
        };
}

function subscribe(send, x) {
  if (Caml_obj.caml_equal(x.send, sendDefault)) {
    x.send = send;
    return x;
  }
  
}

function unsubscribe(x) {
  x.send = sendDefault;
  
}

function send(x, action) {
  return Curry._1(x.send, action);
}

exports.create = create;
exports.subscribe = subscribe;
exports.unsubscribe = unsubscribe;
exports.send = send;
/* No side effect */
