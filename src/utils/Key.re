
  let counter = ref(0);
  let gen = () => {
    incr(counter);
    string_of_int(counter^);
  };

