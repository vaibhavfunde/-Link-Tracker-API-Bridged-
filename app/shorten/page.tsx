// app/shorten/page.tsx
"use client";

import { useState } from "react";

export default function ShortenPage() {
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShortUrl("");

    if (!longUrl) {
      setError("Please enter a valid URL.");
      return;
    }

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl, customAlias }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setShortUrl(data.shortUrl);
      }
    } catch (err) {
      setError("Failed to create short link.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 px-4 py-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create a Short Link</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Long URL</label>
          <input
            type="url"
            placeholder="https://example.com"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Custom Alias (optional)</label>
          <input
            type="text"
            placeholder="e.g. my-product"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Shorten
        </button>
      </form>

      {shortUrl && (
        <div className="mt-4 text-green-600">
          Short URL: <a href={shortUrl} className="underline">{shortUrl}</a>
        </div>
      )}

      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  );
}

