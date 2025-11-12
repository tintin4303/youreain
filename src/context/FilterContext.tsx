// src/context/FilterContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Filters = {
  maxPrice: number | null;
  bedrooms: number | null;
  propertyType: string | null;
  furnished: string | null;
  showFavorites: boolean;
  // NEW fields (amenities + electricity)
  kitchen: boolean;
  gym: boolean;
  swimmingPool: boolean;
  campusVan: boolean;
  maxElectricity: number | null;
};

type FilterContextValue = {
  filters: Filters;
  setFilters: (next: Filters | ((prev: Filters) => Filters)) => void;
};

const defaultFilters: Filters = {
  maxPrice: null,
  bedrooms: null,
  propertyType: null,
  furnished: null,
  showFavorites: false,
  kitchen: false,
  gym: false,
  swimmingPool: false,
  campusVan: false,
  maxElectricity: null,
};

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return ctx;
}
