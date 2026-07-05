import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import "dotenv/config";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON bodies
  app.use(express.json());

  // Contact API route
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({
          success: false,
          error: "Tüm alanlar (Ad, E-Posta, Konu, Mesaj) zorunludur."
        });
      }

      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        console.warn("RESEND_API_KEY is not set in environment variables.");
        return res.status(500).json({
          success: false,
          error: "Resend API anahtarı ayarlanmamış. Lütfen Secrets panelinden RESEND_API_KEY tanımını yapın."
        });
      }

      // Prepare email payload
      const emailPayload = {
        from: "Kaan Portfolio <onboarding@resend.dev>",
        to: ["kaan60business@gmail.com"],
        reply_to: email,
        subject: `[Portfolio İletişim] ${subject}`,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0c0c0e; color: #f4f4f5; border: 1px solid #27272a; border-radius: 4px;">
            <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 24px; color: #ffffff; border-bottom: 1px solid #27272a; padding-bottom: 12px; font-family: Georgia, serif;">
              Yeni İletişim Formu Mesajı
            </h2>
            
            <div style="margin-bottom: 20px;">
              <span style="font-size: 11px; font-family: monospace; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">
                Gönderen Kişi
              </span>
              <strong style="font-size: 15px; color: #ffffff; display: block;">${name}</strong>
              <a href="mailto:${email}" style="font-size: 13px; color: #e4e4e7; text-decoration: none; display: inline-block; margin-top: 2px;">${email}</a>
            </div>

            <div style="margin-bottom: 20px;">
              <span style="font-size: 11px; font-family: monospace; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">
                Konu Başlığı
              </span>
              <strong style="font-size: 15px; color: #ffffff; display: block;">${subject}</strong>
            </div>

            <div style="margin-bottom: 24px; background-color: #18181b; padding: 16px; border: 1px solid #27272a; border-radius: 4px;">
              <span style="font-size: 11px; font-family: monospace; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">
                Mesaj
              </span>
              <p style="font-size: 14px; line-height: 1.6; color: #e4e4e7; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>

            <div style="font-size: 11px; font-family: monospace; color: #71717a; text-align: center; border-top: 1px solid #27272a; padding-top: 16px; margin-top: 32px;">
              Bu e-posta Kaan Öztürk Portfolyo Sitesi aracılığıyla gönderilmiştir.
            </div>
          </div>
        `
      };

      // Call Resend REST API
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(emailPayload)
      });

      const data = await response.json();

      if (response.ok) {
        return res.json({ success: true, id: data.id });
      } else {
        console.error("Resend API response error:", data);
        return res.status(response.status).json({
          success: false,
          error: data.message || "E-posta gönderimi sırasında Resend servis hatası oluştu."
        });
      }
    } catch (err: any) {
      console.error("Contact API execution error:", err);
      return res.status(500).json({
        success: false,
        error: "E-posta gönderilirken sunucu hatası oluştu: " + err.message
      });
    }
  });

  // GitHub Readme Proxy Route
  app.get("/api/github/readme", async (req, res) => {
    try {
      const { repo } = req.query;
      if (!repo || typeof repo !== "string") {
        return res.status(400).json({
          success: false,
          error: "repo parametresi zorunludur."
        });
      }

      // Safe check to prevent path traversal or other malicious inputs
      const safeRepo = repo.replace(/[^a-zA-Z0-9-_]/g, "");
      if (!safeRepo) {
        return res.status(400).json({
          success: false,
          error: "Geçersiz repo ismi."
        });
      }

      // Helper function to convert relative URLs in README to absolute GitHub URLs and transform HTML tags
      const transformRelativePaths = (content: string, repoName: string, branch: string = "main"): string => {
        const rawBase = `https://raw.githubusercontent.com/Kaan60ozturk/${repoName}/${branch}`;
        const blobBase = `https://github.com/Kaan60ozturk/${repoName}/blob/${branch}`;

        // 1. Transform markdown images: ![alt](relative_path)
        content = content.replace(
          /!\[([^\]]*)\]\(((?!(?:https?:\/\/|data:|mailto:|#))(?:\.\/)?([^)]+))\)/g,
          (match, alt, fullPath, relativePath) => {
            return `![${alt}](${rawBase}/${relativePath})`;
          }
        );

        // 2. Transform markdown links: [text](relative_path)
        content = content.replace(
          /\[([^\]]*)\]\(((?!(?:https?:\/\/|mailto:|tel:|#))(?:\.\/)?([^)]+))\)/g,
          (match, text, fullPath, relativePath) => {
            return `[${text}](${blobBase}/${relativePath})`;
          }
        );

        // 3. Transform HTML src attributes: src="relative_path" or src='relative_path'
        content = content.replace(
          /src=["']((?!(?:https?:\/\/|data:|#))(?:\.\/)?([^"']+))["']/g,
          (match, fullPath, relativePath) => {
            return `src="${rawBase}/${relativePath}"`;
          }
        );

        // 4. Transform HTML href attributes: href="relative_path" or href='relative_path'
        content = content.replace(
          /href=["']((?!(?:https?:\/\/|mailto:|tel:|#))(?:\.\/)?([^"']+))["']/g,
          (match, fullPath, relativePath) => {
            return `href="${blobBase}/${relativePath}"`;
          }
        );

        // 5. Convert HTML <img> tags to Markdown images and normalize relative src paths
        content = content.replace(/<img\s+([^>]+)>/gi, (match, attrs) => {
          const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
          const altMatch = attrs.match(/alt=["']([^"']+)["']/i);
          const src = srcMatch ? srcMatch[1] : "";
          const alt = altMatch ? altMatch[1] : "";
          if (!src) {
            return "";
          }
          const normalizedSrc = /^(?:https?:\/\/|data:|#)/i.test(src)
            ? src
            : `${rawBase}/${src.replace(/^\.\//, '')}`;
          return `![${alt}](${normalizedSrc})`;
        });

        // 6. Clean centering or other presentation HTML tags to clean markdown equivalents
        content = content.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (match, text) => `\n# ${text.trim()}\n`);
        content = content.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (match, text) => `\n## ${text.trim()}\n`);
        content = content.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (match, text) => `\n### ${text.trim()}\n`);
        content = content.replace(/<(b|strong)[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**");
        content = content.replace(/<br\s*\/?>/gi, "\n");
        content = content.replace(/<p[^>]*>/gi, "\n");
        content = content.replace(/<\/p>/gi, "\n");
        content = content.replace(/<div[^>]*>/gi, "");
        content = content.replace(/<\/div>/gi, "");
        content = content.replace(/<center[^>]*>/gi, "");
        content = content.replace(/<\/center>/gi, "");

        return content;
      };

      // Candidates to try if safeRepo lookup fails or needs alternative spellings
      const repoCandidates = [safeRepo];
      if (safeRepo.includes("chrome-linkedin-profil")) {
        repoCandidates.push(
          "chrome-linkedin-profil-ozetleyici-uzantisi",
          "chrome-linkedin-profil-özetleyici-uzantısı",
          "chrome-linkedin-profil-zetliyici-uzant-s-",
          "chrome-linkedin-profil-zetleyici-uzants"
        );
      }

      let successContent = null;

      for (const candidate of repoCandidates) {
        try {
          const githubUrl = `https://api.github.com/repos/Kaan60ozturk/${candidate}/readme`;
          const response = await fetch(githubUrl, {
            headers: {
              "User-Agent": "Kaan-Portfolio-Applet",
              "Accept": "application/vnd.github.v3+json"
            }
          });

          if (response.ok) {
            const data: any = await response.json();
            let branch = "main";
            if (data.download_url) {
              const branchMatch = data.download_url.match(/\/Kaan60ozturk\/[^/]+\/([^/]+)\//i);
              if (branchMatch) {
                branch = branchMatch[1];
              }
            } else if (data.html_url) {
              const branchMatch = data.html_url.match(/\/blob\/([^/]+)\//i);
              if (branchMatch) {
                branch = branchMatch[1];
              }
            }

            if (data.content && data.encoding === "base64") {
              const decodedContent = Buffer.from(data.content, "base64").toString("utf-8");
              successContent = transformRelativePaths(decodedContent, candidate, branch);
              break;
            } else if (data.download_url) {
              const rawRes = await fetch(data.download_url);
              if (rawRes.ok) {
                const content = await rawRes.text();
                successContent = transformRelativePaths(content, candidate, branch);
                break;
              }
            }
          } else {
            // Raw fallback for this candidate if GitHub API is rate limited or returns error
            const rawUrls = [
              { url: `https://raw.githubusercontent.com/Kaan60ozturk/${candidate}/main/README.md`, branch: "main" },
              { url: `https://raw.githubusercontent.com/Kaan60ozturk/${candidate}/master/README.md`, branch: "master" }
            ];

            let rawFound = false;
            for (const item of rawUrls) {
              try {
                const rawRes = await fetch(item.url);
                if (rawRes.ok) {
                  const content = await rawRes.text();
                  successContent = transformRelativePaths(content, candidate, item.branch);
                  rawFound = true;
                  break;
                }
              } catch (rawErr) {
                // continue
              }
            }
            if (rawFound) {
              break;
            }
          }
        } catch (err) {
          // Try next candidate
        }
      }

      if (successContent) {
        return res.json({ success: true, content: successContent });
      }

      return res.status(404).json({
        success: false,
        error: `README dosyası bulunamadı.`
      });
    } catch (err: any) {
      console.error("Github Readme API error:", err);
      return res.status(500).json({
        success: false,
        error: "README yüklenirken bir sunucu hatası oluştu: " + err.message
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
