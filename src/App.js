import React, { useState } from "react";
import Nav from "./components/Nav";
import ItemListContainer from "./pages/ItemListContainer";
import NotificationCenter from "./components/NotificationCenter";
import "./App.css";
import "./variables.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShoppingCart from "./pages/ShoppingCart";

// 전역 상태 사용을 위해 추가합니다.
import { QueryClient, QueryClientProvider } from "react-query";

// QueryClient는 React Query에서 사용하는 핵심 클래스입니다. 
// 이것은 모든 쿼리의 상태와 설정을 관리합니다. QueryClient를 생성할 때, defaultOptions와 같은 구성 옵션을 전달할 수 있습니다. 
// 이 구성 옵션을 통해 여러 쿼리에 대한 기본 설정을 지정할 수 있습니다.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5분에 한번씩 상태를 업데이트 합니다.
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<ItemListContainer />} />
          <Route path="/shoppingcart" element={<ShoppingCart />} />
        </Routes>
        <NotificationCenter />
        <img
          id="logo_foot"
          src={`${process.env.PUBLIC_URL}/codestates-logo.png`}
          alt="logo_foot"
        />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
