import { useEffect, useState } from 'react';

export function useYuanRate(money ) {
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://api.nbrb.by/ExRates/Rates/${money}?ParamMode=0`)
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка при загрузке курса');
        return res.json();
      })
      .then((data) => {
        setRate(data.Cur_OfficialRate);
      })
      .catch((err) => {
        setError(err.message || 'Неизвестная ошибка');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { rate, loading, error };
}
