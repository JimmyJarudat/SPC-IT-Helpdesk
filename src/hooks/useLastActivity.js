import React, { useState, useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useUser } from "@/contexts/UserContext";

const useLastActivity = () => {
  const { user } = useUser();
  const [isIdle, setIsIdle] = useState(false);

  // ฟังก์ชันอัพเดทสถานะ
  const updateActivity = async (status) => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/userManagement/log/update-last-activity?userId=${user.id}&status=${status}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update activity');
      }

      const data = await response.json();
      console.log('Activity status updated:', data);
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  const onIdle = () => {
    console.log('User is idle');
    setIsIdle(true);
    updateActivity('offline');
  };

  const onActive = () => {
    console.log('User is active');
    setIsIdle(false);
    updateActivity('online');
  };

  // ตั้งค่า idle timer
  const idleTimer = useIdleTimer({
    timeout: 600000, 
    onIdle,
    onActive,
    debounce: 500
  });

  useEffect(() => {
    // อัพเดทสถานะเป็น online เมื่อโหลดครั้งแรก
    if (user?.id) {
      updateActivity('online');
    }

    // อัพเดทสถานะเป็น offline เมื่อปิดแท็บ/เบราว์เซอร์
    const handleBeforeUnload = () => {
      updateActivity('offline');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Cleanup: อัพเดทสถานะเป็น offline และลบ event listener
      updateActivity('offline');
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user?.id]);

  return { isIdle };
};

export default useLastActivity;