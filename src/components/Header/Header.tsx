import './Header.css';

import { HeaderButton } from '../HeaderButton';

const Header = () => {
  return (
    <div className="header">
      <div className="logo">Z-Editor</div>

      <HeaderButton text="Print" />
      <HeaderButton text="Download" />
      <HeaderButton text="Import" />
    </div>
  );
};

export default Header;
