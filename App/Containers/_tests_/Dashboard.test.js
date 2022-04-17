import React from 'react';
import renderer from 'react-test-renderer';
import Dashboard from "../Dashboard/Dashboard";



describe("Tests for is_on()", () => {

  const dashboard = new Dashboard();

  test('check for True output', () => {
    expect(dashboard.is_on(0)).toBe(1);
  });

});
