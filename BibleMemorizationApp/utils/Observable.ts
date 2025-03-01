export class Observable<T> {
  private value: T;
  private observers: ((value: T) => void)[] = [];

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  get(): T {
    return this.value;
  }

  set(newValue: T): void {
    this.value = newValue;
    this.notify();
  }

  subscribe(observer: (value: T) => void): () => void {
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.filter(obs => obs !== observer);
    };
  }

  private notify(): void {
    this.observers.forEach(observer => observer(this.value));
  }
}
