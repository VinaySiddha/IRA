import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-surface-dark text-white">
      {/* Google 4-color top strip */}
      <div className="h-1 google-gradient-line" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About IRA */}
          <div>
            <div className="flex items-center gap-0.5 mb-4">
              <span className="text-2xl font-bold text-google-blue">I</span>
              <span className="text-2xl font-bold text-google-red">R</span>
              <span className="text-2xl font-bold text-google-green">A</span>
            </div>
            <p className="text-white/[0.6] text-sm leading-relaxed mb-4">
              International Research Archive is a modern platform for academic
              publishing, peer review, and open access research dissemination.
            </p>
            <div className="flex gap-3">
              {['twitter', 'linkedin', 'github'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/[0.08] hover:bg-white/[0.12] flex items-center justify-center transition-md"
                >
                  <ExternalLink className="w-4 h-4 text-white/[0.6]" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-white/[0.87] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/archive', label: 'Browse Archive' },
                { to: '/submit', label: 'Submit Paper' },
                { to: '/dashboard', label: 'Dashboard' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/[0.6] hover:text-google-blue text-sm transition-md"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Researchers */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-white/[0.87] mb-4">
              For Researchers
            </h4>
            <ul className="space-y-3">
              {[
                'Author Guidelines',
                'Peer Review Process',
                'Open Access Policy',
                'Publication Ethics',
                'Copyright & Licensing',
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-white/[0.6] hover:text-google-blue text-sm transition-md"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-white/[0.87] mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-google-blue mt-0.5 shrink-0" />
                <span className="text-white/[0.6] text-sm">contact@ira-journal.org</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-google-green mt-0.5 shrink-0" />
                <span className="text-white/[0.6] text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-google-red mt-0.5 shrink-0" />
                <span className="text-white/[0.6] text-sm">
                  123 Research Avenue, Academic District, Cambridge, MA 02139
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/[0.38] text-sm">
              &copy; {currentYear} International Research Archive. All rights reserved.
            </p>
            <div className="flex gap-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-white/[0.38] hover:text-white/[0.6] text-sm transition-md"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
