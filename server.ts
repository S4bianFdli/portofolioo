import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Initialize Gemini AI SDK if key is present
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (e) {
      console.warn('Failed to initialize GoogleGenAI client:', e);
    }
  }

  // API Route: AI Assistant Chat
  app.post('/api/assistant', async (req, res) => {
    try {
      const { message, history = [], portfolioContext } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Default knowledge context about RyHar
      const contextPrompt = portfolioContext || `
Profil Pemilik Portofolio:
- Nama:  Sabian Fadli Kusuma (Sabin/YansXiters
- Role: Frontend Web Developer & Bot Specialist
- Pengalaman: 2+ tahun di bidang web development
- Bahasa Utama: Javascript dan Typescript
- Lokasi: Suralarta, Indonesia
- Pendidikan: SMK Negeri 2 Surakarta
- Kontak: iyannrealcs@gmail.com, +62 896-1637-4060
- Tech Stack Frontend: React, Next.js, Tailwind CSS, TypeScript
- Tech Stack Backend: Node.js, Express.js, MySQL, MongoDB, Prisma
- Project Unggulan:
  1. Gold Analisis - Platform web untuk menganalisis pasar emas
  2. Xiters Tools - Platform web tools yang menyediakan banyak tools secara gratis.
  3. Elaina Bot (WhatsApp) - Multifunctional WhatsApp bot dengan berbagai fitur menarik seperti games, tools, automation, dan integrasi API interaktif.
`;

      const systemInstruction = `Anda adalah "Yans Assistant", asisten AI resmi yang cerdas, ramah, dan profesional untuk portofolio Ahmad Rizki Hartawan (RyHar).
Gaya bicara: Ramah, santun, berbahasa Indonesia natural, profesional, ringkas, dan to the point.
Tugas Anda:
1. Menjawab pertanyaan pengunjung seputar portofolio, latar belakang pendidikan, keahlian teknis (tech stack), pengalaman kerja, dan proyek-proyek RyHar.
2. Jika ditanya "kamu siapa?", perkenalkan diri persis atau serupa dengan: "Saya Yans Assistant, asisten AI pribadi untuk Ahmad Rizki Hartawan, seorang Fullstack Web Developer. Saya siap membantu Anda dengan informasi tentang portofolio, layanan, atau proyek yang ia kerjakan."
3. Jika ditanya kontak atau cara menghubungi, berikan email iyannrealcs@gmail.com atau nomor WhatsApp / form kontak di web.
4. Gunakan informasi dari konteks berikut:
${contextPrompt}
`;

      if (ai) {
        // Build conversation contents
        const contents: any[] = [];
        
        // Add previous history if provided
        if (Array.isArray(history)) {
          for (const item of history.slice(-6)) {
            contents.push({
              role: item.role === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }],
            });
          }
        }

        // Add current message
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          },
        });

        const replyText = response.text || 'Maaf, saya tidak dapat memproses jawaban saat ini.';
        return res.json({ reply: replyText });
      }

      // Smart fallback response if Gemini API key is not configured
      const lower = message.toLowerCase();
      let fallback = '';

      if (lower.includes('siapa') || lower.includes('kamu siapa') || lower.includes('kenalan')) {
        fallback = 'Saya Yans Assistant, asisten AI pribadi untuk Sabian Fadli Kusuma, seorang Frontend Web Developer. Saya siap membantu Anda dengan informasi tentang portofolio, layanan, atau proyek yang ia kerjakan.';
      } else if (lower.includes('project') || lower.includes('proyek') || lower.includes('karya')) {
        fallback = 'YansXiters telah mengerjakan berbagai proyek unggulan seperti Gold Analisis (platform Platform web untuk menganalisis pasar emas), Xiters Tools (Platform web tools yang menyediakan banyak tools gratis.), dan Elaina Bot (WhatsApp multifunctional bot). Anda juga dapat melihat detail lengkapnya di bagian Selected Works!';
      } else if (lower.includes('skill') || lower.includes('tech') || lower.includes('stack') || lower.includes('kemampuan')) {
        fallback = 'Tech stack utama Yans berfokus pada JavaScript/TypeScript ecosystem. Di sisi frontend menggunakan React, Next.js, dan Tailwind CSS. Di sisi backend menguasai Node.js, Express.js, MySQL, MongoDB, serta integrasi API.';
      } else if (lower.includes('kontak') || lower.includes('hubungi') || lower.includes('hire') || lower.includes('email') || lower.includes('wa')) {
        fallback = 'Anda bisa langsung mengirimkan pesan melalui formulir "Contact Me" di bawah, atau menghubungi langsung via email iyannrealcs@gmail.com dan WhatsApp +62 896-1637-4060.';
      } else if (lower.includes('pengalaman') || lower.includes('experience') || lower.includes('karir')) {
        fallback = 'Sabian memiliki pengalaman lebih dari 2 tahun sebagai Frontend Developer & Bot Developer, mengembangkan berbagai aplikasi SaaS, bot otomasi pesan, serta API publik berkinerja tinggi.';
      } else {
        fallback = `Terima kasih telah bertanya! YansXiters adalah seorang Frontend Web Developer yang berfokus menciptakan web modern, cepat, dan fungsional. Ada hal spesifik tentang project atau skill yang ingin Anda ketahui?`;
      }

      return res.json({ reply: fallback });
    } catch (err: any) {
      console.error('Error in /api/assistant:', err);
      return res.status(500).json({
        error: 'Terjadi kendala pada asisten AI',
        fallback: 'Saya Yans Assistant. Silakan tanyakan hal lain terkait portofolio atau hubungi Sabian langsung!',
      });
    }
  });

  // API Route: Contact Form storage ping
  app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    // Return success response; frontend also stores in localStorage for the Admin CMS
    return res.json({ success: true, message: 'Message sent successfully' });
  });

  // Route for admin page
  app.get('/admin', (_req, res) => {
    res.redirect('/admin.html');
  });

  // In development, hook Vite middleware
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static dist
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('/admin.html', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'admin.html'));
    });
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
