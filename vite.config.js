import { defineConfig } from 'vite';

export default defineConfig({
  // Point root to public folder containing HTML files and assets
  root: 'public',
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.warn('[Vite Proxy] Error connecting to backend on /api:', err.message);
          });
        },
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: false,
      },
    }
  },
  build: {
    // Output builds to root dist/ instead of public/dist/
    outDir: '../dist',
    emptyOutDir: true,
  },
  plugins: [
    {
      name: 'mock-php-backend',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const portalRoutes = ['/login', '/admin', '/dashboard', '/complete-profile', '/oauth-success'];
          const matchedRoute = portalRoutes.find(route => req.url.startsWith(route));
          if (matchedRoute) {
            res.writeHead(302, { Location: 'http://localhost:5176' + req.url });
            res.end();
            return;
          }

          const isContactRecaptcha = req.url === '/php/contact-form-recaptcha-v3.php';
          const isSendPhp = req.url === '/php/send.php';

          if (req.method === 'POST' && (isContactRecaptcha || isSendPhp)) {
            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', () => {
              // Parse urlencoded form data
              const params = new URLSearchParams(body);
              const data = {};
              for (const [key, value] of params.entries()) {
                data[key] = value;
              }

              const formName = isSendPhp ? 'Send Form (send.php)' : 'Contact Recaptcha (contact-form-recaptcha-v3.php)';
              console.log('\n=============================================');
              console.log(` MOCK BACKEND: Received submission for ${formName}`);
              console.log('=============================================');
              console.log(`  Name:     ${data.name || 'N/A'}`);
              console.log(`  Email:    ${data.email || 'N/A'}`);
              console.log(`  Services: ${data.services || 'N/A'}`);
              console.log(`  Message:  ${data.message || 'N/A'}`);
              console.log('=============================================');

              // Respond with the JSON success payload that view.contact.js/ajax expects
              // If it's a standard browser POST (not AJAX), send a nice redirect or HTML message
              const isAjax = req.headers['x-requested-with'] === 'XMLHttpRequest' || req.headers['accept']?.includes('json');
              
              if (isAjax) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ response: 'success' }));
              } else {
                res.setHeader('Content-Type', 'text/html');
                res.end(`
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <title>Message Sent</title>
                    <style>
                      body { font-family: "Poppins", Arial, sans-serif; background-color: #f7f7f7; text-align: center; padding: 50px; color: #333; }
                      .card { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); display: inline-block; max-width: 500px; }
                      h1 { color: #04486e; }
                      a { color: #046eac; text-decoration: none; font-weight: bold; }
                      a:hover { text-decoration: underline; }
                    </style>
                  </head>
                  <body>
                    <div class="card">
                      <h1>Thank You!</h1>
                      <p>Your message has been successfully received by our local development server mock.</p>
                      <p><a href="/contact-us.html">Return to Contact Page</a></p>
                    </div>
                  </body>
                  </html>
                `);
              }
            });
            return;
          }
          next();
        });
      }
    }
  ]
});
