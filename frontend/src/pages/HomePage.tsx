import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import client from '../api/client';
import PropertyCard from '../components/PropertyCard';
import { Search, MapPin, ArrowRight, Zap, Shield, Users } from 'lucide-react';

const CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Quetta'];

export default function HomePage() {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [purpose, setPurpose] = useState<'buy' | 'rent'>('buy');

  const { data: featuredData } = useQuery({
    queryKey: ['featured'],
    queryFn: () =>
      client
        .get('/properties?limit=6&purpose=' + purpose)
        .then((res) => res.data),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?city=${city}&purpose=${purpose}`);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="pt-20 pb-24 px-6 bg-gradient-to-b from-white via-white to-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-green-300 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tl from-green-200 to-transparent rounded-full blur-3xl"></div>
        </div>
        <div className="relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-light text-slate-600 mb-12 leading-tight">
              Search <span className="font-semibold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">Properties in Pakistan</span>
            </h1>
          </div>

          {/* Single Row Search */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-xl shadow-lg p-1.5 flex flex-col md:flex-row gap-1.5">
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as 'buy' | 'rent')}
                className="flex-shrink-0 px-5 py-3 bg-slate-50 border-0 rounded-lg font-medium text-slate-900 text-sm focus:outline-none"
              >
                <option value="buy">Buy</option>
                <option value="rent">Rent</option>
              </select>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City, area..."
                  className="w-full px-5 py-3 bg-slate-50 border-0 rounded-lg focus:outline-none font-medium text-sm"
                  list="cities"
                />
                <MapPin size={18} className="absolute right-5 top-3.5 text-green-400 pointer-events-none" />
              </div>

              <button
                type="submit"
                className="flex-shrink-0 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-all text-sm"
              >
                <Search size={18} />
                Search
              </button>

              <datalist id="cities">
                {CITIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </form>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-3 justify-center">
            {CITIES.slice(0, 4).map((c) => (
              <button
                key={c}
                onClick={() => navigate(`/search?city=${c}&purpose=${purpose}`)}
                className="px-4 py-2 bg-slate-100 hover:bg-green-50 text-slate-900 rounded-full text-sm font-semibold transition-all"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        </div>
      </div>

      {/* Why BUNYAD */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-light text-slate-800 text-center mb-2">
            Why <span className="font-bold text-slate-900">Trust</span> BUNYAD<span className="text-green-400 font-thin">?</span>
          </h2>
          <p className="text-center text-slate-500 text-lg mb-16 font-light tracking-wide">
            Pakistan's most innovative property platform
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'Find properties in seconds, not days' },
              { icon: Shield, title: 'Fully Verified', desc: 'Every property is authentic & secure' },
              { icon: Users, title: 'Direct Connect', desc: 'Chat with owners instantly' },
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all group">
                <div className="bg-green-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="text-green-400" size={32} />
                </div>
                <h3 className="text-2xl font-medium text-slate-800 mb-3">{item.title}</h3>
                <p className="text-slate-500 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-5xl font-light text-slate-700 mb-2">
                <span className="font-medium">Featured</span> <span className="font-bold text-green-400">Gems</span>
              </h2>
              <p className="text-slate-500 font-light text-lg tracking-wide">Premium properties picked just for you</p>
            </div>
            <button
              onClick={() => navigate(`/search?purpose=${purpose}`)}
              className="hidden md:flex items-center gap-2 text-green-400 hover:text-green-500 font-bold text-base group"
            >
              See All <ArrowRight size={20} className="group-hover:translate-x-2 transition" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredData?.properties?.map((property: any) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="text-center mt-12 md:hidden">
            <button
              onClick={() => navigate(`/search?purpose=${purpose}`)}
              className="btn-primary"
            >
              View All Properties
            </button>
          </div>
        </div>
      </div>

      {/* Cities Grid */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-light text-slate-700 text-center mb-2">
            Explore <span className="font-bold text-green-400">By City</span>
          </h2>
          <p className="text-center text-slate-500 mb-16 font-light text-lg tracking-wider">
            Major cities across Pakistan
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CITIES.map((c) => (
              <button
                key={c}
                onClick={() => navigate(`/search?city=${c}&purpose=${purpose}`)}
                className="p-6 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-green-300 transition-all group"
              >
                <MapPin className="w-6 h-6 mx-auto mb-3 text-green-400 group-hover:scale-125 transition-transform" />
                <p className="font-bold text-slate-900">{c}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-12 px-6 bg-gradient-to-r from-green-400 to-green-300 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-light mb-2 leading-tight">
            Ready to <span className="font-black">List</span><span className="font-thin">?</span>
          </h2>
          <p className="text-xl text-green-50 mb-10 font-light max-w-2xl mx-auto tracking-wide">
            Join thousands of property owners reaching qualified buyers across Pakistan
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-10 py-4 bg-white text-green-400 font-bold rounded-lg hover:bg-slate-100 transition-all text-lg shadow-xl"
          >
            List Property Free →
          </button>
          <p className="text-green-50 mt-6 font-light">Takes just 5 minutes</p>
        </div>
      </div>
    </div>
  );
}
