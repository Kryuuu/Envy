"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "ID" | "EN" | "JP" | "CN";

type Dictionary = {
  [key in Language]: {
    nav: {
      about: string;
      skills: string;
      projects: string;
      experience: string;
      services: string;
      contact: string;
      letsTalk: string;
    };
    hero: {
      freelance: string;
      title: string;
      role: string[];
      description: string;
      downloadCv: string;
      viewProjects: string;
    };
    about: {
      badge: string;
      title1: string;
      title2: string;
      desc1: string;
      desc2: string;
      desc3: string;
      values: { title: string; desc: string }[];
    };
    skills: {
      badge: string;
      title1: string;
      title2: string;
      desc: string;
      categories: { [key: string]: string };
    };
    projects: {
      badge: string;
      title1: string;
      title2: string;
      viewProject: string;
      sourceCode: string;
      viewAll: string;
    };
    experience: {
      badge: string;
      title1: string;
      title2: string;
      desc: string;
    };
    services: {
      badge: string;
      title1: string;
      title2: string;
      desc: string;
      items: { title: string; desc: string; benefit: string }[];
    };
    testimonials: {
      badge: string;
      title1: string;
      title2: string;
    };
    contact: {
      badge: string;
      title1: string;
      title2: string;
      desc: string;
      waDesc: string;
      emailDesc: string;
      availability: string;
    };
    certificates: {
      badge: string;
      titlePage: string;
      titleHome: string;
      subtitlePage: string;
      subtitleHome: string;
      descPage: string;
      descHome: string;
      viewAll: string;
      preview: string;
      open: string;
    };
    footer: {
      role: string;
      desc: string;
      quickLinks: string;
      connect: string;
      freelance: string;
      rights: string;
      crafted: string;
    };
  };
};

export const dictionary: Dictionary = {
  EN: {
    nav: {
      about: "About",
      skills: "Skills",
      projects: "Projects",
      experience: "Experience",
      services: "Services",
      contact: "Contact",
      letsTalk: "Let's Talk",
    },
    hero: {
      freelance: "Available for freelance projects",
      title: "Creative Developer &",
      role: ["Web Developer", "Android Developer", "Network Administrator", "Multimedia Creator", "UI/UX Designer"],
      description: "Building modern digital solutions, web applications, multimedia experiences, and technology systems for businesses and UMKM.",
      downloadCv: "Download CV",
      viewProjects: "View Projects",
    },
    about: {
      badge: "About Me",
      title1: "Not just a developer.",
      title2: "A digital partner.",
      desc1: "I'm a multidisciplinary developer and creative based in Banjarmasin, Indonesia. Currently studying Informatics Engineering at UNISKA, I specialize in building modern web experiences, mobile applications, and managing network infrastructure.",
      desc2: "With a background spanning full-stack development, Android development, network administration, video production, and visual design, I bring a unique perspective to every project. I don't just build websites — I craft digital experiences that help businesses grow and ideas come to life.",
      desc3: "Whether you're a small business looking to go digital, a startup needing a custom platform, or an UMKM wanting a professional web presence — I'm here to make it happen.",
      values: [
        { title: "Problem-First Thinking", desc: "I start with understanding your challenge before writing a single line of code." },
        { title: "Always Learning", desc: "Technology evolves fast. I stay sharp to bring you the best solutions." },
        { title: "Ship With Quality", desc: "Fast delivery without cutting corners. Every detail matters." },
        { title: "Genuine Partnership", desc: "Your success is my success. I treat every project as my own." },
      ]
    },
    skills: {
      badge: "Tech Stack",
      title1: "Tools & technologies",
      title2: " I work with",
      desc: "A versatile toolkit built around delivering quality — from modern frameworks to creative suites and network infrastructure.",
      categories: { "All": "All", "Frontend": "Frontend", "Backend": "Backend", "Mobile": "Mobile", "Database": "Database", "Networking": "Networking", "Tools": "Tools" }
    },
    projects: {
      badge: "Featured Projects",
      title1: "Projects that",
      title2: " deliver results",
      viewProject: "View Project",
      sourceCode: "Source Code",
      viewAll: "View All Projects"
    },
    experience: {
      badge: "Experience",
      title1: "My journey in",
      title2: " technology",
      desc: "Education, freelance work, internships, and a continuous passion for learning and building."
    },
    services: {
      badge: "Services",
      title1: "What I can",
      title2: " help you with",
      desc: "From building digital products to setting up network infrastructure — I offer comprehensive technology solutions for businesses and organizations.",
      items: [
        { title: "Web Development", desc: "Modern, responsive websites and web applications built with cutting-edge frameworks like Next.js, React, Laravel, and PHP.", benefit: "Full-stack solutions" },
        { title: "Android Development", desc: "Cross-platform mobile applications using Flutter and Dart, delivering smooth native-like experiences for Android devices.", benefit: "Native-like performance" },
        { title: "Network Setup", desc: "Network infrastructure design and administration using Linux, Docker, and Mikrotik for reliable business connectivity.", benefit: "Reliable infrastructure" },
        { title: "IT Consulting", desc: "Strategic technology consulting to help businesses choose the right tools, architecture, and digital transformation path.", benefit: "Smart tech decisions" },
        { title: "UI/UX Design", desc: "User-centered interface design with modern aesthetics, smooth interactions, and pixel-perfect implementation.", benefit: "Delightful experiences" },
        { title: "Digital Media Production", desc: "Professional video editing, motion graphics, and multimedia content creation using After Effects, Photoshop, and creative tools.", benefit: "Visual storytelling" }
      ]
    },
    testimonials: {
      badge: "Testimonials",
      title1: "What people",
      title2: " say about me"
    },
    contact: {
      badge: "Get in Touch",
      title1: "Have an idea?",
      title2: " Let's build it together.",
      desc: "Whether you need a website, a custom web system, mobile app, network setup, or a digital presence — I'm ready to help bring your vision to life. Reach out and let's discuss your project.",
      waDesc: "Fastest response — usually within 1 hour",
      emailDesc: "For more detailed project briefs",
      availability: "Available for freelance — response within 24 hours"
    },
    certificates: {
      badge: "Credentials",
      titlePage: "All certificates",
      titleHome: "Certificates that",
      subtitlePage: " and credentials",
      subtitleHome: " back the work",
      descPage: "A complete collection of professional credentials, certifications, and academic achievements.",
      descHome: "A curated record of learning, achievements, and professional proof behind the portfolio.",
      viewAll: "View all certificates",
      preview: "Preview",
      open: "Open"
    },
    footer: {
      role: "Creative Developer &\nDigital Media Specialist",
      desc: "Building modern digital solutions, web applications, and technology systems. Based in Banjarmasin, available worldwide.",
      quickLinks: "Quick Links",
      connect: "Connect",
      freelance: "Available for freelance projects.\nLet's build something great together.",
      rights: "All rights reserved.",
      crafted: "Crafted with"
    }
  },
  ID: {
    nav: {
      about: "Tentang",
      skills: "Keahlian",
      projects: "Proyek",
      experience: "Pengalaman",
      services: "Layanan",
      contact: "Kontak",
      letsTalk: "Mari Diskusi",
    },
    hero: {
      freelance: "Tersedia untuk proyek lepas",
      title: "Pengembang Kreatif &",
      role: ["Pengembang Web", "Pengembang Android", "Administrator Jaringan", "Kreator Multimedia", "Desainer UI/UX"],
      description: "Membangun solusi digital modern, aplikasi web, pengalaman multimedia, dan sistem teknologi untuk bisnis dan UMKM.",
      downloadCv: "Unduh CV",
      viewProjects: "Lihat Proyek",
    },
    about: {
      badge: "Tentang Saya",
      title1: "Bukan sekadar pengembang.",
      title2: "Mitra digital Anda.",
      desc1: "Saya adalah pengembang multidisiplin dan kreator yang berbasis di Banjarmasin, Indonesia. Saat ini sedang menempuh pendidikan Teknik Informatika di UNISKA, saya berspesialisasi dalam membangun pengalaman web modern, aplikasi seluler, dan mengelola infrastruktur jaringan.",
      desc2: "Dengan latar belakang yang mencakup pengembangan full-stack, pengembangan Android, administrasi jaringan, produksi video, dan desain visual, saya membawa perspektif unik di setiap proyek. Saya tidak hanya membangun situs web — saya merancang pengalaman digital yang membantu bisnis berkembang dan mewujudkan ide-ide.",
      desc3: "Baik Anda adalah bisnis kecil yang ingin beralih ke digital, startup yang membutuhkan platform khusus, atau UMKM yang menginginkan kehadiran web profesional — saya siap mewujudkannya.",
      values: [
        { title: "Berpikir Berbasis Masalah", desc: "Saya memulai dengan memahami tantangan Anda sebelum menulis satu baris kode pun." },
        { title: "Selalu Belajar", desc: "Teknologi berkembang cepat. Saya terus mengasah diri untuk memberikan solusi terbaik." },
        { title: "Hasil Berkualitas", desc: "Pengiriman cepat tanpa mengorbankan kualitas. Setiap detail penting." },
        { title: "Kemitraan Nyata", desc: "Kesuksesan Anda adalah kesuksesan saya. Saya memperlakukan setiap proyek seperti proyek saya sendiri." },
      ]
    },
    skills: {
      badge: "Teknologi",
      title1: "Alat & teknologi",
      title2: " yang saya gunakan",
      desc: "Kumpulan alat serbaguna yang dibangun untuk memberikan kualitas — dari framework modern hingga infrastruktur jaringan.",
      categories: { "All": "Semua", "Frontend": "Frontend", "Backend": "Backend", "Mobile": "Mobile", "Database": "Database", "Networking": "Jaringan", "Tools": "Alat" }
    },
    projects: {
      badge: "Proyek Pilihan",
      title1: "Proyek yang memberikan",
      title2: " hasil terbaik",
      viewProject: "Lihat Proyek",
      sourceCode: "Kode Sumber",
      viewAll: "Lihat Semua Proyek"
    },
    experience: {
      badge: "Pengalaman",
      title1: "Perjalanan saya di bidang",
      title2: " teknologi",
      desc: "Pendidikan, pekerjaan lepas, magang, dan semangat yang berkelanjutan untuk belajar dan membangun."
    },
    services: {
      badge: "Layanan",
      title1: "Apa yang bisa",
      title2: " saya bantu",
      desc: "Dari membangun produk digital hingga menyiapkan infrastruktur jaringan — saya menawarkan solusi teknologi komprehensif untuk bisnis dan organisasi.",
      items: [
        { title: "Pengembangan Web", desc: "Situs web dan aplikasi web modern dan responsif yang dibangun dengan kerangka kerja canggih seperti Next.js, React, Laravel, dan PHP.", benefit: "Solusi full-stack" },
        { title: "Pengembangan Android", desc: "Aplikasi seluler lintas platform menggunakan Flutter dan Dart, memberikan pengalaman mulus layaknya native untuk perangkat Android.", benefit: "Performa mirip native" },
        { title: "Setup Jaringan", desc: "Desain dan administrasi infrastruktur jaringan menggunakan Linux, Docker, dan Mikrotik untuk konektivitas bisnis yang andal.", benefit: "Infrastruktur andal" },
        { title: "Konsultasi IT", desc: "Konsultasi teknologi strategis untuk membantu bisnis memilih alat, arsitektur, dan jalur transformasi digital yang tepat.", benefit: "Keputusan teknologi cerdas" },
        { title: "Desain UI/UX", desc: "Desain antarmuka yang berpusat pada pengguna dengan estetika modern, interaksi mulus, dan implementasi pixel-perfect.", benefit: "Pengalaman menyenangkan" },
        { title: "Produksi Media Digital", desc: "Pengeditan video profesional, grafik gerak, dan pembuatan konten multimedia menggunakan After Effects, Photoshop, dan alat kreatif.", benefit: "Bercerita secara visual" }
      ]
    },
    testimonials: {
      badge: "Testimoni",
      title1: "Apa kata orang",
      title2: " tentang saya"
    },
    contact: {
      badge: "Hubungi Saya",
      title1: "Punya ide?",
      title2: " Mari kita bangun bersama.",
      desc: "Baik Anda membutuhkan situs web, sistem web khusus, aplikasi seluler, penyiapan jaringan, atau kehadiran digital — saya siap membantu mewujudkan visi Anda. Hubungi saya dan mari diskusikan proyek Anda.",
      waDesc: "Respon tercepat — biasanya dalam 1 jam",
      emailDesc: "Untuk brief project yang lebih detail",
      availability: "Tersedia untuk proyek lepas — respon dalam 24 jam"
    },
    certificates: {
      badge: "Sertifikat",
      titlePage: "Semua sertifikat",
      titleHome: "Sertifikat yang",
      subtitlePage: " dan kredensial",
      subtitleHome: " mendukung karya",
      descPage: "Koleksi lengkap kredensial profesional, sertifikasi, dan pencapaian akademik.",
      descHome: "Catatan pembelajaran, pencapaian, dan bukti profesional kurasi di balik portofolio.",
      viewAll: "Lihat semua sertifikat",
      preview: "Pratinjau",
      open: "Buka"
    },
    footer: {
      role: "Pengembang Kreatif &\nSpesialis Media Digital",
      desc: "Membangun solusi digital modern, aplikasi web, dan sistem teknologi. Berbasis di Banjarmasin, tersedia untuk seluruh dunia.",
      quickLinks: "Tautan Cepat",
      connect: "Terhubung",
      freelance: "Tersedia untuk proyek lepas.\nMari bangun sesuatu yang hebat bersama.",
      rights: "Hak cipta dilindungi undang-undang.",
      crafted: "Dibuat dengan"
    }
  },
  JP: {
    nav: {
      about: "私について",
      skills: "スキル",
      projects: "プロジェクト",
      experience: "経験",
      services: "サービス",
      contact: "お問い合わせ",
      letsTalk: "話しましょう",
    },
    hero: {
      freelance: "フリーランスのプロジェクトに対応可能",
      title: "クリエイティブ開発者 ＆",
      role: ["ウェブ開発者", "Android開発者", "ネットワーク管理者", "マルチメディアクリエイター", "UI/UXデザイナー"],
      description: "ビジネスやUMKM向けのモダンなデジタルソリューション、ウェブアプリ、マルチメディア体験、システムを構築します。",
      downloadCv: "履歴書をダウンロード",
      viewProjects: "プロジェクトを見る",
    },
    about: {
      badge: "私について",
      title1: "ただの開発者ではなく。",
      title2: "デジタルパートナー。",
      desc1: "インドネシアのバンジャルマシンを拠点とする多分野の開発者兼クリエイターです。現在、UNISKAで情報工学を学んでおり、最新のWeb体験、モバイルアプリの構築、ネットワークインフラの管理を専門としています。",
      desc2: "フルスタック開発、Android開発、ネットワーク管理、ビデオ制作、ビジュアルデザインにまたがる背景を持ち、各プロジェクトにユニークな視点をもたらします。ただWebサイトを構築するだけでなく、ビジネスの成長を支援し、アイデアを実現するデジタル体験を作り上げます。",
      desc3: "デジタル化を目指す小規模ビジネス、カスタムプラットフォームを必要とするスタートアップ、またはプロフェッショナルなWebプレゼンスを求めるUMKMなど、私が実現します。",
      values: [
        { title: "問題優先の思考", desc: "コードを一行も書く前に、まずあなたの課題を理解することから始めます。" },
        { title: "常に学ぶ姿勢", desc: "テクノロジーは急速に進化しています。最高のソリューションを提供するために常に鋭くあり続けます。" },
        { title: "高品質での提供", desc: "手を抜かずに迅速に提供します。細部までこだわります。" },
        { title: "真のパートナーシップ", desc: "あなたの成功は私の成功です。すべてのプロジェクトを自分自身のものとして扱います。" },
      ]
    },
    skills: {
      badge: "技術スタック",
      title1: "私が使用する",
      title2: " ツールとテクノロジー",
      desc: "最新のフレームワークからクリエイティブツール、ネットワークインフラまで、品質を提供する多用途なツールキット。",
      categories: { "All": "すべて", "Frontend": "フロントエンド", "Backend": "バックエンド", "Mobile": "モバイル", "Database": "データベース", "Networking": "ネットワーク", "Tools": "ツール" }
    },
    projects: {
      badge: "注目のプロジェクト",
      title1: "結果を出す",
      title2: " プロジェクト",
      viewProject: "プロジェクトを見る",
      sourceCode: "ソースコード",
      viewAll: "すべてのプロジェクトを見る"
    },
    experience: {
      badge: "経験",
      title1: "テクノロジー分野での",
      title2: " 私の旅",
      desc: "教育、フリーランス、インターンシップ、そして学びと創造に対する継続的な情熱。"
    },
    services: {
      badge: "サービス",
      title1: "私が",
      title2: " お手伝いできること",
      desc: "デジタル製品の構築からネットワークインフラの設定まで、企業や組織に包括的なテクノロジーソリューションを提供します。",
      items: [
        { title: "Web開発", desc: "Next.js、React、Laravel、PHPなどの最新フレームワークで構築された、モダンでレスポンシブなWebサイトとアプリケーション。", benefit: "フルスタックソリューション" },
        { title: "Android開発", desc: "FlutterとDartを使用したクロスプラットフォームモバイルアプリで、Androidデバイスにネイティブのようなスムーズな体験を提供します。", benefit: "ネイティブのようなパフォーマンス" },
        { title: "ネットワーク設定", desc: "Linux、Docker、Mikrotikを使用したネットワークインフラの設計と管理により、信頼性の高いビジネス接続を実現します。", benefit: "信頼性の高いインフラ" },
        { title: "ITコンサルティング", desc: "適切なツール、アーキテクチャ、デジタルトランスフォーメーションへの道を選択するための戦略的テクノロジーコンサルティング。", benefit: "賢明な技術の決定" },
        { title: "UI/UXデザイン", desc: "モダンな美学、スムーズなインタラクション、ピクセル単位の完璧な実装を備えたユーザー中心のインターフェースデザイン。", benefit: "素晴らしい体験" },
        { title: "デジタルメディア制作", desc: "After Effects、Photoshopなどのクリエイティブツールを使用したプロの動画編集、モーショングラフィックス、マルチメディアコンテンツ制作。", benefit: "視覚的なストーリーテリング" }
      ]
    },
    testimonials: {
      badge: "お客様の声",
      title1: "私についての",
      title2: " 人々の声"
    },
    contact: {
      badge: "お問い合わせ",
      title1: "アイデアがありますか？",
      title2: " 一緒に作りましょう。",
      desc: "ウェブサイト、カスタムウェブシステム、モバイルアプリ、ネットワーク構築、デジタルプレゼンスなど、あなたのビジョンを実現するお手伝いをします。ぜひプロジェクトについてお話ししましょう。",
      waDesc: "最速の返信 — 通常1時間以内",
      emailDesc: "より詳細なプロジェクトの概要に",
      availability: "フリーランス対応可能 — 24時間以内に返信"
    },
    certificates: {
      badge: "資格",
      titlePage: "すべての資格",
      titleHome: "作品を裏付ける",
      subtitlePage: " と証明書",
      subtitleHome: " 資格",
      descPage: "専門的な資格、認定、学術的な成果の完全なコレクション。",
      descHome: "ポートフォリオの背景にある学習、成果、専門的な証明の厳選された記録。",
      viewAll: "すべての資格を見る",
      preview: "プレビュー",
      open: "開く"
    },
    footer: {
      role: "クリエイティブ開発者 ＆\nデジタルメディアスペシャリスト",
      desc: "モダンなデジタルソリューション、Webアプリケーション、システムを構築します。バンジャルマシンを拠点とし、世界中で対応可能。",
      quickLinks: "リンク",
      connect: "つながる",
      freelance: "フリーランスのプロジェクトに対応可能。\n一緒に素晴らしいものを作りましょう。",
      rights: "全著作権所有。",
      crafted: "心を込めて"
    }
  },
  CN: {
    nav: {
      about: "关于我",
      skills: "技能",
      projects: "项目",
      experience: "经历",
      services: "服务",
      contact: "联系",
      letsTalk: "联系我们",
    },
    hero: {
      freelance: "可接受自由职业项目",
      title: "创意开发人员 &",
      role: ["Web开发者", "Android开发者", "网络管理员", "多媒体创作者", "UI/UX设计师"],
      description: "为企业和中小微企业构建现代数字解决方案、Web应用程序、多媒体体验和技术系统。",
      downloadCv: "下载简历",
      viewProjects: "查看项目",
    },
    about: {
      badge: "关于我",
      title1: "不仅仅是一名开发者。",
      title2: "您的数字合作伙伴。",
      desc1: "我是位于印度尼西亚班贾尔马辛的多学科开发者和创作者。目前在UNISKA学习信息工程，专注于构建现代Web体验、移动应用程序和管理网络基础设施。",
      desc2: "凭借涵盖全栈开发、Android开发、网络管理、视频制作和视觉设计的背景，我为每个项目带来独特的视角。我不仅仅是建立网站——我打造帮助企业成长和创意落地的数字体验。",
      desc3: "无论您是寻求数字化的寻求数字化的微小企业，需要定制平台的初创公司，还是希望获得专业Web存在的UMKM——我都在这里为您实现。",
      values: [
        { title: "问题导向思维", desc: "在编写一行代码之前，我会先了解您面临的挑战。" },
        { title: "不断学习", desc: "技术发展迅速。我保持敏锐，为您带来最好的解决方案。" },
        { title: "高质量交付", desc: "在不偷工减料的情况下快速交付。每个细节都很重要。" },
        { title: "真诚的合作伙伴关系", desc: "您的成功就是我的成功。我把每一个项目都当做自己的项目来对待。" },
      ]
    },
    skills: {
      badge: "技术栈",
      title1: "我使用的",
      title2: " 工具与技术",
      desc: "围绕交付质量构建的多功能工具包——从现代框架到创意套件和网络基础设施。",
      categories: { "All": "全部", "Frontend": "前端", "Backend": "后端", "Mobile": "移动端", "Database": "数据库", "Networking": "网络", "Tools": "工具" }
    },
    projects: {
      badge: "精选项目",
      title1: "带来成果的",
      title2: " 项目",
      viewProject: "查看项目",
      sourceCode: "源代码",
      viewAll: "查看所有项目"
    },
    experience: {
      badge: "经验",
      title1: "我在技术领域的",
      title2: " 旅程",
      desc: "教育、自由职业、实习，以及对学习和构建的持续热情。"
    },
    services: {
      badge: "服务",
      title1: "我能为",
      title2: " 您提供什么帮助",
      desc: "从构建数字产品到设置网络基础设施——我为企业和组织提供全面的技术解决方案。",
      items: [
        { title: "Web开发", desc: "使用Next.js、React、Laravel和PHP等前沿框架构建的现代、响应式网站和Web应用程序。", benefit: "全栈解决方案" },
        { title: "Android开发", desc: "使用Flutter和Dart的跨平台移动应用程序，为Android设备提供流畅的类原生体验。", benefit: "类似原生的性能" },
        { title: "网络设置", desc: "使用Linux、Docker和Mikrotik进行网络基础设施设计和管理，提供可靠的业务连接。", benefit: "可靠的基础设施" },
        { title: "IT咨询", desc: "战略技术咨询，帮助企业选择合适的工具、架构和数字化转型路径。", benefit: "明智的技术决策" },
        { title: "UI/UX设计", desc: "以用户为中心的界面设计，现代美学、流畅的交互和像素级完美的实现。", benefit: "愉悦的体验" },
        { title: "数字媒体制作", desc: "使用After Effects、Photoshop和创意工具进行专业的视频编辑、动态图形和多媒体内容创建。", benefit: "视觉叙事" }
      ]
    },
    testimonials: {
      badge: "推荐",
      title1: "人们",
      title2: " 对我的评价"
    },
    contact: {
      badge: "联系我",
      title1: "有想法吗？",
      title2: " 让我们一起实现它。",
      desc: "无论您需要网站、定制Web系统、移动应用、网络设置还是数字存在——我都准备好帮助您实现愿景。请联系我，让我们讨论您的项目。",
      waDesc: "最快回复 — 通常在1小时内",
      emailDesc: "用于更详细的项目简报",
      availability: "可接受自由职业项目 — 24小时内回复"
    },
    certificates: {
      badge: "证书",
      titlePage: "所有证书",
      titleHome: "支持作品的",
      subtitlePage: " 和资格",
      subtitleHome: " 证书",
      descPage: "专业资格、认证和学术成就的完整合集。",
      descHome: "作品集背后的学习、成就和专业证明的精选记录。",
      viewAll: "查看所有证书",
      preview: "预览",
      open: "打开"
    },
    footer: {
      role: "创意开发人员 &\n数字媒体专家",
      desc: "构建现代数字解决方案、Web应用程序和技术系统。总部位于马辰，服务全球。",
      quickLinks: "快速链接",
      connect: "联系",
      freelance: "可接受自由职业项目。\n让我们一起创造伟大的作品。",
      rights: "版权所有。",
      crafted: "精心制作"
    }
  }
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Dictionary[Language];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("EN");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("nvy-lang") as Language;
      if (saved && dictionary[saved]) {
        setLangState(saved);
      }
    } catch (e) {
      console.warn("localStorage is not available:", e);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem("nvy-lang", newLang);
    } catch (e) {
      console.warn("localStorage is not available:", e);
    }
  };

  const value = {
    lang,
    setLang,
    t: mounted ? dictionary[lang] : dictionary["EN"],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
