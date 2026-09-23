import React from 'react';
import { HeaderNav } from './home/HeaderNav.jsx';

export const Header = ({ onOpenJago, onOpenCompare }) => {
  return <HeaderNav onOpenJago={onOpenJago} onOpenCompare={onOpenCompare} />;
};

export default Header;
