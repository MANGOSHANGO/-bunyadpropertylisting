import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath } from 'lucide-react';
import type { Property } from '../types';

interface PropertyCardProps {
  property: Property & { images?: any[] };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const imageUrl = property.images?.[0]?.s3_url || 'https://via.placeholder.com/300x200?text=No+Image';
  const formatted_price = new Intl.NumberFormat('en-US').format(property.price);

  return (
    <Link to={`/property/${property.id}`}>
      <div className="group bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-52 bg-gray-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded text-xs font-semibold">
            {property.purpose === 'buy' ? 'Sale' : 'Rent'}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2.5 group-hover:text-emerald-600 transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
            <MapPin size={14} />
            <span className="line-clamp-1">{property.area_name || property.city}</span>
          </div>

          <div className="text-emerald-600 font-bold text-base mb-3">
            PKR {formatted_price}
          </div>

          <div className="flex gap-3 text-xs text-gray-600 mb-3">
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <Bed size={14} />
                <span>{property.bedrooms}B</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath size={14} />
                <span>{property.bathrooms}B</span>
              </div>
            )}
          </div>

          <div className="text-xs text-gray-400">
            {new Date(property.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>
    </Link>
  );
}
