
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import  TabButtons from '../components/Tabs/TabButtons'
import { useYuanRate } from '../hook/useRate';
import styles from './Home.module.scss';
import  ResultBlock from '../components/ResultBlock/ResultBlock'
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
  const { register, handleSubmit, reset } = useForm();
const [result, setResult] = useState({
  china: null,
  sadovod: null,
});

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
      const delivery = 14.5;
     const sdek = Number(data.type);
      const packing = yuan <= 5 ? 7 : 11;

      const total = withPercent + delivery + sdek + packing;

      breakdown = {
        'Курс юаня': yuanRate.toFixed(4),
        'Сумма в юанях': yuan,
        'Перевод в BYN': rateInBYN.toFixed(4),
        '+17%': withPercent.toFixed(4),
        'Доставка от Китая до Москвы': delivery,
        'СДЭК': sdek,
        'Упаковка': packing,
        'Итого': total.toFixed(2),
        'Тип': 'Китай',
      };
    }

    if (selectedTab === 'sadovod') {
      const rub = parseFloat(data.rub || 0);
      const converted = rub * (sadovodRate/100);
      const isSingle = data.type === 'single';
      const percent = isSingle ? 0.23 : 0.2;
      const withPercent = converted * (1 + percent);
      const packing = rub <= 500 ? 7 : 11;
      const total = withPercent + packing;

      breakdown = {
  'Сумма в рублях': rub,
  'Курс (0.37)': converted.toFixed(2),
  [`+${percent * 100}% (${isSingle ? 'штучно' : 'сбор'})`]: withPercent.toFixed(2),
  'Упаковка': packing,
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
  console.log(result);
  
  return (
      <div className={styles.root}>
          <TabButtons tabs={tabs} defaultTab="china" onChange={setSelectedTab} />

      <form onSubmit={handleSubmit(onSubmit)} >
        {selectedTab === 'china' && (
          <>
            <h2 className={styles.title} >Курс юаня на сегодня: {(chinaRate / 10).toFixed(4)} BYN</h2>
          
            <label>Юаней:</label>
            <input type="number" step="any" {...register('yuan')} required />
          
            <label>Упаковка:</label>
           <select {...register('type', { required: true })}>
  <option value="" disabled selected>Выберите вариант</option>
  <option value="7">До 5 кг</option>
  <option value="11">Больше 5 кг</option>
</select>
        
    </>
        )}

        {selectedTab === 'sadovod' && (
          <>
             <h2 className={styles.title} >Курс рубля на сегодня: {(sadovodRate / 10).toFixed(4)} BYN</h2>
            <label>Сумма в рублях:</label>
            <input type="number" step="any" {...register('rub')} required />
          
            <label>Тип закупки:</label>
            <select {...register('type', { required: true })}>
               <option value="" disabled selected>Выберите вариант</option>
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
  )
}
