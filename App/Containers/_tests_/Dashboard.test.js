import React from 'react';
import renderer from 'react-test-renderer';
import { Dashboard } from "../Dashboard/Dashboard";

// const TestD = require("../Dashboard/Dashboard");

// const TestD = require("../Dashboard/TestD");
import TestD from "../Dashboard/TestD";

describe("TestD", () => {
  const testD = new TestD();
  console.log("in testD");

  test("defines is_on()", () => {
    expect(typeof testD.is_on).toBe("function");
  });
});

// describe("Tests for is_on()", () => {

//   const dashboard = new Dashboard();
//   console.log(dashboard);

//   // test('check for True output', () => {
//   //   expect(is_on(0)).toBe(1);
//   // });

// });

// describe("Tests for is_on()", () => {

//   const test = new TestD();
//   console.log(test);

//   // test('check for True output', () => {
//   //   expect(is_on(0)).toBe(1);
//   // });

// });
