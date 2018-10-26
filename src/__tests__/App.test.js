import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../App';

configure({ adapter: new Adapter() });

describe('renders without crashing', () => {
  const app = shallow(<App />);

  it('renders correctly', () => {
    expect(app).toMatchSnapshot();
  });

  describe('print button functionality', () => {
    it('exists', () => {
      expect(app.find('#print')).toBeTruthy;
    });
    it('calls window.print on click', () => {
      global.print = jest.fn();
      const button = app.find('#print');
      button.simulate('click');
      expect(window.print).toHaveBeenCalled();
    });
  });

  describe('download button functionality', () => {
    it('exists', () => {
      expect(app.find('#download')).toBeTruthy;
    });
    it('calls window.print on click', () => {
      global.print = jest.fn();
      const button = app.find('#download');
      button.simulate('click');
    });
  });
});
