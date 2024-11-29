'use client'
import React from 'react';

const Loading = () => {
  const loadingStyle = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#1a202c', // สีพื้นหลัง
      color: '#ffffff', // สีข้อความ
    },
    spinner: {
      width: '60px',
      height: '60px',
      border: '8px solid rgba(255, 255, 255, 0.3)',
      borderTop: '8px solid #3182ce', // สีของแถบหมุน
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '16px',
    },
    text: {
      fontSize: '18px',
      fontWeight: 500,
      marginTop: '10px',
    },
    // การสร้าง keyframes ใน JavaScript
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    }
  };

  return (
    <div style={loadingStyle.container}>
      <div style={loadingStyle.spinner}></div>
      <p style={loadingStyle.text}>กำลังโหลด...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loading;