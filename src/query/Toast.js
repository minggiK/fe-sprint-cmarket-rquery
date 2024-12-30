// API를 사용하지 않는 전역 상태의 예입니다.

import { useQuery, useMutation, useQueryClient } from 'react-query';

// 간단한 토스트 상태 저장소 (실제로는 다양한 저장 방법이 가능합니다)
const toastState = {
  message: null,
  type: 'info', // or 'error', 'warning', 'success'
};

// 토스트 상태 저장소 API - 외부 API를 호출하지 않습니다.
const getToast = () => toastState;
const setToast = ({ message, type }) => {
  toastState.message = message;
  toastState.type = type;
};

export const useToast = () => {
  return useQuery('toast', getToast, {
    staleTime: Infinity, // 한번만 갱신할거야 
  });
};

export const useSetToast = () => {
  // QueryClient는 React Query의 핵심 기능들을 제공하는 객체로, 데이터를 가져오고(cache), 다시 가져오기(refetch), 동기화하기(synchronize) 등의 작업을 처리합니다.
  const queryClient = useQueryClient();  
  // useMutation은 API 호출 또는 사이드 이펙트를 가진 함수를 실행하고 그 결과를 추적합니다.
  return useMutation(setToast, {
    // 실제 서버를 호출 하지 않고 상태를 변경합니다.
    onMutate: (newToast) => {
      //상태는 서버에서 관리해야하기 때문에 ReactClient에서 5분마다 교체하는 것 
      //UI를 교체하기 위한 상태, 서버와는 상관없이 관리되는 데이터=> 장바구니 추가 됐을 때 알람(화면에 나왔다가 사라짐) 
      //선택할 때마다 새로 나온다 success (set : 원하는 타입을 지정, 수정 / get : 가져오는 것)
      queryClient.setQueryData('toast', newToast);
    },
  });
};


