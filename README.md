# Week 2 Homework

### Laba.Solvd Nodejs Course

## About

---

### Assignment

Create your own realisation of EventEmitter. It should support 4 methods:

1. `emitter.emit(eventName[, ...args])` - Synchronously calls each of the listeners registered for the event named eventName, in the order they were registered, passing the supplied arguments to each.
2. `emitter.on(eventName, listener)` - Adds the listener function to the end of the listeners array for the event named eventName. No checks are made to see if the listener has already been added. Multiple calls passing the same combination of eventName and listener will result in the listener being added, and called, multiple times.
3. `emitter.prependListener(eventName, listener)` - Adds the listener function to the beginning of the listeners array for the event named eventName. No checks are made to see if the listener has already been added. Multiple calls passing the same combination of eventName and listener will result in the listener being added, and called, multiple times.
4. `emitter.removeListener(eventName, listener)` - Removes the specified listener from the listener array for the event named eventName.

## Getting Started

---

### Prerequisites

```sh
npm install npm@latest -g
```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Cmoros/laba.solvd-week4.git
   ```
2. Go to the project folder

   ```sh
   cd laba.solvd-week4
   ```

3. Install NPM packages
   ```sh
   npm install
   ```

## Usage

---

To Test `MyEventEmitter`:

```sh
npm t
```

---

## Extra

There is also a explained solution of order of execution of the next exercise:

![ordeofexecution](./assets/img/orderOfExecution.png)

### [🔗 Main Exercise](./orders/order.ts)

#### [🔗 Explanation](./orders/README.md)

#### [🔗 Other orders of execution / tests](./orders/otherOrders/)
