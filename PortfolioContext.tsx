import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioData, ContactMessage, ProjectItem } from './portfolio';
import { defaultPortfolioData } from './defaultPortfolio';

interface PortfolioContextType {
  data: PortfolioData;
  updateData: (newData: PortfolioData) => void;
  resetData: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isLoadingScreen: boolean;
  setIsLoadingScreen: (loading: boolean) => void;
  messages: ContactMessage[];
  addMessage: (name: string, email: string, message: string) => boolean;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  selectedProject: ProjectItem | null;
  setSelectedProject: (project: ProjectItem | null) => void;
  secretUrl: string;
}

const STORAGE_KEY = 'yans_portfolio_data_v1';
const MESSAGES_KEY = 'yans_portfolio_messages_v1';
const ADMIN_AUTH_KEY = 'yans_admin_authenticated';
const THEME_KEY = 'yans_portfolio_theme';

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  const [isLoadingScreen, setIsLoadingScreen] = useState<boolean>(true);

  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultPortfolioData,
          ...parsed,
          seo: { ...defaultPortfolioData.seo, ...(parsed.seo || {}) },
          profile: {
            ...defaultPortfolioData.profile,
            ...(parsed.profile || {}),
            socialLinks: { ...defaultPortfolioData.profile.socialLinks, ...(parsed.profile?.socialLinks || {}) }
          }
        };
      }
    } catch (e) {
      console.error('Failed to parse portfolio data from storage', e);
    }
    return defaultPortfolioData;
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem(MESSAGES_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse messages', e);
    }
    return [
      {
        id: 'msg-demo-1',
        name: 'Sarah Client',
        email: 'sarah@techstudio.com',
        message: 'Halo Sabian! Kami tertarik untuk mendiskusikan pembuatan platform SaaS baru untuk tim kami. Apakah kamu available untuk freelance project bulan ini?',
        date: new Date(Date.now() - 3600000 * 24).toISOString(),
        read: false
      }
    ];
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  });
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (!data?.seo) return;

    if (data.seo.metaTitle) {
      document.title = data.seo.metaTitle;
    }

    const updateMeta = (selector: string, attr: string, value: string) => {
      if (!value) return;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const match = selector.match(/meta\[([a-zA-Z0-9_-]+)="([^"]+)"\]/);
        if (match) {
          el.setAttribute(match[1], match[2]);
          document.head.appendChild(el);
        }
      }
      el.setAttribute(attr, value);
    };

    if (data.seo.metaDescription) {
      updateMeta('meta[name="description"]', 'content', data.seo.metaDescription);
      updateMeta('meta[property="og:description"]', 'content', data.seo.metaDescription);
      updateMeta('meta[name="twitter:description"]', 'content', data.seo.metaDescription);
    }

    if (data.seo.metaTitle) {
      updateMeta('meta[property="og:title"]', 'content', data.seo.metaTitle);
      updateMeta('meta[name="twitter:title"]', 'content', data.seo.metaTitle);
    }

    if (data.seo.keywords) {
      updateMeta('meta[name="keywords"]', 'content', data.seo.keywords);
    }

    if (data.seo.ogImage) {
      updateMeta('meta[property="og:image"]', 'content', data.seo.ogImage);
      updateMeta('meta[name="twitter:image"]', 'content', data.seo.ogImage);
    }
  }, [data.seo]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingScreen(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkAdminAccess = () => {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const secret = (data?.adminSettings?.secretSlug || 'admin').toLowerCase();

      if (
        hash === `#${secret}` ||
        hash === '#admin' ||
        params.get('admin') === 'true' ||
        params.get('admin') === secret
      ) {
        setIsAdminOpen(true);
      }
    };

    checkAdminAccess();
    window.addEventListener('hashchange', checkAdminAccess);
    return () => window.removeEventListener('hashchange', checkAdminAccess);
  }, [data.adminSettings?.secretSlug]);

  const updateData = (newData: PortfolioData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const resetData = () => {
    setData(defaultPortfolioData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPortfolioData));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const addMessage = (name: string, email: string, messageText: string) => {
    const newMsg: ContactMessage = {
      id: 'msg-' + Date.now(),
      name,
      email,
      message: messageText,
      date: new Date().toISOString(),
      read: false
    };
    const updated = [newMsg, ...messages];
    setMessages(updated);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
    return true;
  };

  const markMessageRead = (id: string) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, read: true } : m));
    setMessages(updated);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
  };

  const deleteMessage = (id: string) => {
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
  };

  const loginAdmin = (pin: string) => {
    if (!data.adminSettings.enablePin || pin === data.adminSettings.pinCode) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    setIsAdminOpen(false);
    if (window.location.hash.includes('admin')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const secretUrl = `${typeof window !== 'undefined' ? window.location.origin + window.location.pathname : ''}#${data.adminSettings?.secretSlug || 'admin'}`;

  return (
    <PortfolioContext.Provider
      value={{
        data,
        updateData,
        resetData,
        theme,
        toggleTheme,
        isLoadingScreen,
        setIsLoadingScreen,
        messages,
        addMessage,
        markMessageRead,
        deleteMessage,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        selectedProject,
        setSelectedProject,
        secretUrl
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
