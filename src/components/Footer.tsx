import Link from 'next/link';

export default function Footer() {
  return (
    // bg-gray-900
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Labeuromed</h3>
            <p className='text-gray-500 font-lighter text-xs'>
              Localizacion
            </p>
            <p className="text-gray-400 text-sm font-light">                
                CL CERVANTES 14 CEUTA (CEUTA)
              {/* Your trusted provider of high-quality medical products and equipment.
              We are committed to delivering excellence in healthcare solutions. */}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/visitor/screens/home" className="text-gray-400 hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/visitor/screens/cart" className="text-gray-400 hover:text-white">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-white">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-xs md:text-md mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Labeuromed. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 