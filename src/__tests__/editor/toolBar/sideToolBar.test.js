import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SideToolBar from '../../../editor/toolBar/sideToolBar';
import { l_config } from '../../../__mocks__/config.mock';

configure({ adapter: new Adapter() });

describe('renders without crashing', () => {
  const mockInsertFn = jest.fn();

  const sideToolBar = shallow(<SideToolBar side={'left'} data={l_config} insertFn={mockInsertFn} />);

  it('renders correctly', () => {
    expect(sideToolBar).toMatchSnapshot();
    expect(sideToolBar.find('ul').length).toBe(1);
    expect(sideToolBar.find('ul').find('SideToolBarBtn').length).toBe(l_config.length);

    for (let i = 0; i < l_config.length; i++) {
      expect(
        sideToolBar
          .find('ul')
          .find('SideToolBarBtn')
          .get(i).props.side
      ).toEqual('left');
      expect(
        sideToolBar
          .find('ul')
          .find('SideToolBarBtn')
          .get(i).props.type
      ).toEqual(l_config[i]);
    }
  });
});
