import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from './App';

configure({ adapter: new Adapter() });

describe('renders without crashing', () => {
  const app = shallow(<App />);

  it('renders correctly', () => {
    expect(app).toMatchSnapshot();
  });

  describe('button functionality', () => {
    it('exists', () => {
      expect(app.find('button')).toBeTruthy;
    });
    it('calls window.print on click', () => {
      global.print = jest.fn();
      const button = app.find('button');
      button.simulate('click');
      expect(window.print).toHaveBeenCalled();
    });
  });
});
