export interface StatBadge {
  id: string;
  icon: 'clock' | 'code' | 'terminal' | 'sparkles' | 'award';
  text: string;
}

export interface SocialLinks {
  instagram: string;
  github: string;
  linkedin: string;
  twitter?: string;
  email?: string;
}

export interface PersonalDetails {
  name: string;
  placeOfBirth: string;
  phone: string;
  gpa: string;
  email: string;
  education: string;
}

export interface ExperienceItem {
  id: string;
  year: string;
  role: string;
  company: string;
  description: string;
  skills: string[];
}

export interface TechItem {
  name: string;
  iconName?: string;
}

export interface TechCategory {
  id: string;
  category: string;
  description: string;
  items: TechItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  features?: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
}

export interface SeoMetadata {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  author: string;
  canonicalUrl?: string;
}

export interface PortfolioData {
  profile: {
    name: string;
    greeting: string;
    titles: string[];
    bio: string;
    avatarUrl: string;
    cvUrl: string;
    badges: StatBadge[];
    socialLinks: SocialLinks;
  };
  about: {
    whoAmI: string;
    myApproach: string;
    personalDetails: PersonalDetails;
  };
  experiences: ExperienceItem[];
  techStack: TechCategory[];
  projects: ProjectItem[];
  seo: SeoMetadata;
  adminSettings: {
    secretSlug: string; // e.g. "admin" or "secret-cms"
    pinCode: string;    // e.g. "admin123"
    enablePin: boolean;
  };
}
