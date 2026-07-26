import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'central_store.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ applications: {}, tokens: [] }, null, 2), 'utf-8');
  }
}

function centralApiPlugin() {
  return {
    name: 'central-api-store',
    configureServer(server) {
      ensureDataFile();

      server.middlewares.use((req, res, next) => {
        if (req.url.startsWith('/api/store')) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
          }

          if (req.method === 'GET') {
            try {
              ensureDataFile();
              const content = fs.readFileSync(DATA_FILE, 'utf-8');
              res.statusCode = 200;
              res.end(content);
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
              try {
                ensureDataFile();
                const payload = JSON.parse(body);
                const currentData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

                if (payload.type === 'token') {
                  const existingIdx = currentData.tokens.findIndex(t => t.tokenNo === payload.data.tokenNo);
                  if (existingIdx >= 0) {
                    currentData.tokens[existingIdx] = payload.data;
                  } else {
                    currentData.tokens.unshift(payload.data);
                  }
                } else if (payload.type === 'application') {
                  currentData.applications[payload.data.id] = payload.data;
                } else if (payload.type === 'sync_all') {
                  if (payload.data.tokens) {
                    payload.data.tokens.forEach(t => {
                      if (!currentData.tokens.some(ct => ct.tokenNo === t.tokenNo)) {
                        currentData.tokens.push(t);
                      }
                    });
                  }
                  if (payload.data.applications) {
                    currentData.applications = {
                      ...currentData.applications,
                      ...payload.data.applications
                    };
                  }
                }

                fs.writeFileSync(DATA_FILE, JSON.stringify(currentData, null, 2), 'utf-8');

                res.statusCode = 200;
                res.end(JSON.stringify({ success: true, data: currentData }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), centralApiPlugin()],
  build: {
    target: 'esnext',
    cssMinify: true
  }
});
