import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg text-emerald-400 mb-4">BUNYAD</h3>
            <p className="text-sm text-gray-400">Pakistan's leading property marketplace</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">About</Link></li>
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Help</Link></li>
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Terms</Link></li>
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Follow</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 BUNYAD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
