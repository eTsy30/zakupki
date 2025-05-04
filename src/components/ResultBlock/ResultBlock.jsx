import React from 'react';
import styles from './ResultBlock.module.scss';


const ResultBlock = ({ result }) => {
  if (!result) return null;

  return (
    <div className={styles.result}>
      <h3>Результат: ({result['Тип']})</h3>
      <div>
        {Object.entries(result).map(([key, value]) =>
          key !== 'Тип' ? (
            <p key={key}>
              <strong>{key}:</strong> {value}
            </p>
          ) : null
        )}
      </div>
    </div>
  );
};

export default ResultBlock;
