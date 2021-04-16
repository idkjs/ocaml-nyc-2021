type el;
type t =
  | El(el)
  | El_list(list(t));

let flatten: t => list(el) =
  t => {
    let rec internal = (cont: list(t), acc, t) =>
      switch (t) {
      | El(el) => internal(cont, [el, ...acc], El_list([]))
      | El_list([]) =>
        switch (cont) {
        | [] => acc
        | [hd, ...tl] => internal(tl, acc, hd)
        }
      | El_list([l, ...r]) => internal([El_list(r), ...cont], acc, l)
      };
    internal([], [], t) |> List.rev;
  };

let rec fold_children =
        (processed: list(el), unprocessed: list(t), child: t) =>
  switch (unprocessed, child) {
  | ([El(el1), ...rest], El(el2)) =>
    fold_children([el2, el1, ...processed], rest, child)
  | ([unprocessed_item, ...rest], El(el2)) =>
    fold_children([el2, ...processed], rest, unprocessed_item)
  | ([el, ...unprocessed], El_list(unprocessed2)) =>
    fold_children(processed, unprocessed @ unprocessed2, el)
  | ([], El_list([])) => processed
  | ([], El_list([el, ...unprocessed])) =>
    fold_children(processed, unprocessed, el)
  | ([], El(el)) => [el, ...processed]
  };

let rec concat = (l, f) =>
  switch (l) {
  | El(n) => (l => [n, ...f(l)])
  | El_list([]) => f
  | El_list([a, ...q]) => concat(a, l => concat(El_list(q), f, l))
  };
