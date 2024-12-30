import React, { useState, useEffect } from 'react'
import CartItem from '../components/CartItem'
import OrderSummary from '../components/OrderSummary'
import { useItems } from '../query/Items';  // useItems 훅을 임포트합니다.
import { useCartItems, useUpdateCartItem, useDeleteCartItem} from '../query/CartItems';  // useItems 훅을 임포트합니다.

export default function ShoppingCart() {

  const {
    data: items = null,
    isLoading: isLoadingItems = true,
    isError: isErrorItems = false,
    error: errorItems = null
  } = useItems('');
  
  const {
    data: cartItems = null,
    isLoading: isLoadingCartItems = true,
    isError: isErrorCartItems = false,
    error: errorCartItems = null
  } = useCartItems();

  const updateCartItemsMutation = useUpdateCartItem();
  const deleteCartItemsMutation = useDeleteCartItem(); 

  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    if (!isLoadingCartItems && !isErrorCartItems) {
      setCheckedItems(cartItems.map((el) => el.itemId));
    }
  }, [isLoadingCartItems, isErrorCartItems, cartItems]);

  const handleCheckChange = (checked, id) => {
    if (checked) {
      setCheckedItems([...checkedItems, id]);
    }
    else {
      setCheckedItems(checkedItems.filter((el) => el !== id));
    }
  };

  const handleAllCheck = (checked) => {
    if (checked) {
      setCheckedItems(cartItems.map((el) => el.itemId))
    }
    else {
      setCheckedItems([]);
    }
  };

  const handleQuantityChange = (quantity, itemId) => {
    //TODO: mutation 함수를 호출하여 정보를 업데이트 하세요.
    
  //   updateCartItemsMutation.mutate(cartItems.map ((cartItem) => cartItem.itemId === itemId ?
  //     {...cartItem, 
  //     quantity : quantity}
  //   : cartItem) 
  // );

    // const itemQuantity = cartItems.find((cartItem) => cartItem.itemId === itemId ?  updateCartItemsMutation.mutate({id : itemQuantity.id, itemId : itemId, quantity: quantity }) : null ) ;
    const itemQuantity = cartItems.find((cartItem) => cartItem.itemId === itemId )
    if(itemQuantity) {
    updateCartItemsMutation.mutate({id : itemQuantity.id, itemId : itemId, quantity: quantity })
    } else {console.log("item not find"); }
   
   
  }

  const handleDelete = (itemId) => {
    setCheckedItems(checkedItems.filter((el) => el !== itemId))

    //TODO: mutation 함수를 호출하여 항목을 삭제 하세요.
    const selectItem = cartItems.find((cartItem) => cartItem.id === itemId)
    if(selectItem) {
      deleteCartItemsMutation.mutate(selectItem.id);
    } 

    deleteCartItemsMutation.mutate(cartItems.find((cartItem) => cartItem.itemId === itemId).id);

   
    console.log(cartItems.id)
  }

  const getTotal = () => {

    if (checkedItems.length <= 0) return 0;

    let cartIdArr = cartItems.map((el) => el.itemId)
    let total = {
      price: 0,
      quantity: 0,
    }
    for (let i = 0; i < cartIdArr.length; i++) {
      if (checkedItems.indexOf(cartIdArr[i]) > -1) {
        let quantity = cartItems[i].quantity
        let price = items.filter((el) => el.id === cartItems[i].itemId)[0].price

        total.price = total.price + quantity * price
        total.quantity = total.quantity + quantity
      }
    }
    return total
  }

  if (isLoadingItems || isLoadingCartItems) return <p>Loading...</p>;
  if (isErrorItems || isErrorCartItems) {
    return (
      <div>
        <p>Error...</p>
        {isErrorItems && <p>{errorItems.message || 'An error occurred while fetching items.'}</p>}
        {isErrorCartItems && <p>{errorCartItems.message || 'An error occurred while fetching cart items.'}</p>}
      </div>
    );
  }
   
  const renderItems = items.filter((el) => cartItems.map((el) => el.itemId).indexOf(el.id) > -1)
  const total = getTotal()

  return (
    <div id="item-list-container">
      <div id="item-list-body">
        <div id="item-list-title">장바구니</div>
        <span id="shopping-cart-select-all">
          <input
            type="checkbox"
            checked={
              checkedItems.length === cartItems.length ? true : false
            }
            onChange={(e) => handleAllCheck(e.target.checked)} >
          </input>
          <label >전체선택</label>
        </span>
        <div id="shopping-cart-container">
          {!cartItems.length ? (
            <div id="item-list-text">
              장바구니에 아이템이 없습니다.
            </div>
          ) : (
              <div id="cart-item-list">
                {renderItems.map((item, idx) => {
                  const quantity = cartItems.filter(el => el.itemId === item.id)[0].quantity
                  return <CartItem
                    key={idx}
                    handleCheckChange={handleCheckChange}
                    handleQuantityChange={handleQuantityChange}
                    handleDelete={handleDelete}
                    item={item}
                    checkedItems={checkedItems}
                    quantity={quantity}
                  />
                })}
              </div>
            )}
          <OrderSummary total={total.price} totalQty={total.quantity} />
        </div>
      </div >
    </div>
  )
}
