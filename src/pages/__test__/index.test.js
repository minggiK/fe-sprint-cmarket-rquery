import * as reactRedux from "react-redux";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import ItemListContainer from "../ItemListContainer";
import ShoppingCart from "../ShoppingCart";
import { QueryClient, QueryClientProvider } from "react-query";


const queryClient = new QueryClient({
  defaultOptions: { queries: { suspense: false } },
});

describe("Shopping Pages", () => {
  let cartList, itemList;

  beforeEach(() => {
    cartList = render(
      <QueryClientProvider client={queryClient}>
        <ShoppingCart />
      </QueryClientProvider>,
    );
  });

  // Get 테스트
  test("ShoppingCart에 cartItems가 렌더되어야합니다.", async () => {
    const cartItemElement = await cartList.findByTestId("cart-노른자 분리기");
    expect(cartItemElement).toBeInTheDocument();
  });

  // 추가 테스트
  test("ADD_TO_CART 액션에 따라 ShoppingCart가 렌더되어야 합니다.", async () => {
    itemList = render(
      <QueryClientProvider client={queryClient}>
        <ItemListContainer handleToast={() => {}} />
      </QueryClientProvider>,
    );
    const frog = itemList.getAllByText("장바구니 담기")[2];

    fireEvent.click(frog);

    const cartItemElement = await cartList.findByTestId("cart-개구리 안대");
    expect(cartItemElement).toBeInTheDocument();
  });

  // 삭제 테스트 
  test('REMOVE_FROM_CART 액션에 따라 ShoppingCart가 렌더되어야 합니다.', async () => {
    const target = cartList.queryAllByText("삭제")[1]
    fireEvent.click(target)

    // 1s 동안 대기 : api 호출 시간
    await new Promise(resolve => setTimeout(resolve, 1000));

    cartList.rerender(
      <QueryClientProvider client={queryClient}>
        <ShoppingCart />
      </QueryClientProvider>,
    );

    const cartItemElement1 = cartList.queryByTestId("cart-노른자 분리기")
    const cartItemElement2 = cartList.queryByTestId("cart-개구리 안대")

    expect(cartItemElement2).not.toBeInTheDocument()
    expect(cartItemElement1).toBeInTheDocument()

  })

  // update 테스트 
  test('SET_QUANTITY 액션에 따라 표시 숫자가 렌더되어야 합니다.', async () => {
    let target = await cartList.findByDisplayValue("7")
    fireEvent.change(target, { target: { value: 5 } })

    target = await cartList.findByDisplayValue("5")
    expect(target).toBeInTheDocument()
  })

  // update 테스트 2
  test('SET_QUANTITY 액션에 따라 OrderSummary가 렌더되어야 합니다.', async () => {
    let target = await cartList.findByDisplayValue("5")
    const totalPrice = cartList.queryByText("49500 원")

    fireEvent.change(target, { target: { value: 7 } })

    target = await cartList.findByDisplayValue("7")
    expect(totalPrice.textContent).toBe("69300 원")
  })

});
