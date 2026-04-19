'use client';

import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import {
  FaFacebook,
  FaTwitter,
  FaGithub,
  FaInstagram,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import Modal from "react-modal";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";




Modal.setAppElement('#root'); // หรือเปลี่ยน id ตามที่คุณใช้ในโปรเจกต์


export default function HeroSection() {
  const { user } = useUser();
  // State สำหรับ Animation
  const [animationData1, setAnimationData1] = useState(null);
  const [animationData2, setAnimationData2] = useState(null);

  // State สำหรับ Modal ของ Activity
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // State สำหรับ Modal ของ Announcement
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // ฟังก์ชันเปิด/ปิด Modal ของ Activity
  const openActivityModal = (activity) => {
    setSelectedActivity(activity);
    setActivityModalOpen(true);
  };

  const closeActivityModal = () => {
    setSelectedActivity(null);
    setActivityModalOpen(false);
  };

  // ฟังก์ชันเปิด/ปิด Modal ของ Announcement
  const openAnnouncementModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setAnnouncementModalOpen(true);
  };

  const closeAnnouncementModal = () => {
    setSelectedAnnouncement(null);
    setAnnouncementModalOpen(false);
  };


  const getTicketHref = (user) => {
    if (!user) {
      return "/login";
    } else if (user.role_status !== "approved") {
      return "/pendingApproval";
    } else if (user.role === "admin") {
      return "/adminTicket";
    } else {
      return "/userTicket";
    }
  };



  useEffect(() => {
    if (typeof window !== 'undefined') {
      // โหลด JSON Animation สำหรับ Section 1
      fetch('/asset/animation/homeSection1.json')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => setAnimationData1(data))
        .catch((error) => console.error('Error loading animation 1 data:', error));

      // โหลด JSON Animation สำหรับ Section 2
      fetch('/asset/animation/homeSection2.json')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => setAnimationData2(data))
        .catch((error) => console.error('Error loading animation 2 data:', error));
    }
  }, []);


  const teamMembers = [
    {
      id: 1,
      name: "ซง โกคู",
      role: "ผู้บริหาร",
      image: "https://t1.blockdit.com/photos/2019/11/5dc37a4468c4ed0cf20e6f6f_800x0xcover_IyPg9LQG.jpg",
      social: {
        facebook: "https://facebook.com/goku",
        twitter: "https://twitter.com/goku",
        github: "https://github.com/goku",
        instagram: "https://instagram.com/goku",
      },
    },
    {
      id: 2,
      name: "เบจิต้า",
      role: "ผู้จัดการแผนก IT",
      image: "https://image.thepeople.co/uploads/2020/02/%E0%B9%80%E0%B8%9A%E0%B8%88%E0%B8%B4%E0%B8%95%E0%B9%89%E0%B8%B2_Website_1200x628.jpg",
      social: {
        facebook: "https://facebook.com/vegeta",
        twitter: "https://twitter.com/vegeta",
        github: "https://github.com/vegeta",
        instagram: "https://instagram.com/vegeta",
      },
    },
    {
      id: 3,
      name: "บูลม่า",
      role: "ผู้ดูแลระบบ",
      image: "https://i.pinimg.com/550x/7a/0c/1b/7a0c1b3156b26bce5ba9bcaf96252893.jpg",
      social: {
        facebook: "https://facebook.com/bulma",
        twitter: "https://twitter.com/bulma",
        github: "https://github.com/bulma",
        instagram: "https://instagram.com/bulma",
      },
    },
    {
      id: 4,
      name: "จารุเดช ชายกวด",
      role: "ฝ่ายสนับสนุน",
      image: "https://scontent.fbkk14-1.fna.fbcdn.net/v/t1.6435-9/58374298_2225129284482646_2300606520661901312_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHo7gnkpYiTHIaWxVtPh0xTF1ZDZ4GMMAMXVkNngYwwA86wmth_LBlSz9QQLQQfsdJjqJM4Y6mFPbsDZozPVZ9g&_nc_ohc=PGR2dYV8ngsQ7kNvgHLnGQK&_nc_zt=23&_nc_ht=scontent.fbkk14-1.fna&_nc_gid=AZyUVgidltyPzn1lJsY5d1j&oh=00_AYAmR3JTQqHDiv5k2_5qb3c0tU9_VIYAnJI-xsF6ZGuFqw&oe=676F95E5",
      social: {
        facebook: "https://www.facebook.com/jarudat.chaikuad/",
        twitter: "https://twitter.com/gohan",
        github: "https://github.com/gohan",
        instagram: "https://instagram.com/gohan",
      },
    },
  ];
  // ฟังก์ชันสร้างการ์ดสมาชิก
  const MemberCard = ({ member }) => (
    <motion.div
      className="flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
      whileHover={{ scale: 1.05, rotate: 2 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <motion.img
        className="w-32 h-32 rounded-md object-cover mb-4"
        src={member.image}
        alt={member.name}
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: member.id * 0.2 }}
      />
      <motion.h3
        className="text-lg font-bold text-gray-900 dark:text-white"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: member.id * 0.2 + 0.2 }}
      >
        {member.name}
      </motion.h3>
      <motion.p
        className="text-sm text-gray-700 dark:text-gray-400"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: member.id * 0.2 + 0.4 }}
      >
        {member.role}
      </motion.p>
      <motion.div
        className="flex space-x-4 mt-4"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: member.id * 0.2 + 0.6 }}
      >
        <a href={member.social.facebook} className="text-blue-500 hover:text-blue-700" aria-label="Facebook">
          <FaFacebook className="text-xl" />
        </a>
        <a href={member.social.twitter} className="text-blue-400 hover:text-blue-600" aria-label="Twitter">
          <FaTwitter className="text-xl" />
        </a>
        <a href={member.social.github} className="text-gray-600 hover:text-gray-800" aria-label="GitHub">
          <FaGithub className="text-xl" />
        </a>
        <a href={member.social.instagram} className="text-pink-500 hover:text-pink-700" aria-label="Instagram">
          <FaInstagram className="text-xl" />
        </a>
      </motion.div>
    </motion.div>
  );

  const successStories = [
    {
      id: 1,
      image: "https://stickershop.line-scdn.net/stickershop/v1/product/1158504/LINEStorePC/main.png?v=1",
      company: "บริษัท ABC",
      description: "ระบบนี้ช่วยเพิ่มประสิทธิภาพให้กับทีมงานของเรามากกว่า 50%!",
    },
    {
      id: 2,
      image: "https://lh3.googleusercontent.com/proxy/kg4SZPO8T6P3ciN5d3CLSspgviD1NNbzNoBO3dkCOFXXhj4SD4c2co7m8DfhBzV-Uv0W-F_I6paPem38Yb9Gsms29l7qVwCXvPJFYCs7n3s",
      company: "บริษัท XYZ",
      description: "การติดตามงานของเราเป็นระบบและลดข้อผิดพลาดไปได้อย่างมาก",
    },
    {
      id: 3,
      image: "https://img.pikbest.com/png-images/20211011/happy-company-coaches-and-employees-meeting-in-conference-room_6142934.png!f305cw",
      company: "บริษัท QRS",
      description: "งานของเรามีความโปร่งใสมากขึ้น และสามารถตรวจสอบได้ง่าย",
    },
  ];
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.3, duration: 0.8 },
    }),
  };

  const activities = [
    {
      id: 1,
      title: "อบรมการใช้ระบบ IT",
      description:
        "กิจกรรมอบรมสำหรับพนักงาน เพื่อการใช้งานระบบ IT-Helpdesk ",
      date: "32 ธันวาคม 2024",
      image: "/asset/activity/1.jpeg",
      details: `
        <ul>
          <li>หัวข้ออบรม: การแนะนำระบบ Helpdesk เบื้องต้น</li>
          <li>วิทยากร: คุณชายกวด วิทยากรพิเศษ</li>
          <li>เป้าหมาย: เพื่อให้พนักงานทุกคนสามารถใช้ระบบได้อย่างมีประสิทธิภาพ</li>
          <li>กิจกรรม: เวิร์คช็อป, กรณีศึกษา</li>
          <li>สถานที่: ห้องประชุมใหญ่ ชั้น 101 อาคาร IT</li>
        </ul>
      `,
    },
    {
      id: 2,
      title: "สัมมนาการแก้ไขปัญหาไอที",
      description: "การสัมมนาที่รวบรวมเคล็ดลับการแก้ไขปัญหาด้านไอที",
      date: "15 ธันวาคม 2024",
      image: "/asset/activity/2.jpeg",
      details: `
        <ul>
          <li>หัวข้อสัมมนา: เคล็ดลับแก้ไขปัญหา IT ในองค์กร</li>
          <li>วิทยากร: ทีมผู้เชี่ยวชาญจากองค์กร IT ชั้นนำ</li>
          <li>เป้าหมาย: การสร้างแนวทางแก้ไขปัญหาอย่างเป็นระบบ</li>
          <li>กิจกรรม: การพูดคุย แลกเปลี่ยนประสบการณ์</li>
          <li>สถานที่: ห้องสัมมนา ชั้น 109 อาคารหลัก</li>
        </ul>
      `,
    },
    {
      id: 3,
      title: "วันเปิดบ้านแผนก IT",
      description: "พบกับนวัตกรรมใหม่และพูดคุยกับทีม IT อย่างใกล้ชิด",
      date: "20 ธันวาคม 2024",
      image: "/asset/activity/3.jpeg",
      details: `
        <ul>
          <li>กิจกรรม: แสดงนวัตกรรมใหม่ล่าสุด</li>
          <li>ทีมงาน: ทีม IT และผู้บริหาร</li>
          <li>เป้าหมาย: การสร้างความเข้าใจในระบบ IT</li>
          <li>การพูดคุย: แลกเปลี่ยนความคิดเห็นและตอบข้อสงสัย</li>
          <li>สถานที่: ลานกิจกรรมหน้าอาคาร IT</li>
        </ul>
      `,
    },
    {
      id: 4,
      title: "การเพิ่มประสิทธิภาพการใช้ IT-Helpdesk",
      description:
        "อบรมสำหรับพนักงาน เพื่อเรียนรู้วิธีการเพิ่มประสิทธิภาพในการใช้งานระบบ IT-Helpdesk",
      date: "10 มกราคม 2025",
      image: "/asset/activity/4.jpeg",
      details: `
        <ul>
          <li>หัวข้ออบรม: เคล็ดลับการใช้ IT-Helpdesk เพื่อการแก้ไขปัญหาที่รวดเร็ว</li>
          <li>วิทยากร: คุณสายฟ้า บุญรอด ผู้เชี่ยวชาญด้าน IT</li>
          <li>เป้าหมาย: เพื่อให้พนักงานสามารถแก้ไขปัญหาได้อย่างรวดเร็วและแม่นยำ</li>
          <li>กิจกรรม: การทดลองใช้ระบบจริง และกรณีศึกษาจากเหตุการณ์จริง</li>
          <li>สถานที่: ห้องสัมมนา ชั้น 202 อาคาร IT</li>
        </ul>
      `,
    },
    {
      id: 5,
      title: "เวิร์คช็อปการพัฒนาทักษะ IT",
      description: "กิจกรรมเวิร์คช็อปสำหรับพนักงานในการพัฒนาทักษะการใช้เทคโนโลยีสารสนเทศ",
      date: "15 มกราคม 2025",
      image: "/asset/activity/5.jpeg",
      details: `
        <ul>
          <li>หัวข้อเวิร์คช็อป: การใช้เครื่องมือ IT เพื่อการทำงานที่มีประสิทธิภาพ</li>
          <li>วิทยากร: คุณอนาคิน เทคโนโลยี ผู้เชี่ยวชาญด้านเทคโนโลยีสารสนเทศ</li>
          <li>เป้าหมาย: พัฒนาทักษะพนักงานให้สามารถใช้เครื่องมือ IT ได้อย่างคล่องแคล่ว</li>
          <li>กิจกรรม: การฝึกปฏิบัติและการแก้ปัญหาจากสถานการณ์จำลอง</li>
          <li>สถานที่: ห้องเวิร์คช็อป ชั้น 105 อาคารหลัก</li>
        </ul>
      `,
    },
    {
      id: 6,
      title: "นวัตกรรมใหม่ในโลก IT",
      description: "งานแสดงนวัตกรรมล่าสุดจากแผนก IT ที่จะเปลี่ยนมุมมองของคุณ",
      date: "20 มกราคม 2025",
      image: "/asset/activity/6.jpeg",
      details: `
        <ul>
          <li>กิจกรรม: แสดงเทคโนโลยีล่าสุดและนวัตกรรมที่นำมาใช้ในองค์กร</li>
          <li>ทีมงาน: ทีม IT ที่มีประสบการณ์และผู้บริหาร</li>
          <li>เป้าหมาย: แนะนำเทคโนโลยีใหม่ที่ช่วยพัฒนาองค์กร</li>
          <li>การพูดคุย: สร้างแรงบันดาลใจและเปิดโอกาสให้ซักถาม</li>
          <li>สถานที่: โซนนิทรรศการ อาคาร IT</li>
        </ul>
      `,
    },



  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const announcements = [
    {
      id: 1,
      title: "ประกาศปรับปรุงระบบ",
      summary:
        "แจ้งให้ทราบ: ระบบ IT-Helpdesk จะปิดให้บริการในวันที่ 12 ธันวาคม 2024 ตั้งแต่เวลา 20:00 น. ถึง 04:00 น. เพื่อทำการปรับปรุงระบบ",
      date: "8 ธันวาคม 2024",
      image: "/asset/Announcement/1.jpeg",
      details: `
        <ul>
          <li><strong>ช่วงเวลาปิดปรับปรุง:</strong> วันที่ 12 ธันวาคม 2024 เวลา 20:00 น. ถึง 04:00 น.</li>
          <li><strong>เหตุผล:</strong> เพื่อปรับปรุงประสิทธิภาพและเพิ่มฟีเจอร์ใหม่ให้กับระบบ IT-Helpdesk</li>
          <li><strong>ผลกระทบ:</strong> ผู้ใช้งานจะไม่สามารถเข้าใช้งานระบบในช่วงเวลาดังกล่าว</li>
          <li><strong>คำแนะนำ:</strong> กรุณาสำรองข้อมูลที่สำคัญและวางแผนการใช้งานล่วงหน้า</li>
        </ul>
      `,
    },
    {
      id: 2,
      title: "เชิญเข้าร่วมกิจกรรม IT Day",
      summary:
        "ขอเชิญพนักงานทุกคนเข้าร่วมกิจกรรม IT Day ในวันที่ 15 ธันวาคม 2024 พบกับนวัตกรรมใหม่และสัมมนาจากผู้เชี่ยวชาญ",
      date: "10 ธันวาคม 2024",
      image: "/asset/Announcement/2.png",
      details: `
        <ul>
          <li><strong>วันที่จัดงาน:</strong> 15 ธันวาคม 2024</li>
          <li><strong>กิจกรรม:</strong> แนะนำเทคโนโลยีใหม่ล่าสุด, สัมมนา, การแข่งขันตอบคำถาม</li>
          <li><strong>ผู้ร่วมงาน:</strong> ทีม IT, ผู้เชี่ยวชาญจากภายนอก</li>
          <li><strong>สถานที่:</strong> อาคารประชุมใหญ่ ชั้น 3</li>
          <li><strong>พิเศษ:</strong> รับของที่ระลึกฟรีสำหรับผู้เข้าร่วมทุกคน</li>
        </ul>
      `,
    },
    {
      id: 3,
      title: "แจ้งเตือนการอัพเดตซอฟต์แวร์",
      summary:
        "ซอฟต์แวร์ในระบบ IT-Helpdesk จะได้รับการอัพเดตในวันที่ 18 ธันวาคม 2024 เพื่อเพิ่มฟีเจอร์ใหม่และปรับปรุงประสิทธิภาพ",
      date: "11 ธันวาคม 2024",
      image: "https://png.pngtree.com/png-vector/20220526/ourmid/pngtree-system-software-update-or-upgrade-ribbon-png-image_4737947.png",
      details: `
        <ul>
          <li><strong>วันที่อัพเดต:</strong> 18 ธันวาคม 2024</li>
          <li><strong>ฟีเจอร์ใหม่:</strong> การแจ้งเตือนแบบเรียลไทม์, การปรับปรุง UI</li>
          <li><strong>ผลกระทบ:</strong> ระบบอาจเกิดการหยุดชั่วขณะระหว่างการอัพเดต</li>
          <li><strong>คำแนะนำ:</strong> ตรวจสอบงานสำคัญล่วงหน้าก่อนวันที่อัพเดต</li>
        </ul>
      `,
    },
  ];

  // แสดงข้อความ Loading หาก Animation ยังไม่โหลดเสร็จ
  if (!animationData1 || !animationData2) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-300">
        <p className="text-white text-lg">Loading Animations...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition duration-300">
      {/* Section 1: Hero Section */}

      <section className="relative bg-blue-50 dark:bg-gray-900 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 transition duration-300">
        <motion.div
          className="container mx-auto flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1 }}
        >
          {/* Animation */}
          <motion.div
            className="w-full lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full">
              <Lottie animationData={animationData1} loop autoplay />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="w-full lg:w-1/2 text-center lg:text-left space-y-6 px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* Highlight Section */}
            <motion.div
              className="bg-white dark:bg-gray-800 p-3 rounded-md inline-block shadow-lg transition duration-300"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <p className="text-sm md:text-base text-blue-600 dark:text-blue-300 font-semibold">
                แผนก IT - ระบบสนับสนุนขององค์กร
              </p>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-900 dark:text-white leading-tight transition duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              ยินดีต้อนรับสู่ระบบ IT-Helpdesk
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-700 dark:text-gray-300 font-light leading-relaxed transition duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              แผนก IT ของเราพร้อมให้บริการทุกความช่วยเหลือด้านเทคโนโลยีสารสนเทศ ระบบ IT-Helpdesk
              ถูกออกแบบมาเพื่อสนับสนุนองค์กรในทุกปัญหาเกี่ยวกับอุปกรณ์ไอที ซอฟต์แวร์ และโครงสร้างพื้นฐานเครือข่าย
              คุณสามารถแจ้งปัญหา ตรวจสอบสถานะคำขอ และติดตามการแก้ไขปัญหาได้อย่างสะดวก
            </motion.p>

            {/* Call-to-Action */}
            <motion.div
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              <a
                href={getTicketHref(user)}
                className="bg-blue-600 dark:bg-blue-500 text-white px-4 sm:px-6 py-3 rounded-md text-base sm:text-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-200"
              >
                แจ้งปัญหาใหม่
              </a>
              <a
                href="/about"
                className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300 px-4 sm:px-6 py-3 rounded-md text-base sm:text-lg font-medium border border-blue-600 dark:border-blue-300 hover:bg-blue-100 dark:hover:bg-gray-700 transition duration-200"
              >
                เรียนรู้เพิ่มเติม
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Section 2: Overview Section */}
      <section className="relative bg-gray-50 dark:bg-gray-800 py-16 px-6 md:px-20 lg:px-32 transition duration-300">
        <motion.div
          className="container mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between gap-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1 }}
        >
          {/* Content */}
          <motion.div
            className="w-full md:w-1/2 text-center md:text-left space-y-6"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <motion.h2
              className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              ภาพรวม
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              ระบบ IT-Helpdesk ของเราไม่เพียงแค่ช่วยแก้ปัญหาเทคโนโลยีสารสนเทศทั่วไป แต่ยังเป็นตัวกลางที่ช่วยให้การทำงานในองค์กร
              เชื่อมต่อได้อย่างมีประสิทธิภาพ เราให้ความสำคัญกับการจัดการคำขอจากผู้ใช้งาน ติดตามงานที่สำคัญ
              และช่วยลดภาระงานที่ซับซ้อนของแผนก IT
            </motion.p>
            <motion.p
              className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              คุณสมบัติเด่นของระบบ ได้แก่ การจัดการคำขออัตโนมัติ การแจ้งเตือนสถานะคำขอในแบบเรียลไทม์
              และระบบวิเคราะห์ข้อมูลที่ช่วยให้ผู้บริหารสามารถวางแผนและปรับปรุงประสิทธิภาพการทำงานขององค์กรได้
            </motion.p>
            <motion.p
              className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              ระบบนี้ไม่เพียงช่วยให้แผนก IT ทำงานได้เร็วขึ้น แต่ยังช่วยเพิ่มความพึงพอใจให้กับพนักงานทุกคนในองค์กร
              ด้วยการแก้ปัญหาที่รวดเร็วและโปร่งใส
            </motion.p>
          </motion.div>

          {/* Animation */}
          <motion.div
            className="w-full md:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="max-w-md lg:max-w-lg w-full">
              <Lottie animationData={animationData2} loop autoplay className="w-full h-auto" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Section 3 คุณสมบัติเด่นของระบบ  */}
      <section className="relative bg-gray-50 dark:bg-gray-900 py-16 px-6 md:px-20 lg:px-32 transition duration-300">
        <motion.div
          className="container mx-auto text-center space-y-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1 }}
        >
          {/* Header */}
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            คุณสมบัติเด่นของระบบ IT-Helpdesk
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            ระบบของเรามีฟีเจอร์ที่ช่วยเพิ่มประสิทธิภาพการทำงาน ลดความซับซ้อน และเพิ่มความโปร่งใสให้กับองค์กร
          </motion.p>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            {/* Feature 1 */}
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-left"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 dark:bg-blue-700 text-blue-500 dark:text-blue-100 p-3 rounded-lg">
                  <img
                    src="/asset/png/task-management.png"
                    alt="Task Tracking"
                    className="w-10 h-10"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  การติดตามงาน
                </h3>
              </div>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                ติดตามคำขอและงานต่าง ๆ ได้แบบเรียลไทม์ พร้อมแสดงสถานะงานที่โปร่งใสและเข้าใจง่าย
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-left"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-100 dark:bg-yellow-700 text-yellow-500 dark:text-yellow-100 p-3 rounded-lg">
                  <img
                    src="/asset/png/exploration.png"
                    alt="Data Analysis"
                    className="w-10 h-10"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  การวิเคราะห์ข้อมูล
                </h3>
              </div>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                วิเคราะห์ประสิทธิภาพการทำงานของทีม IT ผ่านกราฟและรายงานที่ช่วยให้ตัดสินใจได้อย่างรวดเร็ว
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-left"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 dark:bg-green-700 text-green-500 dark:text-green-100 p-3 rounded-lg">
                  <img
                    src="/asset/png/timetable.png"
                    alt="Task Management"
                    className="w-10 h-10"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  การจัดการตารางเวลา
                </h3>
              </div>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                จัดการตารางงาน เช่น การประชุมและ Sprint Planning พร้อมแจ้งเตือนกิจกรรมที่สำคัญ
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-left"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-red-100 dark:bg-red-700 text-red-500 dark:text-red-100 p-3 rounded-lg">
                  <img
                    src="/asset/png/noti.png"
                    alt="Notification"
                    className="w-10 h-10"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  การแจ้งเตือนอัตโนมัติ
                </h3>
              </div>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                ระบบแจ้งเตือนสถานะของคำขอและเหตุการณ์สำคัญ ช่วยให้คุณไม่พลาดทุกงานที่สำคัญ
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-left"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 dark:bg-indigo-700 text-indigo-500 dark:text-indigo-100 p-3 rounded-lg">
                  <img
                    src="/asset/png/cloud-database.png"
                    alt="Cloud Database"
                    className="w-10 h-10"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  ฐานข้อมูลผู้ใช้งาน
                </h3>
              </div>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                บริหารจัดการข้อมูลผู้ใช้งานได้ง่าย พร้อมฟีเจอร์ค้นหาข้อมูลผู้ใช้ภายในองค์กรอย่างรวดเร็ว
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-left"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 dark:bg-purple-700 text-purple-500 dark:text-purple-100 p-3 rounded-lg">
                  <img
                    src="/asset/png/open-book.png"
                    alt="Knowledge Base"
                    className="w-10 h-10"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  ฐานข้อมูลความรู้
                </h3>
              </div>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                ศูนย์รวมคู่มือและคำแนะนำในการแก้ไขปัญหา ช่วยลดเวลาในการแก้ปัญหาเบื้องต้น
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Section 4 เรื่องราวความสำเร็จ */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16 px-6 md:px-20 lg:px-32">
        <motion.div
          className="container mx-auto text-center space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            เรื่องราวความสำเร็จ
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            ลูกค้าของเราประสบความสำเร็จมากมายจากการใช้ระบบ IT-Helpdesk
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={story.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center"
                custom={index}
                variants={cardVariants}
              >
                {/* Image Section */}
                <motion.div
                  className="w-56 h-56  flex justify-center  overflow-hidden"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={story.image}
                    alt={story.company}
                    className="rounded-md w-full h-full object-cover"
                  />
                </motion.div>

                {/* Text Section */}
                <motion.h3
                  className="text-lg font-bold text-gray-900 dark:text-white text-center mt-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.3 + 0.2 }}
                >
                  {story.company}
                </motion.h3>
                <motion.p
                  className="text-gray-700 dark:text-gray-300 text-center mt-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.3 + 0.4 }}
                >
                  {story.description}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section 5: Activities */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16 px-6 md:px-20 lg:px-32">
        <div className="container mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
            กิจกรรมล่าสุด
          </h2>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
            กิจกรรมที่น่าสนใจจากแผนก IT ของเรา
          </p>
          <Slider {...settings} className="px-6">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                className="flex flex-col bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex-grow"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                style={{
                  maxWidth: '300px', // ความกว้างของการ์ด
                  margin: '0 auto', // จัดให้อยู่ตรงกลาง
                }}
              >
                <div className="flex flex-col justify-between h-full">
                  {/* ส่วนเนื้อหา */}
                  <div>
                    {/* รูปภาพ */}
                    <div className="mb-5 w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden rounded-md">
                      {activity.image ? (
                        <img
                          src={activity.image}
                          alt={activity.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">ไม่มีรูปภาพ</span>
                      )}
                    </div>

                    {/* เนื้อหา */}
                    <div className="flex flex-col flex-grow">
                      {/* หัวข้อ */}
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-4">
                        {activity.title}
                      </h3>

                      {/* คำอธิบาย */}
                      <p
                        className="text-sm text-gray-700 dark:text-gray-400 mt-2 flex-grow"
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2, // จำกัดข้อความที่ 2 บรรทัด
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {activity.description}
                      </p>

                      {/* วันที่ */}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        วันที่: {activity.date}
                      </p>
                    </div>
                  </div>

                  {/* ปุ่ม */}
                  <button
                    className="text-blue-600 dark:text-blue-300 font-medium hover:underline mt-auto"
                    onClick={() => openActivityModal(activity)}
                  >
                    ดูรายละเอียดเพิ่มเติม
                  </button>
                </div>

              </motion.div>
            ))}
          </Slider>








        </div>

        {/* Modal */}
        <Modal
          isOpen={activityModalOpen}
          onRequestClose={closeActivityModal}
          contentLabel="Activity Details"
          className="bg-white dark:bg-gray-800 w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-3xl mx-auto p-4 sm:p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 pt-28 pb-10"
        >
          {selectedActivity && (
            <div className="space-y-6">
              {/* รูปภาพหัวข้อกิจกรรม */}
              <img
                src={selectedActivity.image}
                alt={selectedActivity.title}
                className="w-full h-48 sm:h-64 object-cover rounded-md shadow-md"
              />

              {/* หัวข้อกิจกรรม */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white text-center">
                {selectedActivity.title}
              </h2>

              {/* คำบรรยาย */}
              <p className="text-sm sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-center">
                {selectedActivity.description}
              </p>

              {/* รายละเอียดเพิ่มเติม */}
              <div className="text-left space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  รายละเอียดเพิ่มเติม
                </h3>
                <div
                  className="text-gray-700 dark:text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedActivity.details }}
                />
              </div>

              {/* ปุ่มดำเนินการ */}
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={closeActivityModal}
                  className="px-4 sm:px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
                >
                  ปิด
                </button>
              </div>
            </div>
          )}
        </Modal>
      </section>

      {/* Section 6  คำชมจากผู้ใช้งานจริง */}
      <section className="relative bg-gray-50 dark:bg-gray-900 py-16 px-6 md:px-20 lg:px-32 transition duration-300">
        <motion.div
          className="container mx-auto text-center space-y-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {/* Header */}
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            คำชมจากผู้ใช้งานจริง
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            ระบบ IT-Helpdesk ของเราช่วยให้ทีม IT ทำงานง่ายขึ้นและได้รับคำชมมากมายจากผู้ใช้งาน
          </motion.p>

          {/* Testimonials Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            {/* Testimonial 1 */}
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-left"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-4">
                <img
                  src="https://doraemonfc.wordpress.com/wp-content/uploads/2014/02/chara_image2.png"
                  alt="โนบิตะ โนบิ"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    โนบิตะ โนบิ
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">แผนก IT</p>
                </div>
              </div>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                "ระบบ IT-Helpdesk ช่วยให้ผมสามารถจัดการงานได้อย่างเป็นระเบียบ และลดความผิดพลาดที่เคยเกิดขึ้น งานเสร็จเร็วขึ้นและได้คุณภาพ"
              </p>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-left"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-4">
                <img
                  src="https://doraemonden.wordpress.com/wp-content/uploads/2014/10/shizuka.jpg"
                  alt="ชิซุกะ มินาโมโตะ"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    ชิซุกะ มินาโมโตะ
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">แผนก HR</p>
                </div>
              </div>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                "เราใช้ระบบนี้ในการประสานงานกับแผนก IT บอกเลยว่าสะดวกสุด ๆ การแจ้งปัญหาไม่ใช่เรื่องยุ่งยากอีกต่อไป"
              </p>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-left"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-4">
                <img
                  src="https://scontent.fbkk14-1.fna.fbcdn.net/v/t39.30808-6/464911550_9007038222648049_6842796336395887046_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=aa7094&_nc_eui2=AeHMXD5X1bjeX1xNgha4cKl04Lk8X7S48JfguTxftLjwl-RL35kR505MpMFDHBM38C_mT4MXiX8pNsoSs76TIqrJ&_nc_ohc=YD5F3ZuxIvoQ7kNvgH3spV3&_nc_zt=23&_nc_ht=scontent.fbkk14-1.fna&_nc_gid=AtO79Zah-LhUnG33TwcnSGN&oh=00_AYBIpra3wozQaM0kTdQ_ONumzR9QBobUFS_0lHoTSBwAjQ&oe=674DCD66"
                  alt="ไจแอนท์ โกดะ"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    ไจแอนท์ โกดะ
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">แผนกการเงิน</p>
                </div>
              </div>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                "ด้วยระบบแจ้งเตือนและติดตามผลแบบเรียลไทม์ แผนกการเงินของเราไม่พลาดงานสำคัญอีกต่อไป แถมยังช่วยลดข้อผิดพลาดในงานได้มาก"
              </p>
            </motion.div>

            {/* Testimonial 4 */}
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-left"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-4">
                <img
                  src="https://scontent.fbkk14-1.fna.fbcdn.net/v/t39.30808-6/464913813_9007155045969700_6139572994109299308_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=aa7094&_nc_eui2=AeFNaAPnLyMPhmIVs_EyL5JlkzcfKxoMrS2TNx8rGgytLdogsCtkRHkyCGtF98C9TxPKkwbVY6fcPUhlHHLOqPse&_nc_ohc=_HX0fE18xkcQ7kNvgEAZzrY&_nc_zt=23&_nc_ht=scontent.fbkk14-1.fna&_nc_gid=At0f9EdLxBdectTb40eBkZp&oh=00_AYD_CASnXXCSD0L_nQrIZp7xXyK9HkVGuTGpF93dub_vdQ&oe=674DCA46"
                  alt="เดคิซุงิ ฮิเดโทชิ"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    เดคิซุงิ ฮิเดโทชิ
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">แผนกบัญชี</p>
                </div>
              </div>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                "การวิเคราะห์ข้อมูลของระบบนี้สุดยอดมาก ช่วยให้เรามองเห็นปัญหาและวางแผนงานได้อย่างมีประสิทธิภาพ"
              </p>
            </motion.div>

            {/* Testimonial 5 */}
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-left"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-4">
                <img
                  src="https://media.komchadluek.net/uploads/images/contents/w1024/2021/09/Qsso4Nln64p8qettl5mK.jpg?x-image-process=style/lg-webp"
                  alt="โดราเอมอน"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    โดราเอมอน
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ฝ่ายสนับสนุน IT
                  </p>
                </div>
              </div>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                "เหมือนกระเป๋าวิเศษที่ช่วยให้เราทำงานได้ง่ายขึ้น! ทุกปัญหาได้รับการแก้ไขในเวลาที่เหมาะสม และทีมงานก็มีความสุขมาก"
              </p>
            </motion.div>

            {/* Testimonial 6 */}
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-left"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-4">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSN6CH1cCaZaGiJxwKyCIAiRTrSh2n_z1_zdA&s"
                  alt="ไจโกะ โกดะ"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    ไจโกะ โกดะ
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ผู้บริหาร
                  </p>
                </div>
              </div>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                "การมองภาพรวมของงานทั้งหมดในองค์กรง่ายขึ้นมาก ระบบ IT-Helpdesk ทำให้เราสามารถจัดการงานต่าง ๆ ได้มีประสิทธิภาพยิ่งขึ้น"
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Section 7 ผังสมาชิกแผนก IT */}
      <section className="relative bg-gray-50 dark:bg-gray-900 py-16 px-6 md:px-20 lg:px-32">
        <div className="container mx-auto text-center space-y-12">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
            ผังสมาชิกแผนก IT
          </h2>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-12">
            โครงสร้างทีม IT ของเรา พร้อมช่วยเหลือทุกความต้องการของคุณ
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 7 ประกาศ */}
      <section className="relative bg-gray-50 dark:bg-gray-900 py-16 px-6 md:px-20 lg:px-32">
        <motion.div
          className="container mx-auto text-center space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.3 } },
          }}
        >
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white"
            variants={{
              hidden: { opacity: 0, y: -30 },
              visible: { opacity: 1, y: 0, transition: { duration: 1 } },
            }}
          >
            ประกาศล่าสุด
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300"
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.2 } },
            }}
          >
            ประกาศสำคัญจากแผนก IT และข่าวสารอัพเดต
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex flex-col"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <div className="w-full h-full overflow-hidden rounded-md">
                  <motion.img
                    src={announcement.image}
                    alt={announcement.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <motion.h3
                  className="text-lg font-bold text-gray-900 dark:text-white mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {announcement.title}
                </motion.h3>
                <motion.p
                  className="text-sm text-gray-700 dark:text-gray-400 mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {announcement.summary}
                </motion.p>
                <motion.p
                  className="text-sm text-gray-500 dark:text-gray-400 mt-2"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  วันที่: {announcement.date}
                </motion.p>
                <motion.button
                  onClick={() => openAnnouncementModal(announcement)}
                  className="text-blue-600 dark:text-blue-300 font-medium hover:underline mt-4 block"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                >
                  อ่านรายละเอียดเพิ่มเติม
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Modal */}
        <Modal
          isOpen={announcementModalOpen}
          onRequestClose={closeAnnouncementModal}
          contentLabel="Announcement Details"
          className="bg-white dark:bg-gray-800 max-w-3xl mx-auto p-6 rounded-lg shadow-lg overflow-hidden"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center pt-[75px] " // เพิ่ม pt-16 เพื่อระยะห่างจาก Navbar
        >
          {selectedAnnouncement && (
            <div className="space-y-6">
              <img
                src={selectedAnnouncement.image}
                alt={selectedAnnouncement.title}
                className="w-full h-64 object-cover rounded-md shadow-md"
              />
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white text-center">
                {selectedAnnouncement.title}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedAnnouncement.summary}
              </p>
              <div
                className="text-gray-700 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedAnnouncement.details }}
              />
              <div className="flex justify-center mt-6">
                <button
                  onClick={closeAnnouncementModal}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
                >
                  ปิด
                </button>
              </div>
            </div>
          )}
        </Modal>

      </section>


      {/* Section 8 บทความ */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16 px-6 md:px-20 lg:px-32">
        <motion.div
          className="container mx-auto text-center space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.3 } },
          }}
        >
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white"
            variants={{
              hidden: { opacity: 0, y: -30 },
              visible: { opacity: 1, y: 0, transition: { duration: 1 } },
            }}
          >
            บทความ
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300"
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.2 } },
            }}
          >
            ศูนย์รวมความรู้ที่ช่วยคุณแก้ไขปัญหาและเพิ่มทักษะด้าน IT
          </motion.p>

          <div className="flex flex-wrap justify-center gap-8">
            {/* Blog Post 1 */}
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow max-w-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.img
                src="https://via.placeholder.com/300x200"
                alt="Blog 1"
                className="w-full h-48 object-cover rounded-md"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
              <motion.h3
                className="text-lg font-bold text-gray-900 dark:text-white mt-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                วิธีใช้ IT-Helpdesk
              </motion.h3>
              <motion.p
                className="text-gray-700 dark:text-gray-300 mt-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                เรียนรู้ฟีเจอร์ที่คุณยังไม่เคยรู้
              </motion.p>
              <motion.a
                href="#"
                className="text-blue-600 dark:text-blue-300 font-medium hover:underline mt-4 block"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                อ่านเพิ่มเติม
              </motion.a>
            </motion.div>

            {/* Blog Post 2 */}
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow max-w-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.img
                src="https://via.placeholder.com/300x200"
                alt="Blog 2"
                className="w-full h-48 object-cover rounded-md"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
              <motion.h3
                className="text-lg font-bold text-gray-900 dark:text-white mt-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                10 เคล็ดลับ IT
              </motion.h3>
              <motion.p
                className="text-gray-700 dark:text-gray-300 mt-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                เคล็ดลับสำหรับทีม IT ที่ทุกคนควรรู้
              </motion.p>
              <motion.a
                href="#"
                className="text-blue-600 dark:text-blue-300 font-medium hover:underline mt-4 block"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                อ่านเพิ่มเติม
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </section>


      {/* Section 9 คำถามที่พบบ่อย */}
      <section className="relative bg-gray-50 dark:bg-gray-900 py-16 px-6 md:px-20 lg:px-32">
        <motion.div
          className="container mx-auto text-center space-y-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            คำถามที่พบบ่อย
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            คำตอบสำหรับคำถามที่คุณอาจสงสัยเกี่ยวกับระบบ IT-Helpdesk
          </motion.p>

          <div className="text-left space-y-6">
            {/* FAQ 1 */}
            <motion.details
              className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <summary className="font-medium text-lg text-gray-900 dark:text-white cursor-pointer">
                ระบบ IT-Helpdesk รองรับฟีเจอร์อะไรบ้าง?
              </summary>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                ระบบรองรับฟีเจอร์ต่าง ๆ เช่น การติดตามงานแบบเรียลไทม์ การวิเคราะห์ข้อมูล
                การแจ้งเตือนสถานะงาน การจัดการคำขอจากผู้ใช้งาน การบันทึกข้อมูลผู้ใช้ และการจัดลำดับความสำคัญของงาน.
              </p>
            </motion.details>

            {/* FAQ 2 */}
            <motion.details
              className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <summary className="font-medium text-lg text-gray-900 dark:text-white cursor-pointer">
                วิธีเริ่มต้นใช้งานระบบทำอย่างไร?
              </summary>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                คุณสามารถลงทะเบียนผ่านหน้าเว็บไซต์ จากนั้นเข้าสู่ระบบโดยใช้บัญชีของคุณเพื่อเริ่มต้นใช้งาน.
                หากมีข้อสงสัย สามารถติดต่อฝ่าย IT เพื่อขอความช่วยเหลือในการตั้งค่าบัญชี.
              </p>
            </motion.details>

            {/* FAQ 3 */}
            <motion.details
              className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <summary className="font-medium text-lg text-gray-900 dark:text-white cursor-pointer">
                ระบบนี้รองรับการใช้งานบนมือถือหรือไม่?
              </summary>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                ระบบ IT-Helpdesk รองรับการใช้งานทั้งบนเดสก์ท็อปและมือถือ โดยได้รับการออกแบบให้มี
                Responsive Design เพื่อให้ใช้งานได้สะดวกทุกขนาดหน้าจอ.
              </p>
            </motion.details>

            {/* FAQ 4 */}
            <motion.details
              className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <summary className="font-medium text-lg text-gray-900 dark:text-white cursor-pointer">
                ฉันสามารถแจ้งปัญหาผ่านช่องทางอื่นได้หรือไม่?
              </summary>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                คุณสามารถแจ้งปัญหาผ่านอีเมล โทรศัพท์ หรือแอปพลิเคชันมือถือ โดยข้อมูลทั้งหมดจะถูกบันทึกในระบบ
                เพื่อให้คุณสามารถติดตามสถานะการแก้ไขได้.
              </p>
            </motion.details>

            {/* FAQ 5 */}
            <motion.details
              className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <summary className="font-medium text-lg text-gray-900 dark:text-white cursor-pointer">
                การรักษาความปลอดภัยของข้อมูลในระบบเป็นอย่างไร?
              </summary>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                ระบบ IT-Helpdesk มีการเข้ารหัสข้อมูลและการควบคุมการเข้าถึง
                เพื่อรักษาความปลอดภัยของข้อมูลผู้ใช้งานอย่างสูงสุด.
              </p>
            </motion.details>
          </div>
        </motion.div>
      </section>







    </div>
  );
}