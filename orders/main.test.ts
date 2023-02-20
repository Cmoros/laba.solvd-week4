import main from "./order";

// This errors out, for some reason
// Event loop behavior may depend on the way setImmediate and others fn are called by jest

describe("main-order", () => {
  it("logs in expected order", async () => {
    const fn = jest.fn();
    console.log = fn;

    await new Promise<void>((res) => {
      setTimeout(() => {
        main();
        res();
      }, 1000);
    });

    const expectedOrder = [
      ["START"],
      ["Promise"],
      ["Async/await"],
      ["END"],
      ["Promise next tick"],
      ["Next tick"],
      ["SetTimeout"],
      ["SetTimeout"],
      ["SetImmediate"],
      ["Read file"],
      ["Read file next tick"],
      ["Read file SetImmediate"],
      ["Read file SetTimeout"],
    ];

    expect(fn.mock.calls).toEqual(expectedOrder);
    // Waiting for fs.readFile to finish
    // await new Promise<void>((res) => {
    //   setTimeout(() => {
    //     res();
    //   }, 1000);
    // });
  });
});
