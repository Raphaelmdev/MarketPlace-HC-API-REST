import { useEffect, useRef } from "react";

export function usePolling({
  fetchData,
  onUpdate,
  interval = 3500,
  enabled = true
}) {
  const previousDataRef = useRef(null);
  const fetchDataRef = useRef(fetchData);
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    fetchDataRef.current = fetchData;
    onUpdateRef.current = onUpdate;
  }, [fetchData, onUpdate]);

  useEffect(() => {
    if (!enabled) return;

    let isMounted = true;

    async function execute() {
      try {
        const data = await fetchDataRef.current();

        if (!isMounted) return;

        const isEqual =
          JSON.stringify(previousDataRef.current) === JSON.stringify(data);

        if (!isEqual) {
          previousDataRef.current = data;
          onUpdateRef.current(data);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }

    const intervalId = setInterval(execute, interval);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [interval, enabled]);
}