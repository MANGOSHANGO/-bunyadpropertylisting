import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import client from '../api/client';
import PropertyCard from '../components/PropertyCard';
import { Filter } from 'lucide-react';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    purpose: (searchParams.get('purpose') || 'buy') as 'buy' | 'rent',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    page: 1,
  });

  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && key !== 'page') params.append(key, String(value));
      });
      params.append('limit', '12');
      params.append('page', String(filters.page));
      return client.get(`/properties?${params}`).then((res) => res.data);
    },
  });

  useEffect(() => {
    const newParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'page') newParams.set(key, String(value));
    });
    setSearchParams(newParams);
  }, [filters, setSearchParams]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-light text-slate-700 mb-8">Search <span className="font-semibold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">Properties</span></h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="font-medium text-lg mb-4 flex items-center gap-2 text-slate-800">
                <Filter size={20} className="text-green-400" /> Filters
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-light text-slate-700 mb-2">Purpose</label>
                  <select
                    value={filters.purpose}
                    onChange={(e) => handleFilterChange('purpose', e.target.value)}
                    className="input-field"
                  >
                    <option value="buy">Buy</option>
                    <option value="rent">Rent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-light text-slate-700 mb-2">City</label>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    placeholder="Enter city"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-slate-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Types</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="plot">Plot</option>
                    <option value="agricultural">Agricultural</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-light text-slate-700 mb-2">Min Price (PKR)</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="0"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-slate-700 mb-2">Max Price (PKR)</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="999999999"
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden btn-secondary mb-4 w-full flex items-center justify-center gap-2"
            >
              <Filter size={20} /> Toggle Filters
            </button>

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-slate-500 font-light">Loading properties...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {properties?.properties?.map((property: any) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>

                {properties?.pagination && (
                  <div className="flex justify-center gap-2 flex-wrap">
                    {Array.from({ length: properties.pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setFilters((prev) => ({ ...prev, page }))}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          filters.page === page
                            ? 'btn-primary'
                            : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
