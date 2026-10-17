import React, { useState, useEffect } from 'react';
import {
  Lock,
  User,
  FileText,
  Briefcase,
  Layers,
  FolderGit2,
  Mail,
  Settings,
  Plus,
  Trash2,
  ExternalLink,
  Check,
  Download,
  Upload,
  RotateCcw,
  Sun,
  Moon,
  Clock,
  Eye,
  LogOut,
  ShieldCheck,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Search,
  Globe
} from 'lucide-react';
import { defaultPortfolioData } from './defaultPortfolio';
import { PortfolioData, ContactMessage, ExperienceItem, ProjectItem } from './portfolio';

const STORAGE_KEY = 'ryhar_portfolio_data_v1';
const MESSAGES_KEY = 'ryhar_portfolio_messages_v1';
const ADMIN_AUTH_KEY = 'ryhar_admin_standalone_auth';
const THEME_KEY = 'ryhar_portfolio_theme';

export const AdminApp: React.FC = () => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === 'dark' ? 'dark' : 'light';
  });

  // Data state
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return defaultPortfolioData;
  });

  // Messages state
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem(MESSAGES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Active tab
  const [activeTab, setActiveTab] = useState<
    'profile' | 'about' | 'experience' | 'tech' | 'projects' | 'messages' | 'seo' | 'settings'
  >('profile');

  const [saveToast, setSaveToast] = useState(false);

  // Sync theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.adminSettings.enablePin || pinInput === data.adminSettings.pinCode) {
      setIsAuthenticated(true);
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      setPinError('');
    } else {
      setPinError('PIN salah! Silakan coba lagi.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ryhar_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.profile && parsed.about && parsed.experiences) {
            setData(parsed);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
            alert('Data backup berhasil diimpor!');
          } else {
            alert('Format JSON tidak sesuai struktur portfolio.');
          }
        } catch {
          alert('Gagal membaca file JSON.');
        }
      };
    }
  };

  const handleReset = () => {
    if (confirm('Kembalikan semua data ke pengaturan awal (default)?')) {
      setData(defaultPortfolioData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPortfolioData));
      alert('Data telah direset.');
    }
  };

  const deleteMessage = (id: string) => {
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
  };

  const markMessageRead = (id: string) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, read: true } : m));
    setMessages(updated);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
  };

  // ===================== LOCK SCREEN =====================
  if (!isAuthenticated && data.adminSettings.enablePin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-100 dark:bg-neutral-950">
        <div className="w-full max-w-md rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 sm:p-10 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <h1 className="text-2xl font-black text-neutral-900 dark:text-white mb-2">
            Admin Control Center
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
            Halaman khusus admin (terpisah dari web utama). Masukkan PIN untuk mengelola konten portfolio.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                PIN Akses
              </label>
              <input
                type="password"
                placeholder="Masukkan PIN..."
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
              />
              {pinError && <p className="text-xs text-rose-500 font-semibold mt-1.5">{pinError}</p>}
            </div>

            <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
              <span>PIN Bawaan (Default):</span>
              <code className="font-mono font-bold text-neutral-900 dark:text-white">admin123</code>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer transition-all"
            >
              Masuk Dashboard
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-center">
            <a
              href="/"
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              ← Kembali ke Website Utama
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ===================== ADMIN DASHBOARD INTERFACE =====================
  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans">
      {/* Top Header */}
      <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center font-black text-xs">
            CMS
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold leading-tight">
              RyHar Admin Dashboard
            </h1>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
              Halaman Khusus (admin.html)
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {saveToast && (
            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold animate-in fade-in">
              <Check className="w-3.5 h-3.5" /> Tersimpan!
            </span>
          )}

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm transition-all"
          >
            Simpan Perubahan
          </button>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold cursor-pointer transition-colors"
            title="Lihat Website Utama di Tab Baru"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lihat Web</span>
          </a>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
            title="Ganti Tema"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
            title="Keluar (Logout)"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Tabs */}
        <aside className="w-20 sm:w-60 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-3 sm:p-4 shrink-0 flex flex-col justify-between">
          <nav className="space-y-1.5">
            {[
              { id: 'profile', label: 'Profil & Hero', icon: User },
              { id: 'about', label: 'About & Biodata', icon: FileText },
              { id: 'experience', label: 'Pengalaman', icon: Briefcase },
              { id: 'tech', label: 'Tech Stack', icon: Layers },
              { id: 'projects', label: 'Projects / Works', icon: FolderGit2 },
              { id: 'messages', label: `Pesan Masuk (${messages.filter((m) => !m.read).length})`, icon: Mail },
              { id: 'seo', label: 'SEO & Metadata', icon: Globe },
              { id: 'settings', label: 'Pengaturan & Backup', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="hidden sm:block p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 text-[11px] text-neutral-400">
            <span className="block font-bold text-neutral-700 dark:text-neutral-300 mb-0.5">
              File Foto JPG:
            </span>
            <code className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 break-all">
              /public/profile.jpg
            </code>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-4xl mx-auto pb-20">
            {/* TAB 1: PROFILE & HERO */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  <h2 className="text-xl font-bold">Profil &amp; Hero</h2>
                  <p className="text-xs text-neutral-500">
                    Atur nama tampilan, variasi ketikan typewriter, bio, dan foto profil.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      Teks Greeting
                    </label>
                    <input
                      type="text"
                      value={data.profile.greeting}
                      onChange={(e) =>
                        setData({
                          ...data,
                          profile: { ...data.profile, greeting: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      Nama Panggilan (Hero)
                    </label>
                    <input
                      type="text"
                      value={data.profile.name}
                      onChange={(e) =>
                        setData({
                          ...data,
                          profile: { ...data.profile, name: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Judul Typewriter Berputar (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={data.profile.titles.join(', ')}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: {
                          ...data.profile,
                          titles: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                        }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Bio Singkat Hero
                  </label>
                  <textarea
                    rows={4}
                    value={data.profile.bio}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: { ...data.profile, bio: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm resize-none"
                  />
                </div>

                {/* Profile Photo JPG setting */}
                <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
                    File Foto Profil (JPG)
                  </label>
                  <p className="text-xs text-neutral-500">
                    File foto disimpan lokal di <code className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">/public/profile.jpg</code>. Anda juga bisa mengganti URL gambar lain jika diinginkan.
                  </p>
                  <div className="flex gap-4 items-center">
                    <input
                      type="text"
                      value={data.profile.avatarUrl}
                      onChange={(e) =>
                        setData({
                          ...data,
                          profile: { ...data.profile, avatarUrl: e.target.value }
                        })
                      }
                      className="flex-1 px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm font-mono"
                    />
                    <button
                      onClick={() =>
                        setData({
                          ...data,
                          profile: { ...data.profile, avatarUrl: '/profile.jpg' }
                        })
                      }
                      className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      Pakai /profile.jpg
                    </button>
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-700 bg-black shrink-0">
                      <img
                        src={data.profile.avatarUrl}
                        alt="Preview"
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                    Floating Badges Avatar
                  </label>
                  <div className="space-y-2">
                    {data.profile.badges.map((b, idx) => (
                      <div key={b.id || idx} className="flex gap-2">
                        <input
                          type="text"
                          value={b.text}
                          onChange={(e) => {
                            const newBadges = [...data.profile.badges];
                            newBadges[idx].text = e.target.value;
                            setData({
                              ...data,
                              profile: { ...data.profile, badges: newBadges }
                            });
                          }}
                          className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Media Links (LinkedIn, GitHub, Twitter, etc.) */}
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      Social Media Links (LinkedIn, GitHub, Twitter)
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Tautan profil sosial media ini akan otomatis dirender di bagian Footer website utama dan tombol Connect di Hero.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* LinkedIn */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
                      <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                        <Linkedin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>LinkedIn URL</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        value={data.profile.socialLinks?.linkedin || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            profile: {
                              ...data.profile,
                              socialLinks: {
                                ...data.profile.socialLinks,
                                linkedin: e.target.value
                              }
                            }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono"
                      />
                    </div>

                    {/* GitHub */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
                      <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                        <Github className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
                        <span>GitHub URL</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/username"
                        value={data.profile.socialLinks?.github || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            profile: {
                              ...data.profile,
                              socialLinks: {
                                ...data.profile.socialLinks,
                                github: e.target.value
                              }
                            }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono"
                      />
                    </div>

                    {/* Twitter / X */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
                      <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                        <Twitter className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                        <span>Twitter / X URL</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://twitter.com/username atau https://x.com/username"
                        value={data.profile.socialLinks?.twitter || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            profile: {
                              ...data.profile,
                              socialLinks: {
                                ...data.profile.socialLinks,
                                twitter: e.target.value
                              }
                            }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono"
                      />
                    </div>

                    {/* Instagram */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
                      <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                        <Instagram className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                        <span>Instagram URL</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://instagram.com/username"
                        value={data.profile.socialLinks?.instagram || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            profile: {
                              ...data.profile,
                              socialLinks: {
                                ...data.profile.socialLinks,
                                instagram: e.target.value
                              }
                            }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono"
                      />
                    </div>

                    {/* Email */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-amber-500" />
                        <span>Email Publik</span>
                      </label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={data.profile.socialLinks?.email || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            profile: {
                              ...data.profile,
                              socialLinks: {
                                ...data.profile.socialLinks,
                                email: e.target.value
                              }
                            }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ABOUT */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  <h2 className="text-xl font-bold">About &amp; Biodata</h2>
                  <p className="text-xs text-neutral-500">
                    Kelola cerita Who Am I, pendekatan koding, dan rincian kontak.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">Who Am I</label>
                    <textarea
                      rows={5}
                      value={data.about.whoAmI}
                      onChange={(e) =>
                        setData({
                          ...data,
                          about: { ...data.about, whoAmI: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">My Approach</label>
                    <textarea
                      rows={5}
                      value={data.about.myApproach}
                      onChange={(e) =>
                        setData({
                          ...data,
                          about: { ...data.about, myApproach: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm resize-none"
                    />
                  </div>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
                  <h3 className="text-sm font-bold mb-4">Personal Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        value={data.about.personalDetails.name}
                        onChange={(e) =>
                          setData({
                            ...data,
                            about: {
                              ...data.about,
                              personalDetails: { ...data.about.personalDetails, name: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Tempat Lahir</label>
                      <input
                        type="text"
                        value={data.about.personalDetails.placeOfBirth}
                        onChange={(e) =>
                          setData({
                            ...data,
                            about: {
                              ...data.about,
                              personalDetails: { ...data.about.personalDetails, placeOfBirth: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Telepon / WhatsApp</label>
                      <input
                        type="text"
                        value={data.about.personalDetails.phone}
                        onChange={(e) =>
                          setData({
                            ...data,
                            about: {
                              ...data.about,
                              personalDetails: { ...data.about.personalDetails, phone: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">IPK / GPA</label>
                      <input
                        type="text"
                        value={data.about.personalDetails.gpa}
                        onChange={(e) =>
                          setData({
                            ...data,
                            about: {
                              ...data.about,
                              personalDetails: { ...data.about.personalDetails, gpa: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Email</label>
                      <input
                        type="text"
                        value={data.about.personalDetails.email}
                        onChange={(e) =>
                          setData({
                            ...data,
                            about: {
                              ...data.about,
                              personalDetails: { ...data.about.personalDetails, email: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Pendidikan</label>
                      <input
                        type="text"
                        value={data.about.personalDetails.education}
                        onChange={(e) =>
                          setData({
                            ...data,
                            about: {
                              ...data.about,
                              personalDetails: { ...data.about.personalDetails, education: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: EXPERIENCE */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold">Pengalaman Kerja</h2>
                    <p className="text-xs text-neutral-500">Timeline karir di website.</p>
                  </div>
                  <button
                    onClick={() => {
                      const newExp: ExperienceItem = {
                        id: 'exp-' + Date.now(),
                        year: '2026',
                        role: 'Fullstack Developer',
                        company: 'PERUSAHAAN / PROYEK BARU',
                        description: 'Deskripsi singkat pekerjaan dan kontribusi.',
                        skills: ['NEXT.JS', 'NODE.JS', 'TAILWIND CSS']
                      };
                      setData({ ...data, experiences: [newExp, ...data.experiences] });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Pengalaman
                  </button>
                </div>

                <div className="space-y-4">
                  {data.experiences.map((exp, idx) => (
                    <div
                      key={exp.id || idx}
                      className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 relative"
                    >
                      <button
                        onClick={() => {
                          setData({
                            ...data,
                            experiences: data.experiences.filter((_, i) => i !== idx)
                          });
                        }}
                        className="absolute top-4 right-4 p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-10">
                        <div>
                          <label className="block text-[11px] text-neutral-400 mb-1">Tahun</label>
                          <input
                            type="text"
                            value={exp.year}
                            onChange={(e) => {
                              const updated = [...data.experiences];
                              updated[idx].year = e.target.value;
                              setData({ ...data, experiences: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-neutral-400 mb-1">Posisi / Role</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => {
                              const updated = [...data.experiences];
                              updated[idx].role = e.target.value;
                              setData({ ...data, experiences: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-neutral-400 mb-1">Perusahaan</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const updated = [...data.experiences];
                              updated[idx].company = e.target.value;
                              setData({ ...data, experiences: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">Deskripsi</label>
                        <textarea
                          rows={2}
                          value={exp.description}
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[idx].description = e.target.value;
                            setData({ ...data, experiences: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">Skills Tags</label>
                        <input
                          type="text"
                          value={exp.skills.join(', ')}
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[idx].skills = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                            setData({ ...data, experiences: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: TECH STACK */}
            {activeTab === 'tech' && (
              <div className="space-y-6">
                <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  <h2 className="text-xl font-bold">Tech Stack</h2>
                  <p className="text-xs text-neutral-500">Kelola kategori dan teknologi.</p>
                </div>

                <div className="space-y-6">
                  {data.techStack.map((cat, cIdx) => (
                    <div
                      key={cat.id || cIdx}
                      className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={cat.category}
                          onChange={(e) => {
                            const updated = [...data.techStack];
                            updated[cIdx].category = e.target.value;
                            setData({ ...data, techStack: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm font-bold"
                        />
                        <input
                          type="text"
                          value={cat.description}
                          onChange={(e) => {
                            const updated = [...data.techStack];
                            updated[cIdx].description = e.target.value;
                            setData({ ...data, techStack: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                        {cat.items.map((item, iIdx) => (
                          <div
                            key={iIdx}
                            className="flex items-center gap-2 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800"
                          >
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => {
                                const updated = [...data.techStack];
                                updated[cIdx].items[iIdx].name = e.target.value;
                                setData({ ...data, techStack: updated });
                              }}
                              className="flex-1 bg-transparent text-xs font-semibold focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                const updated = [...data.techStack];
                                updated[cIdx].items = updated[cIdx].items.filter((_, i) => i !== iIdx);
                                setData({ ...data, techStack: updated });
                              }}
                              className="text-neutral-400 hover:text-rose-500"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold">Selected Works / Projects</h2>
                    <p className="text-xs text-neutral-500">Kelola portofolio karya.</p>
                  </div>
                  <button
                    onClick={() => {
                      const newProj: ProjectItem = {
                        id: 'proj-' + Date.now(),
                        title: 'Proyek Baru',
                        category: 'Web App',
                        shortDescription: 'Deskripsi ringkas proyek.',
                        fullDescription: 'Deskripsi lengkap proyek.',
                        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
                        tags: ['React', 'TypeScript', 'Tailwind CSS'],
                        demoUrl: 'https://example.com',
                        githubUrl: 'https://github.com'
                      };
                      setData({ ...data, projects: [newProj, ...data.projects] });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Proyek
                  </button>
                </div>

                <div className="space-y-5">
                  {data.projects.map((proj, pIdx) => (
                    <div
                      key={proj.id || pIdx}
                      className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 relative"
                    >
                      <button
                        onClick={() => {
                          setData({
                            ...data,
                            projects: data.projects.filter((_, i) => i !== pIdx)
                          });
                        }}
                        className="absolute top-4 right-4 p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-10">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] text-neutral-400 mb-1">Judul</label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const updated = [...data.projects];
                              updated[pIdx].title = e.target.value;
                              setData({ ...data, projects: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-neutral-400 mb-1">Kategori</label>
                          <input
                            type="text"
                            value={proj.category}
                            onChange={(e) => {
                              const updated = [...data.projects];
                              updated[pIdx].category = e.target.value;
                              setData({ ...data, projects: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">Deskripsi Singkat</label>
                        <textarea
                          rows={2}
                          value={proj.shortDescription}
                          onChange={(e) => {
                            const updated = [...data.projects];
                            updated[pIdx].shortDescription = e.target.value;
                            setData({ ...data, projects: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={proj.image}
                          onChange={(e) => {
                            const updated = [...data.projects];
                            updated[pIdx].image = e.target.value;
                            setData({ ...data, projects: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Demo URL"
                          value={proj.demoUrl || ''}
                          onChange={(e) => {
                            const updated = [...data.projects];
                            updated[pIdx].demoUrl = e.target.value;
                            setData({ ...data, projects: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="GitHub URL"
                          value={proj.githubUrl || ''}
                          onChange={(e) => {
                            const updated = [...data.projects];
                            updated[pIdx].githubUrl = e.target.value;
                            setData({ ...data, projects: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: INBOX */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  <h2 className="text-xl font-bold">Pesan Masuk ({messages.length})</h2>
                  <p className="text-xs text-neutral-500">
                    Pesan pengunjung dari formulir Contact Me di website.
                  </p>
                </div>

                {messages.length === 0 ? (
                  <div className="p-12 text-center bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-neutral-400 text-sm">
                    Belum ada pesan masuk.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">{m.name}</span>
                            <span className="text-xs text-neutral-400">({m.email})</span>
                          </div>
                          <span className="text-xs text-neutral-400">
                            {new Date(m.date).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-950 p-3 rounded-xl">
                          {m.message}
                        </p>
                        <div className="flex gap-2 pt-1">
                          <a
                            href={`mailto:${m.email}`}
                            className="px-3 py-1 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold"
                          >
                            Balas
                          </a>
                          <button
                            onClick={() => deleteMessage(m.id)}
                            className="px-3 py-1 rounded-lg text-rose-500 hover:bg-rose-50 text-xs font-semibold ml-auto"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: SEO & METADATA */}
            {activeTab === 'seo' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
                    <h2 className="text-xl font-bold">SEO &amp; Social Sharing Metadata</h2>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Konfigurasi meta description, keywords, dan og:image untuk meningkatkan visibilitas di Google Search dan tampilan pratinjau saat link dibagikan di media sosial.
                  </p>
                </div>

                {/* Form Inputs Grid */}
                <div className="space-y-6">
                  {/* Meta Page Title */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                        Meta Page Title (&lt;title&gt; &amp; og:title)
                      </label>
                      <span className={`text-[11px] font-mono font-bold ${
                        (data.seo?.metaTitle?.length || 0) >= 30 && (data.seo?.metaTitle?.length || 0) <= 60
                          ? 'text-emerald-500'
                          : 'text-neutral-400'
                      }`}>
                        {data.seo?.metaTitle?.length || 0} / 60 karakter (ideal 30-60)
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="Nama Lengkap – Profesi & Keahlian Utama"
                      value={data.seo?.metaTitle || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          seo: {
                            ...(data.seo || defaultPortfolioData.seo),
                            metaTitle: e.target.value
                          }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm font-semibold"
                    />
                    <p className="text-[11px] text-neutral-400">
                      Judul yang tampil di tab browser dan judul utama hasil pencarian Google.
                    </p>
                  </div>

                  {/* Meta Description */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                        Meta Description (&lt;meta name=&quot;description&quot;&gt;)
                      </label>
                      <span className={`text-[11px] font-mono font-bold ${
                        (data.seo?.metaDescription?.length || 0) >= 120 && (data.seo?.metaDescription?.length || 0) <= 160
                          ? 'text-emerald-500'
                          : 'text-amber-500'
                      }`}>
                        {data.seo?.metaDescription?.length || 0} / 160 karakter (ideal 120-160)
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      placeholder="Ringkasan informatif 1-2 kalimat tentang profil, skill, dan keahlian untuk hasil pencarian Google..."
                      value={data.seo?.metaDescription || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          seo: {
                            ...(data.seo || defaultPortfolioData.seo),
                            metaDescription: e.target.value
                          }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm resize-none"
                    />
                    <p className="text-[11px] text-neutral-400">
                      Deskripsi ini akan dikutip Google di bawah tautan situs pada halaman hasil pencarian.
                    </p>
                  </div>

                  {/* Keywords */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 block">
                      Target Keywords / Kata Kunci (Pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      placeholder="Web Developer, React, Next.js, Node.js, Palembang, Fullstack"
                      value={data.seo?.keywords || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          seo: {
                            ...(data.seo || defaultPortfolioData.seo),
                            keywords: e.target.value
                          }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm"
                    />

                    {/* Keywords pills preview */}
                    {data.seo?.keywords && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {data.seo.keywords.split(',').map((k, idx) => {
                          const tag = k.trim();
                          if (!tag) return null;
                          return (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[11px] font-semibold"
                            >
                              #{tag}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* OG:IMAGE & Social Card Banner */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 block">
                      OpenGraph Image URL (og:image &amp; twitter:image)
                    </label>
                    <p className="text-xs text-neutral-500">
                      Gambar yang muncul otomatis saat link website Anda dibagikan di WhatsApp, LinkedIn, Twitter/X, Discord, atau Telegram.
                    </p>

                    <div className="flex flex-wrap gap-3 items-center">
                      <input
                        type="text"
                        placeholder="/profile.jpg atau URL gambar https://..."
                        value={data.seo?.ogImage || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            seo: {
                              ...(data.seo || defaultPortfolioData.seo),
                              ogImage: e.target.value
                            }
                          })
                        }
                        className="flex-1 px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm font-mono"
                      />
                      <button
                        onClick={() =>
                          setData({
                            ...data,
                            seo: {
                              ...(data.seo || defaultPortfolioData.seo),
                              ogImage: '/profile.jpg'
                            }
                          })
                        }
                        className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        Gunakan /profile.jpg
                      </button>
                    </div>
                  </div>

                  {/* Canonical URL & Author */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                      <label className="text-xs font-bold text-neutral-500 mb-1 block">
                        Canonical URL (Opsional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://domain-anda.com"
                        value={data.seo?.canonicalUrl || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            seo: {
                              ...(data.seo || defaultPortfolioData.seo),
                              canonicalUrl: e.target.value
                            }
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono"
                      />
                    </div>
                    <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                      <label className="text-xs font-bold text-neutral-500 mb-1 block">
                        Meta Author
                      </label>
                      <input
                        type="text"
                        value={data.seo?.author || data.about.personalDetails.name}
                        onChange={(e) =>
                          setData({
                            ...data,
                            seo: {
                              ...(data.seo || defaultPortfolioData.seo),
                              author: e.target.value
                            }
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* ===================== LIVE PREVIEWS ===================== */}
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 space-y-6">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Pratinjau Hasil Pencarian &amp; Kartu Media Sosial
                  </h3>

                  {/* 1. Google Search Result Snippet Preview */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                      Pratinjau di Google Search
                    </span>

                    <div className="p-4 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 max-w-xl shadow-xs">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-[10px]">
                          R
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 font-sans">
                          <span className="font-semibold text-neutral-900 dark:text-neutral-200">
                            {data.about.personalDetails.name || 'RyHar'}
                          </span>
                          <span className="text-neutral-400 ml-1">
                            {data.seo?.canonicalUrl || 'https://ryhar.dev'}
                          </span>
                        </div>
                      </div>

                      <h4 className="text-base font-medium text-blue-700 dark:text-blue-400 hover:underline cursor-pointer line-clamp-1 mb-1">
                        {data.seo?.metaTitle || `${data.about.personalDetails.name} – Fullstack Web Developer`}
                      </h4>

                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-2">
                        {data.seo?.metaDescription || data.profile.bio}
                      </p>
                    </div>
                  </div>

                  {/* 2. Social Card (OpenGraph / Twitter) Preview */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                      Pratinjau Kartu Berbagi Media Sosial (OpenGraph / Twitter Card)
                    </span>

                    <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 max-w-md bg-neutral-50 dark:bg-neutral-950 shadow-md">
                      <div className="w-full h-48 bg-neutral-900 overflow-hidden relative">
                        <img
                          src={data.seo?.ogImage || data.profile.avatarUrl || '/profile.jpg'}
                          alt="Social card preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="p-4 space-y-1">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">
                          {data.seo?.canonicalUrl ? new URL(data.seo.canonicalUrl).hostname.toUpperCase() : 'PORTFOLIO.DEV'}
                        </span>
                        <h5 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-1">
                          {data.seo?.metaTitle || `${data.about.personalDetails.name} – Fullstack Developer`}
                        </h5>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                          {data.seo?.metaDescription || data.profile.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: SETTINGS & BACKUP */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  <h2 className="text-xl font-bold">Keamanan &amp; Backup</h2>
                  <p className="text-xs text-neutral-500">
                    Pengaturan PIN proteksi, unduh cadangan JSON, atau reset data.
                  </p>
                </div>

                {/* PIN Configuration */}
                <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
                  <h3 className="text-sm font-bold">PIN Proteksi Halaman Admin</h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="enablePinAdmin"
                      checked={data.adminSettings.enablePin}
                      onChange={(e) =>
                        setData({
                          ...data,
                          adminSettings: { ...data.adminSettings, enablePin: e.target.checked }
                        })
                      }
                      className="w-4 h-4 accent-neutral-900"
                    />
                    <label htmlFor="enablePinAdmin" className="text-xs font-semibold">
                      Wajibkan memasukkan PIN saat membuka admin.html
                    </label>
                  </div>

                  {data.adminSettings.enablePin && (
                    <div className="w-56">
                      <label className="block text-xs text-neutral-400 mb-1">Ganti PIN</label>
                      <input
                        type="text"
                        value={data.adminSettings.pinCode}
                        onChange={(e) =>
                          setData({
                            ...data,
                            adminSettings: { ...data.adminSettings, pinCode: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm font-mono font-bold"
                      />
                    </div>
                  )}
                </div>

                {/* Backup & Restore */}
                <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
                  <h3 className="text-sm font-bold">Backup &amp; Restore Data</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleExportJSON}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-bold"
                    >
                      <Download className="w-4 h-4" /> Ekspor Backup JSON
                    </button>

                    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-bold cursor-pointer">
                      <Upload className="w-4 h-4" /> Impor Backup JSON
                      <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                    </label>

                    <button
                      onClick={handleReset}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-bold ml-auto"
                    >
                      <RotateCcw className="w-4 h-4" /> Reset ke Bawaan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
