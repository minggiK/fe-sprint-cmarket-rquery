import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyDown = (event) => {
    // 사용자가 Enter 키를 누르면 onSearch 함수를 호출합니다.
    if (event.key === 'Enter') {
      onSearch(searchTerm);
    }
  };

  const handleInit = (event) => {
    setSearchTerm('')
    onSearch('')
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="검색..."
        value={searchTerm}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
      />
      <button
        className="search-button"
        onClick={() => onSearch(searchTerm)}
      >
        검색
      </button>
      <button
        className="search-button"
        onClick={() => handleInit()}
      >
        초기화
      </button>
    </div>
  );
};

export default SearchBar;
