import { EmptyStackError } from '../errors/emptyStack.error';

export class StackService<T extends string | number> {
  private head: StackNode<T> | null = null;
  private tail: StackNode<T> | null = null;

  public push(item: T) {
    const newNode = new StackNode<T>(item);
    if (this.head == null) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }

    const currentLastNode = this.tail!;
    currentLastNode.next = newNode;
    newNode.previous = currentLastNode;
    this.tail = newNode;
  }

  public pop(): T {
    if (this.head == null) throw new EmptyStackError();

    const item = this.tail!.item;
    if (this.tail!.previous == null) {
      this.head = null;
      this.tail = null;
      return item;
    }
    const tailPrevious = this.tail!.previous;
    const newLast = new StackNode<T>(tailPrevious.item, tailPrevious.next, tailPrevious.previous);
    newLast.next = null;
    this.tail = newLast;
    return item;
  }
}

class StackNode<T> {
  item: T;

  next: StackNode<T> | null;

  previous: StackNode<T> | null;

  constructor(item: T, next: StackNode<T> | null = null, previous: StackNode<T> | null = null) {
    this.item = item;
    this.next = next;
    this.previous = previous;
  }
}
