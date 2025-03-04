// pages/queue.js
import { useEffect, useState } from 'react';

export default function Queue() {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const fetchQueue = async () => {
      const response = await fetch('/api/queue');
      const data = await response.json();
      setQueue(data.queue);
    };

    fetchQueue();
  }, []);

  return (
    <div>
      <h1>Antrian Mabar</h1>
      <ul>
        {queue.map((item, index) => (
          <li key={index}>
            {item.username} - {item.amount} - {item.message}
          </li>
        ))}
      </ul>
    </div>
  );
}