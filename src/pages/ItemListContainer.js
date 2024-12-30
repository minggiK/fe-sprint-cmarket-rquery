import React, { useEffect, useState } from "react";

import Item from "../components/Item";
import SearchBar from "../components/SearchBar";

import { useItems } from "../query/Items"; // useItems 훅을 임포트합니다.
import { useCartItems, useAddCartItem } from "../query/CartItems"; // useItems 훅을 임포트합니다.
import { useSetToast } from "../query/Toast"; // useItems 훅을 임포트합니다.

function ItemListContainer() {
  const addCartItemsMutation = useAddCartItem();
  const [searchKeyword, setSearchKeyword] = useState('');

  const {
    data: items = null,
    isLoading: isLoadingItems = true,
    isError: isErrorItems = false,
    error: errorItems = null,
    refetch: refetchItems,
  } = useItems(searchKeyword);

  const {
    data: cartItems = null,
    isLoading: isLoadingCartItems = true,
    isError: isErrorCartItems = false,
    error: errorCartItems = null,
  } = useCartItems();

  const setToastMutation = useSetToast();

  const handleClick = (item) => {
    if (!cartItems.map((el) => el.itemId).includes(item.id)) {
      //TODO: mutate 함수를 호출하여 아이템 추가에 대한 액션을 전달하세요.
      addCartItemsMutation.mutate({
        itemId : item.id ,
        quantity : 1
      })
      setToastMutation.mutate({
        message: `장바구니에 ${item.name}이(가) 추가되었습니다.`,
        type: "info",
      });
    } else {
      setToastMutation.mutate({
        message: `이미 추가된 상품입니다.`,
        type: "warning",
      });
    }
  };

  useEffect( () => {
    refetchItems()
  }, [searchKeyword, refetchItems])

  const searchClick = (keyword) => {
    setSearchKeyword(keyword)
  }

  if (isLoadingItems || isLoadingCartItems) return <p>Loading...</p>;
  if (isErrorItems || isErrorCartItems) {
    return (
      <div>
        <p>Error...</p>
        {isErrorItems && (
          <p>
            {errorItems.message || "An error occurred while fetching items."}
          </p>
        )}
        {isErrorCartItems && (
          <p>
            {errorCartItems.message ||
              "An error occurred while fetching cart items."}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div id="search-container">
        <SearchBar
          onSearch={searchClick}
        />
      </div>
      <div id="item-list-container">
        <div id="item-list-body">
          <div id="item-list-title">쓸모없는 선물 모음</div>
          {items.map((item, idx) => (
            <Item
              item={item}
              key={idx}
              handleClick={() => {
                handleClick(item);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ItemListContainer;
