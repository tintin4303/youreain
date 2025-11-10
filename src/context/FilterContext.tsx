"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FilterState {
  maxPrice: number | null;
  bedrooms: number | null;
  propertyType: string | null;
  furnished: string | null;
}

const FilterContext = createContext<{
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
} | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>({
    maxPrice: null,
    bedrooms: null,
    propertyType: null,
    furnished: null,
  });

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({
      ...prev,
      maxPrice: newFilters.maxPrice === undefined ? null : newFilters.maxPrice,
      bedrooms: newFilters.bedrooms === undefined ? null : newFilters.bedrooms,
      propertyType: newFilters.propertyType === undefined ? null : newFilters.propertyType,
      furnished: newFilters.furnished === undefined ? null : newFilters.furnished,
    }));
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters: updateFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) throw new Error("useFilters must be used within FilterProvider");
  return context;
}