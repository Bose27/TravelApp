import { getTripData } from "../client/js/app";

// The describe() function takes two arguments - a string description, and a test suite as a callback function.
// A test suite may contain one or more related tests
describe("Testing the getTripData functionality", () => {
  // The test() function has two arguments - a string description, and an actual test as a callback function.
  test("Testing the getTripData() function", () => {
    expect(getTripData).toBeDefined();
  });
});

describe("Testing the submit functionality", () => {
  test("Should identify if the getTripData function was called or not", () => {
    const getTripData = jest.fn();
    getTripData();
    expect(getTripData).toHaveBeenCalled();
  });
});
