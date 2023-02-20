import fs from "fs";

async function main() {
  console.log("START"); //A

  setTimeout(() => console.log("SetTimeout"), 0); //B
  setImmediate(() => console.log("SetImmediate")); //C

  Promise.resolve().then(
    // D/E
    () => {
      console.log("Promise"); //D
      process.nextTick(() => console.log("Promise next tick")); //E
    }
  );

  fs.readFile(
    "index.js",
    // F/G/H/I
    () => {
      console.log("Read file"); //F
      setTimeout(() => console.log("Read file SetTimeout"), 0); //G
      setImmediate(() => console.log("Read file SetImmediate")); //H
      process.nextTick(() => console.log("Read file next tick")); //I
    }
  );

  const response = await Promise.resolve("Async/await");
  console.log(response); //J

  process.nextTick(() => console.log("Next tick")); //K
  setTimeout(() => console.log("SetTimeout"), 0); //L

  console.log("END"); //M
}

export default main;
