import React from 'react';
import Dashboard from '../Dashboard/Dashboard';
// import { render } from '@testing-library/react-native/pure';
import ShallowRenderer from 'react-test-renderer/shallow';
// import TestRenderer from 'react-test-renderer';

describe("Dynamic Tasks", ()=>{

  // display current task correctly

  // display change correctly


});



// describe("Tests for is_on()", () => {

//   const dashboard = new Dashboard();

//   test('define is_on', () => {
//     expect(typeof dashboard.is_on).toBe("function");
//   });

//   // This test is for statically filled stars
//   // To be changed once the stars are filled dynamically
//   test('test True output', () => {
//     expect(dashboard.is_on(0)).toBe(true);
//     expect(dashboard.is_on(1)).toBe(true);
//     expect(dashboard.is_on(2)).toBe(true);
//   });

//   // This test is for statically filled stars
//   // To be changed once the stars are filled dynamically
//   test('test False output', () => {
//     expect(dashboard.is_on(3)).toBe(false);
//     expect(dashboard.is_on(4)).toBe(false);
//     expect(dashboard.is_on(5)).toBe(false);
//     expect(dashboard.is_on(6)).toBe(false);
//   });
// });

// snapshot
it('renders', () => {
  const renderer = new ShallowRenderer();
  const wrapper = renderer.render(<Dashboard />);

  expect(wrapper).toMatchSnapshot();
});


//TODO: might need to custom renderer to fix redux store requirement for accessing function, currently using shallow copy
// describe('Tests for count_on()', () => {
//   it('should change the password value', () => {


//     // const renderer = new ShallowRenderer();
//     // const renderer = new TestRenderer();
//     // let dashboard = renderer.create(<Dashboard />).getInstance();

// });
