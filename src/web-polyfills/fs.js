// eslint-disable-next-line no-unused-vars
function existsSync(_filename) {
  return false;
}

const realpath = {
  native: function () {
    return undefined;
  },
};

export { existsSync, realpath };
