'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Link {
  _id: string;
  longUrl: string;
  shortCode: string;
  analytics: {
    timestamp: string;
    userAgent: string;
    referrer: string;
    ip: string;
  }[];
  createdAt: string;
}

export default function DashboardPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchLinks() {
      const res = await fetch('/api/users/links');
      const data = await res.json();
      if (res.ok) {
        setLinks(data.links);
      } else {
        toast.error(data.error || 'Failed to load links');
      }
    }

    fetchLinks();
  }, []);

  const copyToClipboard = async (shortCode: string) => {
    const shortUrl = `${window.location.origin}/shortcode/${shortCode}`;
    await navigator.clipboard.writeText(shortUrl);
    toast.success('Short link copied!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Short Links</h1>

      {links.length === 0 ? (
        <p>No links found.</p>
      ) : (
        <div className="grid gap-4">
          {links.map((link) => (
            <div
              key={link._id}
              className="border border-gray-300 rounded-xl p-4 shadow-md bg-white"
            >
              <div className="mb-2">
                <span className="font-semibold">Original:</span>{' '}
                <a href={link.longUrl} target="_blank" className="text-blue-600 underline">
                  {link.longUrl}
                </a>
              </div>

              <div className="mb-2">
                <span className="font-semibold">Short:</span>{' '}
                <span className="text-green-600">
                  {`${window.location.origin}/shortcode/${link.shortCode}`}
                </span>
              </div>

              <div className="mb-4">
                <span className="font-semibold">Total Clicks:</span>{' '}
                {link.analytics?.length || 0}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => copyToClipboard(link.shortCode)}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  Copy
                </button>
                {/* <button
                  onClick={() => router.push(`/link/${link.shortCode}/stats`)}
                  className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-800"
                >
                  Stats
                </button> */}

                <button
  onClick={() => router.push(`/dashboard/links/${link.shortCode}/stats`)}
  className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-800"
>
  Stats
</button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
