"use client";

import { createContext, useContext, useState } from "react";

const SearchContext = createContext({
  query: {
    dateRange: { from: null, to: null },
    guests: 1,
    type: "All",
  },
  updateQuery: () => {},
  resetQuery: () => {},
});

const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState({
    dateRange: { from: null, to: null },
    guests: 1,
    type: "All",
  });

  const updateQuery = (params) => {
    setQuery((prev) => ({ ...prev, ...params }));
  };

  const resetQuery = () => {
    setQuery({
      dateRange: { from: null, to: null },
      guests: 1,
      type: null,
    });
  };

  return (
    <SearchContext.Provider value={{ query, updateQuery, resetQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

SearchContext.displayName = "SearchContext";

export default SearchProvider;

export const useSearch = () => useContext(SearchContext);
