'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, X } from 'lucide-react';
import { debounce } from '@/lib/utils';

interface EventFiltersProps {
  onFilterChange: (filters: EventFilters) => void;
  categories: string[];
}

export interface EventFilters {
  search: string;
  category: string;
  startDate: string;
  endDate: string;
  priceMin: number | null;
  priceMax: number | null;
}

const initialFilters: EventFilters = {
  search: '',
  category: '',
  startDate: '',
  endDate: '',
  priceMin: null,
  priceMax: null,
};

export function EventFilters({ onFilterChange, categories }: EventFiltersProps) {
  const [filters, setFilters] = useState<EventFilters>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  // Create a debounced version of the filter change handler
  const debouncedFilterChange = debounce((newFilters: EventFilters) => {
    onFilterChange(newFilters);
  }, 300);

  // Update filters and notify parent component
  const updateFilters = (newFilters: Partial<EventFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    debouncedFilterChange(updatedFilters);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters(initialFilters);
    onFilterChange(initialFilters);
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      filters.search !== '' ||
      filters.category !== '' ||
      filters.startDate !== '' ||
      filters.endDate !== '' ||
      filters.priceMin !== null ||
      filters.priceMax !== null
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      {/* Search bar - always visible */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Buscar eventos..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="pl-10"
        />
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        
        <div className="absolute right-3 top-2.5 flex space-x-1">
          {filters.search && (
            <button
              onClick={() => updateFilters({ search: '' })}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Limpar busca"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`text-gray-400 hover:text-gray-600 ${isExpanded ? 'text-purple-600' : ''}`}
            aria-label={isExpanded ? "Esconder filtros" : "Mostrar filtros"}
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Advanced filters - expandable */}
      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                id="category"
                value={filters.category}
                onChange={(e) => updateFilters({ category: e.target.value })}
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Todas as categorias</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Date range */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Data Inicial
              </label>
              <Input
                type="date"
                id="startDate"
                value={filters.startDate}
                onChange={(e) => updateFilters({ startDate: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                Data Final
              </label>
              <Input
                type="date"
                id="endDate"
                value={filters.endDate}
                onChange={(e) => updateFilters({ endDate: e.target.value })}
              />
            </div>
          </div>

          {/* Price range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="priceMin" className="block text-sm font-medium text-gray-700 mb-1">
                Preço Mínimo (R$)
              </label>
              <Input
                type="number"
                id="priceMin"
                min="0"
                step="0.01"
                value={filters.priceMin !== null ? filters.priceMin : ''}
                onChange={(e) => updateFilters({ priceMin: e.target.value ? parseFloat(e.target.value) : null })}
              />
            </div>

            <div>
              <label htmlFor="priceMax" className="block text-sm font-medium text-gray-700 mb-1">
                Preço Máximo (R$)
              </label>
              <Input
                type="number"
                id="priceMax"
                min="0"
                step="0.01"
                value={filters.priceMax !== null ? filters.priceMax : ''}
                onChange={(e) => updateFilters({ priceMax: e.target.value ? parseFloat(e.target.value) : null })}
              />
            </div>
          </div>

          {/* Filter actions */}
          <div className="flex justify-end space-x-2">
            {hasActiveFilters() && (
              <Button
                className="bg-purple-100 text-purple-900 hover:bg-purple-200"
                onClick={resetFilters}
              >
                Limpar Filtros
              </Button>
            )}
            <Button
              className="bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => setIsExpanded(false)}
            >
              Aplicar Filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
