import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  Key,
  Copy,
  Check,
  RotateCcw,
  Download,
  Upload,
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
  Eye,
  CheckCircle2,
  Clock,
  Globe,
  Search
} from 'lucide-react';
import { usePortfolio } from './PortfolioContext';
import { PortfolioData, ExperienceItem, ProjectItem, TechCategory } from './portfolio';

export const AdminDashboard: React.FC = () => {
  const {
    data,
    updateData,
    resetData,
    isAdminOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    messages,
    markMessageRead,
    deleteMessage,
    secretUrl
  } = usePortfolio();

  // Pin authentication form
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Active tab inside CMS
  const [activeTab, setActiveTab] = useState<
    'profile' | 'about' | 'experience' | 'tech' | 'projects' | 'messages' | 'seo' | 'settings'
  >('profile');

  // Form local state copy for safe editing
  const [formData, setFormData] = useState<PortfolioData>(data);
  const [copiedLink, setCopiedLink] = useState(false);
  const [saveNotification, setSaveNotification] = useState(false);

  // Sync formData when data changes externally
  React.useEffect(() => {
    setFormData(data);
  }, [data]);

  if (!isAdminOpen) return null;

  // Handle PIN submission
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(pinInput);
    if (success) {
      setPinError('');
      setPinInput('');
    } else {
      setPinError('PIN salah! Silakan coba lagi.');
    }
  };

  // Copy secret admin link
  const handleCopySecretLink = () => {
    navigator.clipboard.writeText(secretUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Save changes to PortfolioContext & LocalStorage
  const handleSaveChanges = () => {
    updateData(formData);
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 3000);
  };

  // Export data as JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ryhar_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.profile && parsed.about && parsed.experiences) {
            setFormData(parsed);
            updateData(parsed);
            alert('Data backup berhasil diimpor!');
          } else {
            alert('Format file JSON tidak sesuai struktur portfolio.');
          }
        } catch {
          alert('Gagal membaca file JSON.');
        }
      };
    }
  };

  // ===================== LOCK SCREEN (If PIN required and not yet logged in) =====================
  if (!isAdminAuthenticated && formData.adminSettings.enablePin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <div className="w-full max-w-md rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 shadow-2xl relative">
          <button
            onClick={() => setIsAdminOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4 text-neutral-800 dark:text-neutral-200">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-black text-neutral-900 dark:text-white mb-2">
            Akses Panel Admin
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
            Dashboard ini khusus untuk mengelola konten website portofolio. Masukkan PIN keamanan untuk masuk.
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                PIN Keamanan
              </label>
              <input
                type="password"
                placeholder="Masukkan PIN..."
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
              />
              {pinError && <p className="text-xs text-rose-500 font-medium mt-1.5">{pinError}</p>}
            </div>

            <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
              <span>PIN Bawaan (Default):</span>
              <code className="font-mono font-bold text-neutral-800 dark:text-neutral-200">admin123</code>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-bold text-xs uppercase tracking-wider cursor-pointer transition-all"
            >
              Buka Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ===================== FULL ADMIN DASHBOARD =====================
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-neutral-100 dark:bg-neutral-950 overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 sm:px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center font-black text-xs">
            CMS
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-neutral-900 dark:text-white">
              Portfolio Admin Portal
            </h1>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Sesi Aktif
            </span>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Secret Link Copy Button */}
          <button
            onClick={handleCopySecretLink}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
            title="Salin Link Rahasia Dashboard"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Tersalin!' : 'Salin Link Khusus'}</span>
          </button>

          {/* Save Notification */}
          {saveNotification && (
            <span className="hidden md:flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold animate-in fade-in">
              <Check className="w-3.5 h-3.5" /> Tersimpan
            </span>
          )}

          {/* Save Button */}
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm transition-all"
          >
            Simpan Perubahan
          </button>

          {/* Close & Return to site */}
          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Tutup dan Lihat Website"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Logout */}
          <button
            onClick={logoutAdmin}
            className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            title="Keluar (Logout)"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Tabs */}
        <aside className="w-20 sm:w-60 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 flex flex-col justify-between p-3 sm:p-4 shrink-0 overflow-y-auto">
          <nav className="space-y-1.5">
            {[
              { id: 'profile', label: 'Profil & Hero', icon: User },
              { id: 'about', label: 'About & Biodata', icon: FileText },
              { id: 'experience', label: 'Pengalaman', icon: Briefcase },
              { id: 'tech', label: 'Tech Stack', icon: Layers },
              { id: 'projects', label: 'Projects / Works', icon: FolderGit2 },
              { id: 'messages', label: `Pesan Masuk (${messages.filter((m) => !m.read).length})`, icon: Mail },
              { id: 'seo', label: 'SEO & Metadata', icon: Globe },
              { id: 'settings', label: 'Link & Keamanan', icon: Settings }
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

          {/* Quick link indicator at sidebar bottom */}
          <div className="hidden sm:block p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Link Rahasia:
            </span>
            <code className="text-[11px] font-mono text-neutral-800 dark:text-neutral-200 break-all block">
              #{formData.adminSettings.secretSlug}
            </code>
          </div>
        </aside>

        {/* Tab Content Panes */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-neutral-100/60 dark:bg-neutral-950">
          <div className="max-w-4xl mx-auto pb-20">
            {/* ===================== TAB 1: PROFIL & HERO ===================== */}
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Pengaturan Profil &amp; Hero
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Sesuaikan judul nama, teks typewriter, biodata singkat, dan foto avatar profil.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Greeting */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Teks Greeting
                    </label>
                    <input
                      type="text"
                      value={formData.profile.greeting}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, greeting: e.target.value }
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm"
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Nama Panggilan (Hero)
                    </label>
                    <input
                      type="text"
                      value={formData.profile.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, name: e.target.value }
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm"
                    />
                  </div>
                </div>

                {/* Typewriter Titles */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Judul Typewriter Berputar (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={formData.profile.titles.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profile: {
                          ...formData.profile,
                          titles: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                        }
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Contoh: Frontend Developer, Fullstack Developer, Bot Specialist
                  </p>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Bio Singkat Hero
                  </label>
                  <textarea
                    rows={4}
                    value={formData.profile.bio}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profile: { ...formData.profile, bio: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm resize-none"
                  />
                </div>

                {/* Avatar Image URL */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Foto Avatar / Silhouette (URL Image)
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="text"
                      value={formData.profile.avatarUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, avatarUrl: e.target.value }
                        })
                      }
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm"
                    />
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-700 bg-black shrink-0">
                      <img
                        src={formData.profile.avatarUrl}
                        alt="Preview"
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>
                  </div>
                </div>

                {/* Stat Badges */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                    Floating Badges di Avatar
                  </label>
                  <div className="space-y-3">
                    {formData.profile.badges.map((b, idx) => (
                      <div key={b.id || idx} className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={b.text}
                          onChange={(e) => {
                            const newBadges = [...formData.profile.badges];
                            newBadges[idx].text = e.target.value;
                            setFormData({
                              ...formData,
                              profile: { ...formData.profile, badges: newBadges }
                            })
                          }}
                          className="flex-1 px-4 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">
                    Media Sosial &amp; Kontak Connect
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Instagram URL</label>
                      <input
                        type="text"
                        value={formData.profile.socialLinks.instagram}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            profile: {
                              ...formData.profile,
                              socialLinks: { ...formData.profile.socialLinks, instagram: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">GitHub URL</label>
                      <input
                        type="text"
                        value={formData.profile.socialLinks.github}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            profile: {
                              ...formData.profile,
                              socialLinks: { ...formData.profile.socialLinks, github: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">LinkedIn URL</label>
                      <input
                        type="text"
                        value={formData.profile.socialLinks.linkedin}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            profile: {
                              ...formData.profile,
                              socialLinks: { ...formData.profile.socialLinks, linkedin: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Twitter / X URL</label>
                      <input
                        type="text"
                        placeholder="https://twitter.com/username"
                        value={formData.profile.socialLinks.twitter || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            profile: {
                              ...formData.profile,
                              socialLinks: { ...formData.profile.socialLinks, twitter: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Email Publik</label>
                      <input
                        type="text"
                        value={formData.profile.socialLinks.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            profile: {
                              ...formData.profile,
                              socialLinks: { ...formData.profile.socialLinks, email: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===================== TAB 2: ABOUT & BIODATA ===================== */}
            {activeTab === 'about' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Data Diri (About Me)
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Perbarui cerita latar belakang, filosofi kerja (My Approach), dan rincian kontak biodata.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Who Am I
                    </label>
                    <textarea
                      rows={5}
                      value={formData.about.whoAmI}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          about: { ...formData.about, whoAmI: e.target.value }
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                      My Approach
                    </label>
                    <textarea
                      rows={5}
                      value={formData.about.myApproach}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          about: { ...formData.about, myApproach: e.target.value }
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm resize-none"
                    />
                  </div>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">
                    Personal Details Grid
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        value={formData.about.personalDetails.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            about: {
                              ...formData.about,
                              personalDetails: { ...formData.about.personalDetails, name: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Tempat Lahir / Lokasi</label>
                      <input
                        type="text"
                        value={formData.about.personalDetails.placeOfBirth}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            about: {
                              ...formData.about,
                              personalDetails: { ...formData.about.personalDetails, placeOfBirth: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Nomor Telepon / WhatsApp</label>
                      <input
                        type="text"
                        value={formData.about.personalDetails.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            about: {
                              ...formData.about,
                              personalDetails: { ...formData.about.personalDetails, phone: e.target.value }
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
                        value={formData.about.personalDetails.gpa}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            about: {
                              ...formData.about,
                              personalDetails: { ...formData.about.personalDetails, gpa: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Email Resmi</label>
                      <input
                        type="text"
                        value={formData.about.personalDetails.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            about: {
                              ...formData.about,
                              personalDetails: { ...formData.about.personalDetails, email: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Universitas / Pendidikan</label>
                      <input
                        type="text"
                        value={formData.about.personalDetails.education}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            about: {
                              ...formData.about,
                              personalDetails: { ...formData.about.personalDetails, education: e.target.value }
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

            {/* ===================== TAB 3: PENGALAMAN (EXPERIENCES) ===================== */}
            {activeTab === 'experience' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                      Timeline Pengalaman Kerja
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Kelola daftar milestone karir yang tampil di timeline interaktif.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newExp: ExperienceItem = {
                        id: 'exp-' + Date.now(),
                        year: '2026',
                        role: 'Fullstack Developer',
                        company: 'NAMA PERUSAHAAN / PROYEK',
                        description: 'Deskripsi singkat pekerjaan dan kontribusi yang dilakukan.',
                        skills: ['REACT', 'NODE.JS', 'TYPESCRIPT']
                      };
                      setFormData({
                        ...formData,
                        experiences: [newExp, ...formData.experiences]
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Pengalaman
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.experiences.map((exp, idx) => (
                    <div
                      key={exp.id || idx}
                      className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 relative group"
                    >
                      <button
                        onClick={() => {
                          const updated = formData.experiences.filter((_, i) => i !== idx);
                          setFormData({ ...formData, experiences: updated });
                        }}
                        className="absolute top-4 right-4 p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-10">
                        <div>
                          <label className="block text-[11px] text-neutral-400 mb-1">Tahun / Periode</label>
                          <input
                            type="text"
                            value={exp.year}
                            onChange={(e) => {
                              const updated = [...formData.experiences];
                              updated[idx].year = e.target.value;
                              setFormData({ ...formData, experiences: updated });
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
                              const updated = [...formData.experiences];
                              updated[idx].role = e.target.value;
                              setFormData({ ...formData, experiences: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-neutral-400 mb-1">Perusahaan / Platform</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const updated = [...formData.experiences];
                              updated[idx].company = e.target.value;
                              setFormData({ ...formData, experiences: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">Deskripsi Pekerjaan</label>
                        <textarea
                          rows={2}
                          value={exp.description}
                          onChange={(e) => {
                            const updated = [...formData.experiences];
                            updated[idx].description = e.target.value;
                            setFormData({ ...formData, experiences: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">
                          Skills / Tags (Pisahkan dengan koma)
                        </label>
                        <input
                          type="text"
                          value={exp.skills.join(', ')}
                          onChange={(e) => {
                            const updated = [...formData.experiences];
                            updated[idx].skills = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                            setFormData({ ...formData, experiences: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===================== TAB 4: TECH STACK ===================== */}
            {activeTab === 'tech' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Tech Stack &amp; Tools
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Kelola kategori teknologi dan daftar skill yang dikuasai.
                  </p>
                </div>

                <div className="space-y-6">
                  {formData.techStack.map((cat, cIdx) => (
                    <div
                      key={cat.id || cIdx}
                      className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-neutral-400 mb-1">Nama Kategori</label>
                          <input
                            type="text"
                            value={cat.category}
                            onChange={(e) => {
                              const updated = [...formData.techStack];
                              updated[cIdx].category = e.target.value;
                              setFormData({ ...formData, techStack: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-neutral-400 mb-1">Deskripsi Singkat</label>
                          <input
                            type="text"
                            value={cat.description}
                            onChange={(e) => {
                              const updated = [...formData.techStack];
                              updated[cIdx].description = e.target.value;
                              setFormData({ ...formData, techStack: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs"
                          />
                        </div>
                      </div>

                      {/* Items */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                            Daftar Teknologi
                          </label>
                          <button
                            onClick={() => {
                              const updated = [...formData.techStack];
                              updated[cIdx].items.push({ name: 'New Skill' });
                              setFormData({ ...formData, techStack: updated });
                            }}
                            className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Tambah Item
                          </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {cat.items.map((item, iIdx) => (
                            <div
                              key={iIdx}
                              className="flex items-center gap-2 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800"
                            >
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => {
                                  const updated = [...formData.techStack];
                                  updated[cIdx].items[iIdx].name = e.target.value;
                                  setFormData({ ...formData, techStack: updated });
                                }}
                                className="flex-1 bg-transparent text-xs font-semibold focus:outline-none"
                              />
                              <button
                                onClick={() => {
                                  const updated = [...formData.techStack];
                                  updated[cIdx].items = updated[cIdx].items.filter((_, i) => i !== iIdx);
                                  setFormData({ ...formData, techStack: updated });
                                }}
                                className="text-neutral-400 hover:text-rose-500"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===================== TAB 5: PROJECTS / WORKS ===================== */}
            {activeTab === 'projects' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                      Selected Works &amp; Projects
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Tambah karya baru, edit deskripsi, live preview URL, dan fitur-fiturnya.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newProj: ProjectItem = {
                        id: 'proj-' + Date.now(),
                        title: 'Nama Proyek Baru',
                        category: 'Web App',
                        shortDescription: 'Ringkasan singkat tentang tujuan dan fungsi aplikasi ini.',
                        fullDescription: 'Uraian mendalam tentang arsitektur, tantangan yang diselesaikan, dan dampak dari pembuatan proyek ini.',
                        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
                        tags: ['React', 'Tailwind CSS', 'TypeScript'],
                        demoUrl: 'https://example.com',
                        githubUrl: 'https://github.com',
                        features: [
                          'Fitur utama 1',
                          'Fitur utama 2'
                        ]
                      };
                      setFormData({
                        ...formData,
                        projects: [newProj, ...formData.projects]
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Proyek
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.projects.map((proj, pIdx) => (
                    <div
                      key={proj.id || pIdx}
                      className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 relative group"
                    >
                      <button
                        onClick={() => {
                          const updated = formData.projects.filter((_, i) => i !== pIdx);
                          setFormData({ ...formData, projects: updated });
                        }}
                        className="absolute top-4 right-4 p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                        title="Hapus Proyek"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pr-12">
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-neutral-400 mb-1">Judul Proyek</label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const updated = [...formData.projects];
                              updated[pIdx].title = e.target.value;
                              setFormData({ ...formData, projects: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-neutral-400 mb-1">Kategori</label>
                          <input
                            type="text"
                            value={proj.category}
                            onChange={(e) => {
                              const updated = [...formData.projects];
                              updated[pIdx].category = e.target.value;
                              setFormData({ ...formData, projects: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-neutral-400 mb-1">Deskripsi Singkat (Card)</label>
                          <textarea
                            rows={3}
                            value={proj.shortDescription}
                            onChange={(e) => {
                              const updated = [...formData.projects];
                              updated[pIdx].shortDescription = e.target.value;
                              setFormData({ ...formData, projects: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-neutral-400 mb-1">Deskripsi Lengkap (Modal View Details)</label>
                          <textarea
                            rows={3}
                            value={proj.fullDescription}
                            onChange={(e) => {
                              const updated = [...formData.projects];
                              updated[pIdx].fullDescription = e.target.value;
                              setFormData({ ...formData, projects: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs resize-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] text-neutral-400 mb-1">URL Gambar / Screenshot</label>
                          <input
                            type="text"
                            value={proj.image}
                            onChange={(e) => {
                              const updated = [...formData.projects];
                              updated[pIdx].image = e.target.value;
                              setFormData({ ...formData, projects: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-neutral-400 mb-1">Live Demo URL</label>
                          <input
                            type="text"
                            value={proj.demoUrl || ''}
                            onChange={(e) => {
                              const updated = [...formData.projects];
                              updated[pIdx].demoUrl = e.target.value;
                              setFormData({ ...formData, projects: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-neutral-400 mb-1">GitHub Repository URL</label>
                          <input
                            type="text"
                            value={proj.githubUrl || ''}
                            onChange={(e) => {
                              const updated = [...formData.projects];
                              updated[pIdx].githubUrl = e.target.value;
                              setFormData({ ...formData, projects: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">
                          Tags Teknologi (Pisahkan dengan koma)
                        </label>
                        <input
                          type="text"
                          value={proj.tags.join(', ')}
                          onChange={(e) => {
                            const updated = [...formData.projects];
                            updated[pIdx].tags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                            setFormData({ ...formData, projects: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===================== TAB 6: PESAN MASUK (INBOX) ===================== */}
            {activeTab === 'messages' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Pesan Masuk Pengunjung ({messages.length})
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Pesan yang dikirimkan klien/pengunjung melalui formulir &quot;Contact Me&quot;.
                  </p>
                </div>

                {messages.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800">
                    <Mail className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-neutral-500">Belum ada pesan masuk.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-6 rounded-2xl border transition-all ${
                          msg.read
                            ? 'bg-white dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800'
                            : 'bg-white dark:bg-neutral-900 border-neutral-900 dark:border-white/50 shadow-md'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                              {msg.name}
                            </h3>
                            <span className="text-xs text-neutral-400">({msg.email})</span>
                            {!msg.read && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase">
                                Baru
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-neutral-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(msg.date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4 bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl font-normal">
                          {msg.message}
                        </p>

                        <div className="flex items-center gap-3">
                          <a
                            href={`mailto:${msg.email}?subject=Balasan Portofolio RyHar`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold"
                          >
                            <Mail className="w-3.5 h-3.5" /> Balas Email
                          </a>

                          {!msg.read && (
                            <button
                              onClick={() => markMessageRead(msg.id)}
                              className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                              Tandai Sudah Dibaca
                            </button>
                          )}

                          <button
                            onClick={() => deleteMessage(msg.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 ml-auto"
                            title="Hapus Pesan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===================== TAB: SEO & METADATA ===================== */}
            {activeTab === 'seo' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                      SEO &amp; Social Sharing Metadata
                    </h2>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Konfigurasi meta description, keywords, dan og:image untuk meningkatkan visibilitas di Google Search dan tampilan kartu pratinjau media sosial.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Meta Page Title */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                        Meta Page Title (&lt;title&gt; &amp; og:title)
                      </label>
                      <span className={`text-[11px] font-mono font-bold ${
                        (formData.seo?.metaTitle?.length || 0) >= 30 && (formData.seo?.metaTitle?.length || 0) <= 60
                          ? 'text-emerald-500'
                          : 'text-neutral-400'
                      }`}>
                        {formData.seo?.metaTitle?.length || 0} / 60 karakter
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="Nama – Profesi & Keahlian Utama"
                      value={formData.seo?.metaTitle || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seo: {
                            ...(formData.seo || { metaTitle: '', metaDescription: '', keywords: '', ogImage: '', author: '' }),
                            metaTitle: e.target.value
                          }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm font-semibold"
                    />
                  </div>

                  {/* Meta Description */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                        Meta Description (&lt;meta name=&quot;description&quot;&gt;)
                      </label>
                      <span className={`text-[11px] font-mono font-bold ${
                        (formData.seo?.metaDescription?.length || 0) >= 120 && (formData.seo?.metaDescription?.length || 0) <= 160
                          ? 'text-emerald-500'
                          : 'text-amber-500'
                      }`}>
                        {formData.seo?.metaDescription?.length || 0} / 160 karakter
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      placeholder="Ringkasan informatif 1-2 kalimat untuk hasil pencarian Google..."
                      value={formData.seo?.metaDescription || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seo: {
                            ...(formData.seo || { metaTitle: '', metaDescription: '', keywords: '', ogImage: '', author: '' }),
                            metaDescription: e.target.value
                          }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm resize-none"
                    />
                  </div>

                  {/* Keywords */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 block">
                      Target Keywords / Kata Kunci (Pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      placeholder="Fullstack Developer, React, Next.js, Node.js, Palembang"
                      value={formData.seo?.keywords || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seo: {
                            ...(formData.seo || { metaTitle: '', metaDescription: '', keywords: '', ogImage: '', author: '' }),
                            keywords: e.target.value
                          }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm"
                    />
                  </div>

                  {/* OG Image */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 block">
                      OpenGraph Image URL (og:image &amp; twitter:image)
                    </label>
                    <div className="flex flex-wrap gap-3 items-center">
                      <input
                        type="text"
                        placeholder="/profile.jpg atau URL gambar https://..."
                        value={formData.seo?.ogImage || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            seo: {
                              ...(formData.seo || { metaTitle: '', metaDescription: '', keywords: '', ogImage: '', author: '' }),
                              ogImage: e.target.value
                            }
                          })
                        }
                        className="flex-1 px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm font-mono"
                      />
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            seo: {
                              ...(formData.seo || { metaTitle: '', metaDescription: '', keywords: '', ogImage: '', author: '' }),
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
                </div>

                {/* Live Google & Social Preview */}
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 space-y-4">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Pratinjau di Google Search
                  </h3>
                  <div className="p-4 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 max-w-xl shadow-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                        {formData.about.personalDetails.name || 'RyHar'}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {formData.seo?.canonicalUrl || 'https://ryhar.dev'}
                      </span>
                    </div>
                    <h4 className="text-base font-medium text-blue-700 dark:text-blue-400 hover:underline line-clamp-1 mb-1">
                      {formData.seo?.metaTitle || `${formData.about.personalDetails.name} – Fullstack Web Developer`}
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {formData.seo?.metaDescription || formData.profile.bio}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ===================== TAB 7: SETTINGS & LINK RAHASIA ===================== */}
            {activeTab === 'settings' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Link Khusus &amp; Keamanan Admin
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Atur URL link rahasia untuk membuka dashboard ini dan PIN password proteksi.
                  </p>
                </div>

                {/* Secret Link Configuration */}
                <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-500" />
                    Slug URL Akses Khusus
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Website ini dapat membuka admin panel secara otomatis ketika URL hash cocok. Contoh: jika slug adalah{' '}
                    <code className="text-xs font-bold text-neutral-800 dark:text-neutral-200">admin</code>, Anda dapat
                    mengaksesnya lewat <code className="text-xs font-bold">#admin</code>.
                  </p>

                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-neutral-400 font-mono">#</span>
                    <input
                      type="text"
                      value={formData.adminSettings.secretSlug}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          adminSettings: {
                            ...formData.adminSettings,
                            secretSlug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '')
                          }
                        })
                      }
                      className="w-64 px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm font-mono font-bold"
                    />
                    <button
                      onClick={handleCopySecretLink}
                      className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-xs font-bold flex items-center gap-1.5"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      Salin URL Lengkap
                    </button>
                  </div>
                </div>

                {/* PIN Code Configuration */}
                <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-500" />
                    PIN Keamanan
                  </h3>

                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      id="enablePin"
                      checked={formData.adminSettings.enablePin}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          adminSettings: {
                            ...formData.adminSettings,
                            enablePin: e.target.checked
                          }
                        })
                      }
                      className="w-4 h-4 accent-neutral-900"
                    />
                    <label htmlFor="enablePin" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Wajibkan memasukkan PIN saat mengakses dashboard
                    </label>
                  </div>

                  {formData.adminSettings.enablePin && (
                    <div className="w-64">
                      <label className="block text-xs text-neutral-400 mb-1">Ubah PIN (saat ini)</label>
                      <input
                        type="text"
                        value={formData.adminSettings.pinCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            adminSettings: {
                              ...formData.adminSettings,
                              pinCode: e.target.value
                            }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm font-mono font-bold"
                      />
                    </div>
                  )}
                </div>

                {/* Backup & Restore */}
                <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Backup &amp; Restore Data
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Unduh file JSON konfigurasi website portofolio Anda sebagai cadangan, atau unggah cadangan yang sudah ada.
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleExportJSON}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 text-xs font-bold"
                    >
                      <Download className="w-4 h-4" /> Ekspor Backup JSON
                    </button>

                    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 text-xs font-bold cursor-pointer">
                      <Upload className="w-4 h-4" /> Impor Backup JSON
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportJSON}
                        className="hidden"
                      />
                    </label>

                    <button
                      onClick={() => {
                        if (confirm('Apakah Anda yakin ingin mengembalikan seluruh data website ke pengaturan awal bawaan video RyHar?')) {
                          resetData();
                          alert('Data berhasil di-reset ke bawaan demo!');
                        }
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold ml-auto"
                    >
                      <RotateCcw className="w-4 h-4" /> Reset ke Bawaan (Default)
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
