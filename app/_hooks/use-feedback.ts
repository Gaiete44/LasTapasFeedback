// app/_hooks/use-feedback.ts
import { useState, useEffect } from 'react';

type Feedback = {
  id: number;
  rating: number;
  textFeedback: string | null;
  selectedOptions: string[];
  createdAt: string;
};

export function useFeedback() {
  const [data, setData] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch('/api/feedback');
        if (!response.ok) {
          throw new Error('Failed to fetch feedback');
        }
        const data = await response.json();
        setData(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  return { data, isLoading, error };
}