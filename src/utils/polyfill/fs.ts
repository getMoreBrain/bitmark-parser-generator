function existsSync(_filename: string): boolean {
  return false;
}

const realpath = {
  native: function () {
    return undefined;
  },
};

export { existsSync, realpath };
