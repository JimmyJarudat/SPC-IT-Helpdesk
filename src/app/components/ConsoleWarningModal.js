import React, { useState, useEffect } from 'react';

const WarningIcon = ({ level }) => {
  switch (level) {
    case 'CRITICAL':
      return <span className="text-5xl mb-2">⛔</span>;
    case 'HIGH':
      return <span className="text-5xl mb-2">⚠️</span>;
    default:
      return <span className="text-5xl mb-2">ℹ️</span>;
  }
};

const getModalStyle = (level) => {
  switch (level) {
    case 'CRITICAL':
      return 'bg-red-600';
    case 'HIGH':
      return 'bg-orange-600';
    default:
      return 'bg-yellow-600';
  }
};

const ConsoleWarningModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [warningData, setWarningData] = useState({
    title: '🛑 หยุดเถอะอานน 🛑',
    message: 'อย่าทำแบบนี้เลย',
    level: 'HIGH'
  });
  
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  useEffect(() => {
    window.showConsoleWarning = (config) => {
      setWarningData({
        title: config?.title || '🛑 หยุดเถอะอานน 🛑',
        message: config?.message || 'อย่าทำแบบนี้เลย',
        level: config?.level || 'HIGH'
      });
      setIsVisible(true);
    };
    return () => {
      window.showConsoleWarning = undefined;
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black/70 backdrop-blur-sm absolute inset-0" />
      
      <div className={`${getModalStyle(warningData.level)} p-8 rounded-lg shadow-xl relative max-w-md mx-4 animate-bounce`}>
        <div className="flex flex-col items-center text-white">
          <WarningIcon level={warningData.level} />
          
          <h2 className="text-3xl font-bold mb-4 text-center">
            {warningData.title}
          </h2>
          
          <div className="text-lg text-center whitespace-pre-wrap">
            {warningData.message}
          </div>

          <div className="absolute -top-3 -right-3">
            <span className="bg-white text-red-600 text-xs font-bold px-2 py-1 rounded-full">
              {warningData.level === 'CRITICAL' ? '🔴' : warningData.level === 'HIGH' ? '🟠' : '🟡'} {warningData.level}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsoleWarningModal;