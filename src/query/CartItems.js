import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from 'axios';

/**
 * 장바구니 아이템을 가지고 옵니다. 
 * @returns 
 */
const fetchCartItems = async () => {
  try {
    const response = await axios.get("http://localhost:5001/cartItems");
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : "Network error");
  }
};

/**
 * 장바구니 아이템을 가지고와 "cartItems" 으로 관리 합니다.
 * 
 * @returns 
 */
export const useCartItems = () => {
  // 쿼리 명칭은 중복 되어서는 안됩니다.
  return useQuery("cartItems", fetchCartItems);
};


/**
 * 장바구니 아이템을 추가 합니다.
 * @param {*} newData 
 * @returns 
 */
const addCartItems = async (newData) => {
  try {
    const response = await axios.post(`http://localhost:5001/cartItems`, newData, {
      headers: {
        "Content-Type": "application/json",
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : 'Error adding cartItem');
  }
};

/**
 * 장바구니 아이템을 추가 하고 상태를 최신화합니다.
 * @returns 
 */
export const useAddCartItem = () => {
  const queryClient = useQueryClient(); // 이 줄 추가
  return useMutation(addCartItems, {
    onSuccess: () => {
      // 해당 query key에 해당하는 데이터를 refetch
      queryClient.refetchQueries("cartItems");
    },
  });
};


/**
 * 장바구니 아이템을 삭제 합니다.
 * 
 * @param {*} id 
 * @returns 
 */
const deleteCartItems = async (id) => {
  if (!id) {
    throw new Error("ID is missing in the provided data.");
  }

  try {
    const response = await axios.delete(`http://localhost:5001/cartItems/${id}`, {
      headers: {
        "Content-Type": "application/json",
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : 'Error deleting cartItems');
  }
};

/**
 * 장바구니 아이템 삭제 후에 전역상태를 최신화 합니다.
 * @returns 
 */
export const useDeleteCartItem = () => {
  const queryClient = useQueryClient(); 
  return useMutation(deleteCartItems, {
    onSuccess: () => {
      // 해당 query key에 해당하는 데이터를 refetch
      queryClient.refetchQueries("cartItems");
    },
  });
};

/**
 * 장바구니 아이템을 갱신 합니다.
 * 
 * @param {*} newData 
 * @returns 
 */
const updateCartItem = async (newData) => {

  const { id, ...restOfData } = newData;
  try {
    const response = await axios.patch(`http://localhost:5001/cartItems/${id}`, restOfData, {
      headers: {
        "Content-Type": "application/json",
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : 'Error updating item');
  }
};

/**
 * 장바구니 아이템 갱신 후에 전역상태를 최신화 합니다.
 * 
 * @param {*} newData 
 * @returns 
 */
export const useUpdateCartItem = () => {

  // QueryClient는 React Query의 핵심 기능들을 제공하는 객체로, 데이터를 가져오고(cache), 다시 가져오기(refetch), 동기화하기(synchronize) 등의 작업을 처리합니다.
  const queryClient = useQueryClient(); 
  // useMutation은 API 호출 또는 사이드 이펙트를 가진 함수를 실행하고 그 결과를 추적합니다.
  return useMutation(updateCartItem, {
    onSuccess: () => {
      // 해당 query key에 해당하는 데이터를 refetch
      queryClient.refetchQueries("cartItems");
    },
  });
};


