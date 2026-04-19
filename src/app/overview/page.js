'use client';

import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const menuItems = [
  {
    title: 'แจ้งปัญหาใหม่',
    desc: 'สร้าง ticket ใหม่',
    href: '/ticket/create',
    bg: '#E6F1FB', color: '#185FA5',
  },
  {
    title: 'ติดตาม ticket',
    desc: 'ดูสถานะการแจ้ง',
    href: '/ticket',
    bg: '#E1F5EE', color: '#0F6E56',
  },
  {
    title: 'ประวัติ',
    desc: 'ticket ที่ผ่านมา',
    href: '/ticket/history',
    bg: '#FAEEDA', color: '#854F0B',
  },
  {
    title: 'โปรไฟล์',
    desc: 'ข้อมูลส่วนตัว',
    href: '/profile',
    bg: '#EEEDFE', color: '#534AB7',
  },
];

export default function OverviewPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  // ถ้ายังไม่ได้ login ให้ redirect ไปหน้า login
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading]);

  if (isLoading || !user) return null;

  // ดึงตัวย่อชื่อสำหรับ avatar
  const initials = user.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.username?.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Welcome Card */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-800 font-medium text-lg flex-shrink-0">
          {initials}
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            ยินดีต้อนรับ, {user.fullName || user.username}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            วันนี้ระบบพร้อมให้บริการแล้ว — มีอะไรให้ช่วยเหลือไหม?
          </p>
          <span className="inline-block mt-2 text-xs px-3 py-0.5 rounded-full bg-green-50 text-green-800">
            IT Helpdesk System
          </span>
        </div>
      </div>

      {/* Quick Menu */}
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">เมนูหลัก</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {menuItems.map((item) => (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className="bg-white border border-gray-100 rounded-xl p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
              style={{ background: item.bg }}>
              <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
            </div>
            <p className="text-sm font-medium text-gray-800">{item.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
          </button>
        ))}
      </div>

      {/* Notice */}
      <div className="bg-blue-50 rounded-lg p-4 flex gap-3">
        <span className="text-blue-500 mt-0.5 flex-shrink-0">ℹ</span>
        <p className="text-sm text-blue-800">
          หากพบปัญหาเร่งด่วน กรุณาติดต่อทีม IT โดยตรงที่{' '}
          <a href="mailto:jarudat.jc@gmail.com" className="underline">jarudat.jc@gmail.com</a>
          {' '}หรือโทร ext. 1234
        </p>
      </div>

    </div>
  );
}