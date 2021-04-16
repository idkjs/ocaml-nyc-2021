'use strict';

var List = require("bs-platform/lib/js/list.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");

function flatten(t) {
  var internal = function (_cont, _acc, _t) {
    while(true) {
      var t = _t;
      var acc = _acc;
      var cont = _cont;
      if (t.TAG === /* El */0) {
        _t = {
          TAG: /* El_list */1,
          _0: /* [] */0
        };
        _acc = {
          hd: t._0,
          tl: acc
        };
        continue ;
      }
      var match = t._0;
      if (match) {
        _t = match.hd;
        _cont = {
          hd: {
            TAG: /* El_list */1,
            _0: match.tl
          },
          tl: cont
        };
        continue ;
      }
      if (!cont) {
        return acc;
      }
      _t = cont.hd;
      _cont = cont.tl;
      continue ;
    };
  };
  return List.rev(internal(/* [] */0, /* [] */0, t));
}

function fold_children(_processed, _unprocessed, _child) {
  while(true) {
    var child = _child;
    var unprocessed = _unprocessed;
    var processed = _processed;
    if (unprocessed) {
      var el1 = unprocessed.hd;
      if (el1.TAG === /* El */0 && child.TAG === /* El */0) {
        _unprocessed = unprocessed.tl;
        _processed = {
          hd: child._0,
          tl: {
            hd: el1._0,
            tl: processed
          }
        };
        continue ;
      }
      var rest = unprocessed.tl;
      if (child.TAG === /* El */0) {
        _child = el1;
        _unprocessed = rest;
        _processed = {
          hd: child._0,
          tl: processed
        };
        continue ;
      }
      _child = el1;
      _unprocessed = Pervasives.$at(rest, child._0);
      continue ;
    }
    if (child.TAG === /* El */0) {
      return {
              hd: child._0,
              tl: processed
            };
    }
    var match = child._0;
    if (!match) {
      return processed;
    }
    _child = match.hd;
    _unprocessed = match.tl;
    continue ;
  };
}

function concat(_l, _f) {
  while(true) {
    var f = _f;
    var l = _l;
    if (l.TAG === /* El */0) {
      var n = l._0;
      return (function(f,n){
      return function (l) {
        return {
                hd: n,
                tl: Curry._1(f, l)
              };
      }
      }(f,n));
    }
    var match = l._0;
    if (!match) {
      return f;
    }
    var q = match.tl;
    _f = (function(f,q){
    return function (l) {
      return Curry._1(concat({
                      TAG: /* El_list */1,
                      _0: q
                    }, f), l);
    }
    }(f,q));
    _l = match.hd;
    continue ;
  };
}

exports.flatten = flatten;
exports.fold_children = fold_children;
exports.concat = concat;
/* No side effect */
