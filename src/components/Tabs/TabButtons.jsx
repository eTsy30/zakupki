import React, { useState, useEffect } from 'react';
import styles from './TabButtons.module.scss';

const TabButtons = ({
  tabs,
  defaultTab,
  onChange,
  className = '',
  buttonClassName = '',
  activeButtonClassName = '',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.value);

  useEffect(() => {
    if (defaultTab !== undefined) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  return (
    <div className={`${styles.tabContainer} ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;

        return (
          <button
            key={tab.value}
            className={`${styles.tabButton} ${buttonClassName} ${
              isActive ? `${styles.activeTab} ${activeButtonClassName}` : ''
            }`}
            onClick={() => {
              setActiveTab(tab.value);
              onChange?.(tab.value);
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabButtons;
