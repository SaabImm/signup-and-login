import { footerLinks } from '../Components/FooterLinks';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#1C1F25] text-gray-300 px-8 sm:px-16 md:px-24 py-14 mt-16 rounded-t-3xl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        
        {/* Brand / Description */}
        <div>
          <h2 className="text-white text-2xl font-semibold mb-3">ShopEase</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Discover the best products at unbeatable prices. 
            From tech gadgets to fashion essentials — all in one place.
          </p>
        </div>

        {/* Dynamic link sections */}
        {footerLinks.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-white font-semibold mb-4">{section.title}</h3>
            <ul className="space-y-2">
              {section.links.map((link, linkIdx) => (
                <li key={linkIdx}>
                  <a
                    href={link.href}
                    className="hover:text-[#68E2F8] transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between">
        
        {/* Copyright */}
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} ShopEase. All rights reserved.
        </p>

        {/* Social icons */}
        <div className="flex gap-5 mt-4 sm:mt-0">
          <a href="#" className="hover:text-[#68E2F8]"><FaFacebookF /></a>
          <a href="#" className="hover:text-[#68E2F8]"><FaInstagram /></a>
          <a href="#" className="hover:text-[#68E2F8]"><FaTwitter /></a>
          <a href="#" className="hover:text-[#68E2F8]"><FaYoutube /></a>
        </div>
      </div>
    </footer>
  );
}
