import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import client from '../../api/client';
import { Upload } from 'lucide-react';

const CATEGORIES = ['residential', 'commercial', 'plot', 'agricultural'];
const TYPES = {
  residential: ['House', 'Flat', 'Apartment', 'Room'],
  commercial: ['Shop', 'Office', 'Warehouse', 'Building'],
  plot: ['Residential Plot', 'Commercial Plot'],
  agricultural: ['Farm', 'Agricultural Land', 'Farmhouse'],
};

export default function AddPropertyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [uploads, setUploads] = useState<Array<{ key: string; url: string }>>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'residential',
    type: 'House',
    purpose: 'buy',
    price: '',
    area: '',
    area_unit: 'marla',
    bedrooms: '',
    bathrooms: '',
    city: '',
    area_name: '',
    address: '',
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const propertyRes = await client.post('/properties', {
        ...formData,
        price: Number(formData.price),
        area: formData.area ? Number(formData.area) : null,
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
      });

      const propertyId = propertyRes.data.id;

      for (const upload of uploads) {
        await client.post('/upload/confirm', {
          propertyId,
          s3Key: upload.key,
          s3Url: upload.url,
          isPrimary: uploads[0].key === upload.key,
        });
      }

      return propertyRes.data;
    },
    onSuccess: () => {
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Error creating property:', error);
      alert('Failed to create property. Please check console for details.');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      for (const file of selectedFiles) {
        try {
          const presignedRes = await client.post('/upload/presigned', {
            propertyId: 'temp',
            filename: file.name,
            contentType: file.type,
          });

          const uploadUrl = presignedRes.data.presignedUrl;
          await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': file.type },
            body: file,
          });

          setUploads((prev) => [
            ...prev,
            { key: presignedRes.data.s3Key, url: presignedRes.data.s3Url },
          ]);
        } catch (error) {
          console.error('Upload failed:', error);
          alert('Failed to upload image: ' + file.name);
        }
      }
    }
  };

  const stepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h2 className="text-3xl font-light text-slate-700 mb-2">
                <span className="font-semibold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">Property Type</span>
              </h2>
              <p className="text-sm text-slate-600 font-light">Tell us about your property</p>
            </div>
            <div>
              <label className="block text-sm font-light text-slate-700 mb-3">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) => {
                  handleChange(e);
                  setFormData((prev) => ({
                    ...prev,
                    type: TYPES[e.target.value as keyof typeof TYPES][0],
                  }));
                }}
                className="input-field"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-light text-slate-700 mb-3">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="input-field">
                {TYPES[formData.category as keyof typeof TYPES].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-light text-slate-700 mb-3">Purpose</label>
              <select name="purpose" value={formData.purpose} onChange={handleChange} className="input-field">
                <option value="buy">Buy</option>
                <option value="rent">Rent</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h2 className="text-3xl font-light text-slate-700 mb-2">
                <span className="font-semibold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">Location</span>
              </h2>
              <p className="text-sm text-slate-600 font-light">Where is your property located?</p>
            </div>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="input-field"
              required
            />
            <input
              type="text"
              name="area_name"
              value={formData.area_name}
              onChange={handleChange}
              placeholder="Area/Neighborhood"
              className="input-field"
            />
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full Address"
              className="input-field rounded-2xl h-24"
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h2 className="text-3xl font-light text-slate-700 mb-2">
                <span className="font-semibold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">Details</span>
              </h2>
              <p className="text-sm text-slate-600 font-light">Property information</p>
            </div>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Property Title"
              className="input-field"
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="input-field rounded-2xl h-24"
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price (PKR)"
              className="input-field"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="Area"
                className="input-field"
              />
              <select name="area_unit" value={formData.area_unit} onChange={handleChange} className="input-field">
                <option value="marla">Marla</option>
                <option value="kanal">Kanal</option>
                <option value="sqft">Sq Ft</option>
                <option value="sqyd">Sq Yd</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                placeholder="Bedrooms"
                className="input-field"
              />
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                placeholder="Bathrooms"
                className="input-field"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h2 className="text-3xl font-light text-slate-700 mb-2">
                <span className="font-semibold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">Images</span>
              </h2>
              <p className="text-sm text-slate-600 font-light">Upload beautiful photos</p>
            </div>
            <div className="border-2 border-dashed border-green-300 rounded-3xl p-12 text-center cursor-pointer hover:bg-green-50 hover:border-green-400 transition-all">
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
                id="fileInput"
              />
              <label htmlFor="fileInput" className="cursor-pointer">
                <Upload className="mx-auto mb-4 text-green-400" size={40} />
                <p className="font-light text-slate-700 text-lg">Click to upload images</p>
                <p className="text-sm text-slate-500 font-light mt-2">PNG, JPG up to 10 images</p>
              </label>
            </div>

            {uploads.length > 0 && (
              <div className="bg-green-50 rounded-2xl p-6">
                <p className="font-light text-slate-700 mb-4">{uploads.length} image{uploads.length !== 1 ? 's' : ''} uploaded</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {uploads.map((upload, idx) => (
                    <div key={idx} className="relative">
                      <img src={upload.url} alt="Property" className="w-full h-24 object-cover rounded-xl" />
                      {idx === 0 && <div className="absolute top-2 left-2 bg-green-400 text-white text-xs px-2 py-1 rounded">Primary</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const steps = [
    { number: 1, label: 'Type' },
    { number: 2, label: 'Location' },
    { number: 3, label: 'Details' },
    { number: 4, label: 'Images' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-10">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            {steps.map((s, idx) => (
              <div key={s.number} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-light transition-all ${
                  step >= s.number
                    ? 'bg-gradient-to-r from-green-400 to-green-300 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {s.number}
                </div>
                <p className={`text-xs font-light ml-2 ${step >= s.number ? 'text-slate-700' : 'text-slate-500'}`}>
                  {s.label}
                </p>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ml-4 rounded-full transition-all ${
                    step > s.number ? 'bg-green-400' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {stepContent()}

        {/* Buttons */}
        <div className="flex gap-4 mt-12">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="btn-secondary flex-1">
              Back
            </button>
          )}
          {step < 4 ? (
            <button onClick={() => setStep(step + 1)} className="btn-primary flex-1">
              Next
            </button>
          ) : (
            <button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending}
              className="btn-primary flex-1"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Listing'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
