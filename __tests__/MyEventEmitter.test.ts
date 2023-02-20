import MyEventEmitter from "../src/MyEventEmitter";
// import MyEventEmitter from "events"; // Fails on last test (with my own custom console.error)

describe("MyEventEmitter", () => {
  const testPrepend = (emitter: MyEventEmitter, eventName = "prepend") => {
    const order: number[] = [];
    const setOrder = (n: number) => () => {
      order.push(n);
    };
    const fn1 = jest.fn(setOrder(1));
    const fn2 = jest.fn(setOrder(2));
    const fn3 = jest.fn(setOrder(3));
    const fn4 = jest.fn(setOrder(4));

    emitter.prependListener(eventName, fn1);
    emitter.on(eventName, fn3);
    emitter.on(eventName, fn4);
    emitter.prependListener(eventName, fn2);
    emitter.emit(eventName, "arg1", "arg2");

    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn1).toHaveBeenCalledWith("arg1", "arg2");
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledWith("arg1", "arg2");
    expect(fn3).toHaveBeenCalledTimes(1);
    expect(fn3).toHaveBeenCalledWith("arg1", "arg2");
    expect(fn4).toHaveBeenCalledTimes(1);
    expect(fn4).toHaveBeenCalledWith("arg1", "arg2");

    expect(order).toEqual([2, 1, 3, 4]);
  };

  const testRepeatedEvents = (
    emitter: MyEventEmitter,
    eventName = "repeated"
  ) => {
    const fn0 = jest.fn();
    const fn1 = jest.fn();
    const fn2 = jest.fn();

    emitter.on(eventName, fn2);
    emitter.on(eventName, fn1);
    emitter.on(eventName, fn0);
    emitter.on(eventName, fn1);
    emitter.on(eventName, fn2);
    emitter.on(eventName, fn0);
    emitter.on(eventName, fn0);
    emitter.emit(eventName, "arg1", "arg2");
    expect(fn0).toHaveBeenCalledTimes(3);
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn1).toHaveBeenCalledWith("arg1", "arg2");
    expect(fn2).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledWith("arg1", "arg2");
  };

  const testRemoveEvent = (emitter: MyEventEmitter, eventName = "remove") => {
    testRemoveFirst(emitter, eventName + "1");
    testRemoveMiddle(emitter, eventName + "2");
    testRemoveLast(emitter, eventName + "3");
  };

  const testRemoveFirst = (
    emitter: MyEventEmitter,
    eventName = "deleteFirst"
  ) => {
    const fn0 = jest.fn();
    const fn0_2 = jest.fn();
    emitter.on(eventName, fn0);
    for (let i = 0; i < 5; i++) {
      emitter.on(eventName, fn0_2);
    }
    emitter.removeListener(eventName, fn0);

    emitter.emit(eventName);
    expect(fn0).not.toHaveBeenCalled();
  };

  const testRemoveLast = (
    emitter: MyEventEmitter,
    eventName = "deleteLast"
  ) => {
    const fn0 = jest.fn();
    const fn0_2 = jest.fn();
    emitter.on(eventName, fn0_2);
    for (let i = 0; i < 5; i++) {
      emitter.on(eventName, fn0);
    }
    emitter.removeListener(eventName, fn0_2);
    emitter.emit(eventName);
    expect(fn0_2).not.toHaveBeenCalled();
  };

  const testRemoveMiddle = (
    emitter: MyEventEmitter,
    eventName = "deleteLast"
  ) => {
    const fn0 = jest.fn();
    const fn0_2 = jest.fn();
    for (let i = 0; i < 5; i++) {
      emitter.on(eventName, fn0);
    }
    emitter.on(eventName, fn0_2);
    for (let i = 0; i < 5; i++) {
      emitter.on(eventName, fn0);
    }
    emitter.removeListener(eventName, fn0_2);
    emitter.emit(eventName);
    expect(fn0_2).not.toHaveBeenCalled();
  };

  it("should add 1 eventName, 1 listener and emit it", () => {
    const fn = jest.fn();
    const emitter = new MyEventEmitter();
    emitter.on("hello", fn);
    emitter.emit("hello", "one");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("one");
  });

  it("should add 1 eventName, many listeners and emit them", () => {
    const fn0 = jest.fn();
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const emitter = new MyEventEmitter();
    emitter.on("many", fn0);
    emitter.on("many", fn1);
    emitter.on("many", fn2);
    emitter.emit("many", "arg1", "arg2");
    expect(fn0).toHaveBeenCalledTimes(1);
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn1).toHaveBeenCalledWith("arg1", "arg2");
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledWith("arg1", "arg2");
  });

  it("should add many listeners repeated times and emit them", () => {
    const emitter = new MyEventEmitter();
    testRepeatedEvents(emitter);
  });

  it("should add with prepend at the start", () => {
    const emitter = new MyEventEmitter();
    testPrepend(emitter);
  });

  it("should remove listeners", () => {
    const emitter = new MyEventEmitter();
    testRemoveEvent(emitter);
  });

  it("should have diferentes event names", () => {
    const emitter = new MyEventEmitter();
    testRepeatedEvents(emitter, "first");
    testRepeatedEvents(emitter, "second");
    testPrepend(emitter, "third");
    testPrepend(emitter, "fourth");
    testRemoveEvent(emitter, "fifth");
    testRemoveEvent(emitter, "last");
  });

  it("should notify when error", () => {
    const emitter = new MyEventEmitter();
    const fn = jest.fn();
    console.error = fn;

    emitter.emit("nonExisting");
    expect(fn).toHaveBeenCalledWith("No event name found for: nonExisting");
    expect(fn).toHaveBeenCalledTimes(1);

    let result = emitter.removeListener("nonExisting", () => {});
    expect(fn).toHaveBeenCalledWith("No event name found for: nonExisting");
    expect(fn).toHaveBeenCalledTimes(2);
    expect(result).toBe(false);

    emitter.on("noFn", () => {});
    result = emitter.removeListener("noFn", () => {});
    expect(result).toBe(false);
  });
});
