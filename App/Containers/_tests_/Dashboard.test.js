import React from 'react';
import renderer from 'react-test-renderer';
import Dashboard from "../Dashboard/Dashboard";

describe("Tests for is_on()", () => {

  const dashboard = new Dashboard();

  test('define is_on', () => {
    expect(typeof dashboard.is_on).toBe("function");
  });

  // This test is for statically filled stars
  // To be changed once the stars are filled dynamically
  test('test True output', () => {
    expect(dashboard.is_on(0)).toBe(true);
    expect(dashboard.is_on(1)).toBe(true);
    expect(dashboard.is_on(2)).toBe(true);
  });

  // This test is for statically filled stars
  // To be changed once the stars are filled dynamically
  test('test False output', () => {
    expect(dashboard.is_on(3)).toBe(false);
    expect(dashboard.is_on(4)).toBe(false);
    expect(dashboard.is_on(5)).toBe(false);
    expect(dashboard.is_on(6)).toBe(false);
  });

});
