Event loop phases:

1) Timer
2) CB
3) Idle
4) Prep
5) Poll
6) Check
7) Close

```
Quick Result:

A -> D -> J -> M -> E -> K -> B -> 
-> L -> C -> F -> I -> H -> G


I/Ocbs queues -> [  ]
nexttick queue -> [  ]
promise queue -> [  ]
timer queue -> [  ]
check queue -> [  ]

callstack -> [  ]

---- START RUNNING SYNC CODE FROM MAIN FLOW ----

callstack -> PUSH main() -> [ main() ] ->
-> CALL main() {

  callstack -> PUSH A() -> [ main() , A() ] ->
  -> CALL A() {
    LOGS -> "START" -----------------------------
  }
  callstack -> POP A() -> [ main() ]

  setTimeout( B(), 0) ->
  -> (scheduled almost immediately because of 0 ms delay) ->
  -> timer queue -> ENQUEUE B() -> [ B() ]

  setImmediate( C() ) ->
  check queue -> ENQUEUE C() -> [ C() ]

  Promise.resolve().then( D/E() ) ->
  -> (resolves inmmediately) ->
  -> promise queue -> ENQUEUE D/E() -> [ D/E() ]

  I/O readFile starts in the background

  await Promise.resolve("J") ->
  AWAIT PROCS MICROTASK QUEUES TO EXECUTE BEFORE EVENT LOOP CONTINUES

  ---- EVENT LOOP : MICROTASK QUEUES ----

  promise queue -> DEQUEUE D/E() -> [  ] ->
  -> D/E() ->
  -> callstack -> PUSH D/E() -> [ main() , D/E() ]
  D/E() {

    callstack -> PUSH D() -> [ main() , D/E() , D() ] ->
    -> CALL D() {
      LOGS -> "Promise" -----------------------------------
    }
    callstack -> POP D() -> [ main() , D/E() ]

    nexttick queue -> ENQUEUE E() -> [ E() ]
  }
  callstack -> POP D/E() -> [ main() ]

  ---- EVENT LOOP CONTINUES RUNNING SYNC CODE ----

  callstack -> PUSH J() -> [ main() , J() ]
  -> CALL J() {
    LOGS -> "Async/await" ----------------------------------
  }
  callstack -> POP J() -> [ main() ]

  process.nextTick( J() ) ->
  -> nextTick queue -> ENQUEUE K() -> [ E() , K() ]

  setTimeout( L(), 0 ) ->
  -> (scheduled almost immediately because of 0 ms delay) ->
  -> timer queue -> ENQUEUE L() -> [ B() , L() ]

  callstack -> PUSH M() -> [ main() , M() ] ->
  -> CALL M() {
    LOGS -> "END" ----------------------------------
  }
  callstack -> POP M() -> [ main() ]

}
callstack -> POP main() -> [  ]

CALLSTACK EMPTY

---- EVENT LOOP : MICROTASK QUEUES ----

nexttick queue -> DEQUEUE E() & K() -> [  ]

E() {
  LOGS -> "Promise next tick" ----------------------------------
}

K() {
  LOGS -> "Next tick"K ----------------------------------
}

promise queue empty -> [  ]

EMPTY MICROTASK queues QUEUE

---- EVENT LOOP CONTINUES THROUGH PHASES ----

---- EVENT LOOP : TIMER PHASE ----

timer queue -> DEQUEUE B() & L() -> [  ]

B() {
  LOGS -> "SetTimeout" ----------------------------------
}

L() {
  LOGS -> "SetTimeout" ----------------------------------
}

EMPTY TIMER QUEUE

---- EVENT LOOP : POLL PHASE ----

readFile cb not ready yet to be collected

---- EVENT LOOP : CHECK PHASE ----

check queue -> DEQUEUE C() -> [  ]

C() {
  LOGS -> "SetImmediate" ----------------------------------
}

EMPTY CHECK QUEUE

---- EVENT LOOP AWAIT FOR I/O TO FINISH ----

---- EVENT LOOP : POLL PHASE ----

Event loop collects ReadFile I/O to be run later in CB phase

I/Ocbs queue -> ENQUEUE F/G/H/I() -> [ F/G/H/I() ]

---- EVENT LOOP : CB PHASE ----

I/Ocbs queue -> DEQUEUE F/G/H/I() -> [  ]

F/G/H/I() {

  F() {
    LOGS -> "Read file" ----------------------------------
  }

  timer queue -> ENQUEUE G() -> [ G() ]
  check queue -> ENQUEUE H() -> [ H() ]
  microtask queue -> ENQUEUE I() -> [ I() ]
}

---- EVENT LOOP : MICROTASK QUEUES ----

microtask queue -> DEQUEUE I() -> [  ]

I() {
  LOGS -> "Read file next tick" ----------------------------------
}

---- EVENT LOOP : CHECK PHASE ----

AS setInmediate() WAS CALLED WITHIN I/Ocbs CYCLE ->
-> CALLBACK IS CALLED FIRST THAN TIMERS

check queue -> DEQUEUE H() -> [  ]

H() {
  LOGS -> "Read file SetImmediate" ----------------------------------
}

---- EVENT LOOP : TIMER PHASE ----

timer queue -> DEQUEUE G() -> [  ]

G() {
  LOGS -> "Read file SetTimeout" ----------------------------------
}

```

https://blog.insiderattack.net/handling-io-nodejs-event-loop-part-4-418062f917d1