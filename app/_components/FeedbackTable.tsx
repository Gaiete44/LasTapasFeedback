// app/_components/FeedbackTable.tsx
"use client";

import { useState, useEffect } from "react";

interface Feedback {
  id: number;
  rating: number;
  textFeedback: string | null;
  selectedOptions: string[];
  createdAt: string;
}

export default function FeedbackTable() {
  const [sortBy, setSortBy] = useState<"date" | "rating">("date");
  const [filterRating, setFilterRating] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchFeedback() {
      try {
        const response = await fetch('/api/feedback');
        if (!response.ok) {
          throw new Error('Failed to fetch feedback');
        }
        const data = await response.json();
        setFeedback(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeedback();
  }, []);

  if (isLoading) {
    return <div className="text-black font-medium">Loading feedback data...</div>;
  }

  if (error) {
    return <div className="text-red-600 font-medium">Error loading feedback: {error.message}</div>;
  }

  const filteredFeedback = feedback.filter((item) => {
    if (filterRating !== "all" && item.rating !== parseInt(filterRating)) {
      return false;
    }
    if (searchTerm && !item.textFeedback?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const sortedFeedback = [...filteredFeedback].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "date":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-gray-500"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={filterRating}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterRating(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
          >
            <option value="all">All Ratings</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={String(i + 1)}>
                Rating: {i + 1}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as "date" | "rating")}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
          >
            <option value="date">Sort by Date</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Feedback
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Selected Options
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedFeedback.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-black">
                  No feedback found
                </td>
              </tr>
            ) : (
              sortedFeedback.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                    {item.rating}
                  </td>
                  <td className="px-6 py-4 text-sm text-black">
                    {item.textFeedback || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-black">
                    {Array.isArray(item.selectedOptions) && item.selectedOptions.length > 0
                      ? item.selectedOptions.map((option: string) => (
                          <div key={option} className="text-sm">
                            {option}
                          </div>
                        ))
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}