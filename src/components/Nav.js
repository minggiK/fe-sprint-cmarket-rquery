import React from 'react';
import { Link } from 'react-router-dom';
import { useCartItems } from '../query/CartItems';  // useItems 훅을 임포트합니다.

function Nav() {
  const {
    data: cartItems = null,
    isLoading: isLoadingCartItems = true,
    isError: isErrorCartItems = false
  } = useCartItems();

  return (
    <div id="nav-body">
      <span id="title">
        <img id="logo" src="../logo.png" alt="logo" />
        <span id="name">CMarket</span>
      </span>
      <div id="menu">
        <Link to="/">상품리스트</Link>
        <Link to="/shoppingcart">
            장바구니<span id="nav-item-counter">{(isLoadingCartItems || isErrorCartItems) ? 0 : cartItems.length}</span>
        </Link>
      </div>
    </div>
  );
}

export default Nav;
