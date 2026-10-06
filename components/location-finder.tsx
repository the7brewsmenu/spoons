'use client';

import { useState } from 'react';
import Link from 'next/link';

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  london: { lat: 51.5074, lng: -0.1278 },
  manchester: { lat: 53.4808, lng: -2.2426 },
  birmingham: { lat: 52.4862, lng: -1.8904 },
  leeds: { lat: 53.7997, lng: -1.5492 },
  glasgow: { lat: 55.8642, lng: -4.2518 },
  liverpool: { lat: 53.4084, lng: -2.9916 },
  newcastle: { lat: 54.9783, lng: -1.6174 },
  sheffield: { lat: 53.3811, lng: -1.4701 },
  bristol: { lat: 51.4545, lng: -2.5879 },
  edinburgh: { lat: 55.9533, lng: -3.1883 },
  leicester: { lat: 52.6369, lng: -1.1398 },
  coventry: { lat: 52.4068, lng: -1.5197 },
  bradford: { lat: 53.7928, lng: -1.7513 },
  cardiff: { lat: 51.4816, lng: -3.1791 },
  belfast: { lat: 54.5973, lng: -5.9301 },
  nottingham: { lat: 52.9548, lng: -1.1581 },
  hull: { lat: 53.7676, lng: -0.3274 },
  plymouth: { lat: 50.3755, lng: -4.1427 },
  southampton: { lat: 50.9097, lng: -1.4044 },
  reading: { lat: 51.4543, lng: -0.9781 },
};

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function LocationFinder() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [nearestCity, setNearestCity] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFindLocation = () => {
    if (!navigator.geolocation) {
      setStatus('error');
      setErrorMessage('Geolocation is not supported by your browser');
      return;
    }

    setStatus('loading');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        let closest = '';
        let minDistance = Infinity;

        for (const [citySlug, coords] of Object.entries(CITY_COORDINATES)) {
          const distance = getDistance(latitude, longitude, coords.lat, coords.lng);
          if (distance < minDistance) {
            minDistance = distance;
            closest = citySlug;
          }
        }

        setNearestCity(closest);
        setStatus('success');
      },
      (error) => {
        setStatus('error');
        setErrorMessage(
          error.code === 1
            ? 'Location access denied. Please select a city below.'
            : 'Unable to retrieve your location. Please try again or select a city below.'
        );
      }
    );
  };

  return (
    <div className="mb-8 rounded-[var(--radius-lg)] border border-line bg-white p-6 shadow-[var(--shadow-card)]">
      <h2 className="mb-4 font-display text-xl font-semibold text-ink">Find nearest city guide</h2>

      {status === 'idle' || status === 'error' ? (
        <div>
          <button
            onClick={handleFindLocation}
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Use my location
          </button>
          {status === 'error' && (
            <p className="mt-3 text-sm font-medium text-red-700">
              {errorMessage}
            </p>
          )}
          <p className="mt-3 text-sm text-muted">
            We will only use your location to find the nearest city guide. We do not store your location.
          </p>
        </div>
      ) : status === 'loading' ? (
        <div className="flex items-center text-ink/70">
          <div className="mr-3 h-5 w-5 animate-spin rounded-full border-b-2 border-primary" />
          Finding your location...
        </div>
      ) : (
        <div className="rounded-[var(--radius-md)] border border-primary/20 bg-mist p-5">
          <p className="mb-3 text-ink/80">
            Based on your location, your nearest city guide is:
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={`/locations/${nearestCity}`}
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold capitalize text-white transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              View {nearestCity?.replace('-', ' ')} guide
            </Link>
            <button
              onClick={handleFindLocation}
              className="text-sm font-medium text-muted underline underline-offset-2 transition-colors hover:text-ink"
            >
              Update location
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
