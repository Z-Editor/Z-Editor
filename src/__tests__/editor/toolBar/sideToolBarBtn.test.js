import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SideToolBarBtn from '../../../editor/toolBar/sideToolBarBtn';

configure({ adapter: new Adapter() });

describe('renders without crashing when left', () => {
  const mockInsertFn = jest.fn();

  const sideToolBarBtn = shallow(
    <SideToolBarBtn side="left" type={{ icon: 'icon', symbol: 'symbol' }} insertFn={mockInsertFn} />
  );

  it('renders correctly', () => {
    expect(sideToolBarBtn).toMatchSnapshot();
    expect(sideToolBarBtn.find('img').props().src).toEqual('icon');
  });

  it('left calls on click', () => {
    const button = sideToolBarBtn.find('.rdw-option-wrapper');
    button.simulate('click');
    expect(mockInsertFn).toHaveBeenCalled();
  });
});

describe('renders without crashing when right', () => {
  const mockInsertFn = jest.fn();

  const sideToolBarBtn = shallow(
    <SideToolBarBtn side="right" type={{ icon: 'icon', symbol: 'symbol' }} insertFn={mockInsertFn} />
  );

  it('renders correctly', () => {
    expect(sideToolBarBtn).toMatchSnapshot();
  });

  it('right calls window.print on click', () => {
    const button = sideToolBarBtn.find('.rdw-option-wrapper');
    button.simulate('click');
    expect(mockInsertFn).toHaveBeenCalled();
  });
});
