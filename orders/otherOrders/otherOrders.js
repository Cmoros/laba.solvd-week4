const fs = require("fs");

/*
The Promise created with Promise.resolve() is indeed resolved immediately, but the callback function provided to the then() method is not executed immediately. Instead, the callback function is added to the Promise's "microtask queue", which means it will be executed as soon as the current "macro" task (which is executing the promises function in this case) has finished executing.
*/

// 1
// 1 -> 2 -> 4 -> 3
const promiseInstaResolved = () => {
  console.log("1");
  Promise.resolve().then(() => console.log("2"));
  console.log("3");
};

// 2
// 1 -> 2 -> 3 -> 4
const awaitPromiseWNextTick = async () => {
  console.log("1");
  // this logs before 3
  process.nextTick(() => console.log("2"));
  const promise2 = await Promise.resolve("3");
  // logs after 2, before 4
  console.log(promise2);
  console.log("4");
};

// 3
// 1 -> 4 -> 2 -> 3
const promiseWNextTick = () => {
  console.log("1");
  // logs before 3, after 4
  process.nextTick(() => console.log("2"));
  // logs after 2
  Promise.resolve().then(() => console.log("3"));
  console.log("4");
};

// 4
// 1 -> 2 -> 3
const awaitPromiseInstaResolved = async () => {
  console.log("1");
  // const promise1 = await new Promise((res) => res(console.log("2")));
  await Promise.resolve("2").then(console.log);
  console.log("3");
};

// 5
// A -> B -> C
// OR - B -> A -> C
const timerImmediate = () => {
  setTimeout(() => console.log("A"), 0);
  setImmediate(() => console.log("B"));
  setTimeout(() => console.log("C"), 0);
};

// 6
// A -> B -> C
// OR - B -> A -> C
const asyncTimerImmediate = async () => {
  setTimeout(() => console.log("A"), 0);
  setImmediate(() => console.log("B"));
  setTimeout(() => console.log("C"), 0);
};

// 7
// START -> END -> A -> C -> B
// Different From timerImmediate()
const timerImmediateWLogs = () => {
  console.log("START");
  setTimeout(() => console.log("A"), 0);
  setImmediate(() => console.log("B"));
  setTimeout(() => console.log("C"), 0);
  console.log("END");
};

// 8
// START -> END -> A -> C -> B
// Different from asyncTimerImmediate()
const asyncTimerImmediateWLogs = async () => {
  console.log("START");
  setTimeout(() => console.log("A"), 0);
  setImmediate(() => console.log("B"));
  setTimeout(() => console.log("C"), 0);
  console.log("END");
};

// promiseInstaResolved(); // 1
// awaitPromiseWNextTick(); // 2
// promiseWNextTick();  // 3
// awaitPromiseInstaResolved(); // 4
// timerImmediate();  // 5
// asyncTimerImmediate(); // 6
// timerImmediateWLogs(); // 7
// asyncTimerImmediateWLogs();  // 8
