import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import client from '../api/client';
import { MapPin, Bed, Bath, SquareArrowOutUpRight } from 'lucide-react';
import { useState } from 'react';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [imageIndex, setImageIndex] = useState(0);

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => client.get(`/properties/${id}`).then((res) => res.data),
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center">Property not found</div>;

  const images = property.images?.filter((img: any) => img !== null) || [];
  const currentImage = images[imageIndex] || { s3_url: 'https://via.placeholder.com/600x400' };

  const formatted_price = new Intl.NumberFormat('en-US').format(property.price);

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate('/search')}
          className="text-primary hover:underline mb-6 font-medium"
        >
          ← Back to Search
        </button>

        <div className="card p-6 mb-6">
          {/* Image Gallery */}
          <div className="mb-6">
            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
              <img
                src={currentImage.s3_url}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      imageIndex === idx ? 'border-primary' : 'border-gray-300'
                    }`}
                  >
                    <img src={img.s3_url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-text mb-2">{property.title}</h1>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin size={20} />
                  <span>{property.address || `${property.area_name}, ${property.city}`}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary mb-1">PKR {formatted_price}</div>
                <div className="text-sm text-gray-500">
                  {property.purpose === 'buy' ? 'For Sale' : 'For Rent'}
                </div>
              </div>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-4 gap-4 mb-6 bg-accent/20 p-4 rounded-lg">
              {property.bedrooms && (
                <div>
                  <Bed className="text-primary mb-2" />
                  <p className="text-sm text-gray-600">Bedrooms</p>
                  <p className="text-lg font-semibold text-text">{property.bedrooms}</p>
                </div>
              )}
              {property.bathrooms && (
                <div>
                  <Bath className="text-primary mb-2" />
                  <p className="text-sm text-gray-600">Bathrooms</p>
                  <p className="text-lg font-semibold text-text">{property.bathrooms}</p>
                </div>
              )}
              {property.area && (
                <div>
                  <SquareArrowOutUpRight className="text-primary mb-2" />
                  <p className="text-sm text-gray-600">Area</p>
                  <p className="text-lg font-semibold text-text">
                    {property.area} {property.area_unit}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="text-lg font-semibold text-text capitalize">{property.type}</p>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div>
                <h2 className="text-xl font-bold text-text mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-text mb-4">Contact Agent</h2>
          <button className="w-full btn-primary">
            Show Contact Information
          </button>
        </div>
      </div>
    </div>
  );
}
