1. ```
   const promiseInstaResolved = () => {
     console.log("1");
     Promise.resolve().then(() => console.log("2"));
     console.log("3");
   };
   ```

   Result: `1 -> 3 -> 2`

   Promise is instantly solved but not ran, instead promise's cb is put into promise queue and ran later

2. ```
   const awaitPromiseWNextTick = async () => {
    console.log("1");
    // this logs before 3
    process.nextTick(() => console.log("2"));
    const promise2 = await Promise.resolve("3");
    // logs after 2, before 4
    console.log(promise2);
    console.log("4");
   };
   ```

   Result: `1 -> 2 -> 3 -> 4`

   Resolved Promise makes async code to run (microtask queues), so it is ran the first cb in the nexttick queue: `() => console.log("2")` and then continues sync code

3. ```
   const promiseWNextTick = () => {
      console.log("1");
      // logs before 3, after 4
      process.nextTick(() => console.log("2"));
      // logs after 2
      Promise.resolve().then(() => console.log("3"));
      console.log("4");
   };
   ```

   Result: `1 -> 4 -> 2 -> 3`

   NextTick cb is enqueued in nexttick queue, Promise is instantly solved but not ran, instead promise's cb is put into promise queue and ran later. Then nextick cbs are ran and later promise cbs

4. ```
    const awaitPromiseInstaResolved = async () => {
      console.log("1");
      // const promise1 = await new Promise((res) => res(console.log("2")));
      await Promise.resolve("2").then(console.log);
      console.log("3");
    };
   ```

   Result: `1 -> 2 -> 3`

   Insta resolved promised is await and then cb is ran instantly (consider that this cb is ran async from promise queue)

5. ```
    const timerImmediate = () => {
      setTimeout(() => console.log("A"), 0);
      setImmediate(() => console.log("B"));
      setTimeout(() => console.log("C"), 0);
    };
   ```

   Expected: `A -> C -> B`

   Result: `A -> B -> C` or `B -> A -> C`

   Expected to be run all timers first and then setImmediate, instead received a race between first setTimeout and setImmediate

6. ```
    const asyncTimerImmediate = async () => {
      setTimeout(() => console.log("A"), 0);
      setImmediate(() => console.log("B"));
      setTimeout(() => console.log("C"), 0);
    };
   ```

   Expected: `A -> C -> B`

   Result: `A -> B -> C` or `B -> A -> C`

   Same as 5

   Expected to be run all timers first and then setImmediate, instead received a race between first setTimeout and setImmediate

7. ```
    const timerImmediateWLogs = () => {
      console.log("START");
      setTimeout(() => console.log("A"), 0);
      setImmediate(() => console.log("B"));
      setTimeout(() => console.log("C"), 0);
      console.log("END");
    };

   ```

   Expected: `START -> END -> A -> C -> B`

   Result: `START -> END -> A -> C -> B`

   Different From timerImmediate() (point 5), seems to be only because of additional console.logs. No explanation yet

8. ```
    const asyncTimerImmediateWLogs = async () => {
      console.log("START");
      setTimeout(() => console.log("A"), 0);
      setImmediate(() => console.log("B"));
      setTimeout(() => console.log("C"), 0);
      console.log("END");
    };
   ```

   Expected: `START -> END -> A -> C -> B`

   Result: `START -> END -> A -> C -> B`

   Same as point 7

   Different From asyncTimerImmediate() (point 6), seems to be only because of additional console.logs. No explanation yet
