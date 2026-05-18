import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { Edit2, Trash2, Eye } from 'lucide-react';

export default function MyListingsPage() {
  const navigate = useNavigate();

  const { data: properties, refetch } = useQuery({
    queryKey: ['myProperties'],
    queryFn: () =>
      client.get('/properties?limit=100').then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => client.delete(`/properties/${id}`),
    onSuccess: () => refetch(),
  });

  const userProperties = properties?.properties || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text">My Listings</h1>
        <button
          onClick={() => navigate('/dashboard/add-property')}
          className="btn-primary"
        >
          + Add New Property
        </button>
      </div>

      {userProperties.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500 mb-4">You haven't listed any properties yet</p>
          <button
            onClick={() => navigate('/dashboard/add-property')}
            className="btn-primary"
          >
            Create First Listing
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-primary">
                <th className="text-left py-3 px-4 font-semibold">Title</th>
                <th className="text-left py-3 px-4 font-semibold">Price</th>
                <th className="text-left py-3 px-4 font-semibold">City</th>
                <th className="text-left py-3 px-4 font-semibold">Type</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userProperties.map((property: any) => (
                <tr key={property.id} className="border-b hover:bg-accent/10 transition-all">
                  <td className="py-4 px-4">{property.title}</td>
                  <td className="py-4 px-4 font-semibold text-primary">
                    PKR {new Intl.NumberFormat('en-US').format(property.price)}
                  </td>
                  <td className="py-4 px-4">{property.city}</td>
                  <td className="py-4 px-4 capitalize">{property.type}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      property.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {property.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-4 flex gap-2">
                    <button
                      onClick={() => navigate(`/property/${property.id}`)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-all"
                    >
                      <Eye size={18} className="text-blue-600" />
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/edit/${property.id}`)}
                      className="p-2 hover:bg-amber-100 rounded-lg transition-all"
                    >
                      <Edit2 size={18} className="text-amber-600" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this property?')) {
                          deleteMutation.mutate(property.id);
                        }
                      }}
                      className="p-2 hover:bg-red-100 rounded-lg transition-all"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
