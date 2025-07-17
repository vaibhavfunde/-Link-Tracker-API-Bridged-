'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

interface StatsResponse {
  shortCode: string;
  totalClicks: number;
  clicksPerDay: Record<string, number>;
  referrerCounts: Record<string, number>;
  countryCounts: Record<string, number>;
}

export default function LinkStatsPage() {
  const { shortCode } = useParams();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`/api/url/${shortCode}/stats`);
        const data = await res.json();

        if (res.ok) {
          setStats(data);
        } else {
          toast.error(data.error || 'Failed to load stats');
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
        toast.error('Failed to load stats');
       
      } finally {
        setLoading(false);
      }
    }

    if (shortCode) fetchStats();
  }, [shortCode]);

  if (loading) return <div className="p-6">Loading stats...</div>;
  if (!stats) return <div className="p-6 text-red-500">No stats available</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Stats for: {stats.shortCode}</h1>

      <div className="mb-6">
        <p><strong>Total Clicks:</strong> {stats.totalClicks}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Clicks Per Day (Last 30 Days)</h2>
        <ul className="list-disc list-inside">
          {Object.entries(stats.clicksPerDay).map(([date, count]) => (
            <li key={date}>{date}: {count}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Referrer Breakdown</h2>
        <ul className="list-disc list-inside">
          {Object.entries(stats.referrerCounts).map(([referrer, count]) => (
            <li key={referrer}>{referrer}: {count}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Country Breakdown</h2>
        <ul className="list-disc list-inside">
          {Object.entries(stats.countryCounts).map(([country, count]) => (
            <li key={country}>{country}: {count}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
