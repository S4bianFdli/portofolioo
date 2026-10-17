import { PortfolioData } from './portfolio';

export const defaultPortfolioData: PortfolioData = {
  profile: {
    name: 'Rizki',
    greeting: "Hi, I'm",
    titles: [
      'Frontend Developer',
      'Fullstack Developer',
      'Bot Specialist',
      'Creative Coder'
    ],
    bio: 'Halo! Saya suka ngoding dan bereksperimen dengan ide-ide baru. Bagi saya, setiap baris kode adalah cara untuk menghadirkan sesuatu yang bermanfaat dan keren di dunia digital.',
    avatarUrl: '/profil.jpg',
    cvUrl: '#',
    badges: [
      { id: 'b1', icon: 'clock', text: '2+ Years of Experience' },
      { id: 'b2', icon: 'code', text: 'Javascript Main Language' },
      { id: 'b3', icon: 'terminal', text: 'Fullstack developer' }
    ],
    socialLinks: {
      instagram: 'https://instagram.com/ryhar.123',
      github: 'https://github.com/ryhar',
      linkedin: 'https://linkedin.com/in/ahmad-rizki-hartawan',
      twitter: 'https://twitter.com/ryhar_dev',
      email: 'ryharofficial@gmail.com'
    }
  },
  about: {
    whoAmI: 'Saya seorang web developer yang berfokus pada menciptakan tampilan dan pengalaman pengguna yang sederhana, cepat, dan fungsional.',
    myApproach: 'Saya mengutamakan clean code, desain responsif, dan pengalaman pengguna yang intuitif dalam setiap proyek yang saya kerjakan.',
    personalDetails: {
      name: 'Ahmad Rizki Hartawan',
      placeOfBirth: 'Palembang, Indonesia',
      phone: '+62 895-0818-8642',
      gpa: '3.84',
      email: 'ryharofficial@gmail.com',
      education: 'Universitas Multi Data Palembang'
    }
  },
  experiences: [
    {
      id: 'exp-1',
      year: '2025',
      role: 'Fullstack Web Developer',
      company: 'RYHAR PANEL',
      description: 'Developed a web platform for selling hosting panels with dedicated admin and user dashboards. Implemented analytics for monitoring sales and system usage, built system settings management, and integrated a payment gateway for automated transactions.',
      skills: ['NEXT.JS', 'NODE.JS', 'PRISMA', 'EXPRESS.JS', 'TAILWIND CSS', 'MYSQL', 'API INTEGRATION']
    },
    {
      id: 'exp-2',
      year: '2025',
      role: 'Fullstack Web Developer',
      company: 'RYHAR API',
      description: 'Developed Ryhar API, a platform that provides developers with easy access to free APIs accompanied by comprehensive documentation. Built a responsive frontend interface and implemented a backend system to handle API requests, user access, and data management.',
      skills: ['NEXT.JS', 'TAILWIND CSS', 'EXPRESS.JS', 'MYSQL', 'REST API']
    },
    {
      id: 'exp-3',
      year: '2024 - 2025',
      role: 'Bot Developer',
      company: 'WHATSAPP BOT PLATFORM',
      description: 'Built a multifunctional WhatsApp bot with various features including games, utility tools, and automated services. Implemented message processing, API integrations, and dynamic command handling to create interactive chat-based experiences.',
      skills: ['NODE.JS', 'BAILEYS', 'PUPPETEER', 'EXPRESS.JS', 'CANVAS', 'API INTEGRATION']
    }
  ],
  techStack: [
    {
      id: 'cat-frontend',
      category: 'Frontend Languages & Frameworks',
      description: 'The tools I use to build beautiful, responsive, and interactive user interfaces.',
      items: [
        { name: 'React', iconName: 'Atom' },
        { name: 'Next.js', iconName: 'Layers' },
        { name: 'Tailwind CSS', iconName: 'Palette' },
        { name: 'TypeScript', iconName: 'Code' }
      ]
    },
    {
      id: 'cat-backend',
      category: 'Backend Core',
      description: 'The foundations of the APIs and services I build for web apps and bots.',
      items: [
        { name: 'Node.js', iconName: 'Server' },
        { name: 'Express.js', iconName: 'Cpu' },
        { name: 'MySQL', iconName: 'Database' },
        { name: 'MongoDB', iconName: 'HardDrive' }
      ]
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Ryhar Panel',
      category: 'Web App',
      shortDescription: 'Platform web untuk menjual panel hosting dengan sistem dashboard terpisah untuk admin dan user serta integrasi payment gateway.',
      fullDescription: 'Ryhar Panel adalah solusi SaaS hosting reseller yang memfasilitasi manajemen server game, web hosting, serta pembayaran instan dengan QRIS/Virtual Account. Dilengkapi dashboard analitik real-time, manajemen pengguna dengan role bertingkat, dan automasi penyediaan server.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
      tags: ['Next.js', 'Prisma', 'Tailwind CSS', 'Payment Gateway'],
      demoUrl: 'https://panel.ryhar.dev',
      githubUrl: 'https://github.com/ryhar/ryhar-panel',
      features: [
        'Dedicated admin dashboard dengan monitoring revenue realtime',
        'User billing portal & invoicing otomatis',
        'Integrasi QRIS dan Payment Gateway Indonesia',
        'Automated server deployment via API'
      ]
    },
    {
      id: 'proj-2',
      title: 'Ryhar API',
      category: 'API Service',
      shortDescription: 'Platform Rest API yang menyediakan berbagai endpoint gratis dan mudah digunakan untuk developer, lengkap dengan dokumentasi API yang jelas.',
      fullDescription: 'Ryhar API menyediakan puluhan endpoint utilitas untuk developers, mulai dari downloader sosial media, AI query wrapper, text-to-speech, scraping tools, hingga generator gambar. Dilengkapi interactive Swagger docs dan API key rate limiting.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80',
      tags: ['Express.js', 'Node.js', 'MySQL', 'REST API'],
      demoUrl: 'https://api.ryhar.dev',
      githubUrl: 'https://github.com/ryhar/ryhar-api',
      features: [
        'Lebih dari 40+ REST API endpoints publik',
        'Dokumentasi interaktif dengan playground live test',
        'Rate limiting & token authentication system',
        '99.9% uptime dengan caching Redis'
      ]
    },
    {
      id: 'proj-3',
      title: 'Elaina Bot (WhatsApp)',
      category: 'Bot Platform',
      shortDescription: 'Multifunctional WhatsApp bot with games, tools, and automation features designed to enhance user interaction directly within WhatsApp.',
      fullDescription: 'Elaina Bot WhatsApp adalah bot multi-perangkat cerdas yang dibangun menggunakan Baileys library. Menangani ribuan interaksi chat per hari, menyediakan mini games grup, downloader media otomatis, reminder, dan integrasi kecerdasan buatan.',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
      tags: ['Node.js', 'Baileys', 'Puppeteer', 'Canvas'],
      demoUrl: 'https://wa.me/6289508188642?text=.menu',
      githubUrl: 'https://github.com/ryhar/elaina-bot-whatsapp',
      features: [
        'Multi-device session handling dengan Baileys',
        'Game kuis, RPG sederhana, dan tebak gambar',
        'Media converter (Sticker maker, video to audio)',
        'Auto moderation group & anti-link protection'
      ]
    }
  ],
  seo: {
    metaTitle: 'Ahmad Rizki Hartawan (RyHar) – Fullstack Web Developer',
    metaDescription: 'Portofolio Ahmad Rizki Hartawan (RyHar), Fullstack Web Developer & Bot Specialist berfokus pada React, Next.js, Node.js, Express, dan solusi web modern.',
    keywords: 'Ahmad Rizki Hartawan, RyHar, Portfolio, Fullstack Developer, Web Developer, Frontend Developer, React, Next.js, Node.js, Palembang, Indonesia',
    ogImage: '/profil.jpg',
    author: 'Ahmad Rizki Hartawan',
    canonicalUrl: ''
  },
  adminSettings: {
    secretSlug: 'admin',
    pinCode: 'admin123',
    enablePin: true
  }
};
