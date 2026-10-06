import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found | SpoonsMenu',
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-pub-blue mb-4">
        Page not found
      </h1>
      <p className="text-lg text-slate-700 max-w-md mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <Link 
          href="/" 
          className="bg-pub-blue text-warm-cream px-6 py-3 rounded-md font-medium hover:bg-blue-900 transition-colors"
        >
          Full Menu
        </Link>
        <Link 
          href="/locations" 
          className="bg-slate-200 text-slate-900 px-6 py-3 rounded-md font-medium hover:bg-slate-300 transition-colors"
        >
          Locations
        </Link>
        <Link 
          href="/about" 
          className="bg-slate-200 text-slate-900 px-6 py-3 rounded-md font-medium hover:bg-slate-300 transition-colors"
        >
          About
        </Link>
      </div>
    </div>
  );
}
