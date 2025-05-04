import React, { useState, useEffect } from 'react'; // useEffect импортируется
import { useForm } from 'react-hook-form';
import TabButtons from '../components/Tabs/TabButtons';
import { useYuanRate } from '../hook/useRate';
import styles from './Home.module.scss';
import ResultBlock from '../components/ResultBlock/ResultBlock';

export const Home = () => {
  const {
    rate: chinaRate,
    loading: chinaLoading,
    error: chinaError,
  } = useYuanRate(462); // Курс юаня

  const {
    rate: sadovodRate,
    loading: sadovodLoading,
    error: sadovodError,
  } = useYuanRate(456); // Курс рубля

  const [selectedTab, setSelectedTab] = useState('china');
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const [result, setResult] = useState({
    china: null,
    sadovod: null,
  });

  const count = watch('count', 0); // Получаем значение count для условной логики

  // Обновляем значение упаковки на основе count
  useEffect(() => {
    if (selectedTab === 'china') {
      setValue('type', count > 5 ? "11" : "7");
    }
  }, [count, selectedTab, setValue]); // useEffect не должен вызываться условно

  if (chinaLoading || sadovodLoading) return <p>Загрузка курса...</p>;
  if (chinaError || sadovodError) return <p>Ошибка загрузки курса</p>;

  const tabs = [
    { value: 'china', label: 'Китай' },
    { value: 'sadovod', label: 'Садовод' },
  ];

  const onSubmit = (data) => {
    let breakdown = {};

    if (selectedTab === 'china') {
      const yuan = parseFloat(data.yuan || 0);
      const yuanRate = chinaRate / 10;
      const rateInBYN = yuan * yuanRate;
      const withPercent = rateInBYN * 1.17;
      const delivery = 36.5 * data.count;
      const total = withPercent + delivery ;


      breakdown = {
        'Курс юаня': yuanRate.toFixed(4),
        'Сумма в юанях': yuan,
        'Перевод в BYN': rateInBYN.toFixed(4),
        '+17%': withPercent.toFixed(4),
        'Итого': total.toFixed(2),
        'Тип': 'Китай',
      };
    }

    if (selectedTab === 'sadovod') {
      const rub = parseFloat(data.rub || 0);
      const converted = rub * (sadovodRate / 100);
      const isSingle = data.type === 'single';
      const percent = isSingle ? 0.23 : 0.2;
      const total = converted * (1 + percent);
     
      breakdown = {
        'Сумма в рублях': rub,
        'Курс (0.37)': converted.toFixed(2),
        'Итого': total.toFixed(2),
        'Тип': 'Садовод',
      };
    }

    setResult((prev) => ({
      ...prev,
      [selectedTab]: breakdown,
    }));
  };

  const handleReset = () => {
    reset();
    setResult((prev) => ({
      ...prev,
      [selectedTab]: null,
    }));
  };

  return (
    <div className={styles.root}>
      <TabButtons tabs={tabs} defaultTab="china" onChange={setSelectedTab} />

      <form onSubmit={handleSubmit(onSubmit)} >
        {selectedTab === 'china' && (
          <>
            <h2 className={styles.title} >Курс юаня на сегодня: {(chinaRate / 10).toFixed(4)} BYN</h2>

            <label>Юаней:</label>
            <input type="number" step="any"  {...register('yuan')} required />

            <label>Количество в килограммах</label>
            <input type="number" step="any" {...register('count')} required />
          </>
        )}

        {selectedTab === 'sadovod' && (
          <>
            <h2 className={styles.title} >Курс рубля на сегодня: {(sadovodRate / 10).toFixed(4)} BYN</h2>
            <label>Сумма в рублях:</label>
            <input type="number" step="any" {...register('rub')} required />

            <label>Тип закупки:</label>
            <select {...register('type', { required: true })}>
              <option value="" disabled>Выберите вариант</option>
              <option value="single">Штучно (23%)</option>
              <option value="group">Сбор (20%)</option>
            </select>

          </>
        )}

        <div className={styles.button}>
          <button type="submit">Рассчитать</button>
          <button type="button" onClick={handleReset} >
            Сбросить
          </button>
        </div>
      </form>

      {result[selectedTab] && <ResultBlock result={result[selectedTab]} />}
    </div>
  );
};
