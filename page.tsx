"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load all links
  useEffect(() => {
    fetch("/api/links")
      .then((res) => res.json())
      .then(setLinks);
  }, []);

  // Submit handler
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, code }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
    } else {
      setLinks([data, ...links]);
      setCode("");
      setUrl("");
    }

    setLoading(false);
  };

  const handleDelete = async (c: string) => {
    await fetch(`/api/links/${c}`, { method: "DELETE" });

    setLinks(links.filter((l: any) => l.code !== c));
  };

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">TinyLink Dashboard</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Enter URL"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <input
          type="text"
          placeholder="Custom code (optional)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <button
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Processing..." : "Shorten URL"}
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </form>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Code</th>
            <th className="p-3">URL</th>
            <th className="p-3">Clicks</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {links.map((link: any) => (
            <tr key={link.code} className="border-t">
              <td className="p-3 text-blue-600 underline">
                <a href={`/${link.code}`} target="_blank">
                  {link.code}
                </a>
              </td>
              <td className="p-3">{link.originalUrl}</td>
              <td className="p-3">{link.clicks}</td>
              <td className="p-3">
                <button
                  className="text-red-500"
                  onClick={() => handleDelete(link.code)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
