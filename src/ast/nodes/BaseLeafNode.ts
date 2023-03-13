abstract class BaseValueNode<T> {
  val: T;

  constructor(val: T) {
    this.val = val;
  }

  get value(): T {
    return this.val;
  }

  protected abstract validate(): void;
}

export { BaseValueNode };
