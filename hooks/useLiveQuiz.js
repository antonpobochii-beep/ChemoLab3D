import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { sortByScore } from "@/lib/liveQuiz";

// Stan pokoju i lista graczy — subskrypcje w czasie rzeczywistym z odpytywaniem awaryjnym.

export async function findRoom(code) {
  if (!code) return null;
  const page = await base44.entities.QuizRoom.filter({ code }, { sort: "-created_date", limit: 1 });
  return page.items?.[0] ?? null;
}

export function useLiveRoom(code) {
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(code));
  const [resolvedCode, setResolvedCode] = useState(null);

  useEffect(() => {
    if (!code) {
      setRoom(null);
      setIsLoading(false);
      setResolvedCode(null);
      return undefined;
    }
    let alive = true;
    setIsLoading(true);

    const load = async () => {
      const next = await findRoom(code);
      if (!alive) return;
      setRoom((current) => (current?.updated_date === next?.updated_date && current ? current : next));
      setIsLoading(false);
      setResolvedCode(code);
    };

    load();
    const unsubscribe = base44.entities.QuizRoom.subscribe((event) => {
      const data = event.data;
      if (!alive || !data || data.code !== code) return;
      if (event.type === "delete") {
        setRoom(null);
        return;
      }
      setRoom(data);
    });
    const timer = setInterval(load, 5000);

    return () => {
      alive = false;
      unsubscribe();
      clearInterval(timer);
    };
  }, [code]);

  return { room, isLoading, resolvedCode, setRoom };
}

export function useLivePlayers(code) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!code) {
      setPlayers([]);
      return undefined;
    }
    let alive = true;

    const load = async () => {
      const page = await base44.entities.QuizPlayer.filter(
        { room_code: code },
        { sort: "-score", limit: 100 }
      );
      if (alive) setPlayers(sortByScore(page.items ?? []));
    };

    load();
    const unsubscribe = base44.entities.QuizPlayer.subscribe((event) => {
      const data = event.data;
      if (!alive || !data || data.room_code !== code) return;
      setPlayers((current) => {
        if (event.type === "delete") return current.filter((item) => item.id !== data.id);
        const exists = current.some((item) => item.id === data.id);
        return sortByScore(
          exists ? current.map((item) => (item.id === data.id ? { ...item, ...data } : item)) : [...current, data]
        );
      });
    });
    const timer = setInterval(load, 5000);

    return () => {
      alive = false;
      unsubscribe();
      clearInterval(timer);
    };
  }, [code]);

  return players;
}