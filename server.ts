import express from 'express';
import webpush from 'web-push';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || "BE3jDtCtYk3kIhcMInsKUpYvn9EOt2MCLvGr9NIOne1upDEJdkgeiOGzcKezVYi22t0T0gkuIc_LSWuUx6DSqdU";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "-VnRJa_ad3zm40zDk7EfT7wHZfWqmmVmW6GLMRFWCaw";
const VAPID_EMAIL = process.env.VAPID_EMAIL || "mailto:adminsabilillah@gmail.com";

webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

interface PushSubRecord {
  endpoint: string;
  subscription: webpush.PushSubscription;
  user?: string;
  createdAt: number;
}
const subscriptions = new Map<string, PushSubRecord>();

app.get('/api/vapid-key', (_req, res) => {
  res.json({ publicKey: VAPID_PUBLIC_KEY });
});

app.post('/api/subscribe', (req, res) => {
  const { subscription, user } = req.body;
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Invalid subscription' });
  }
  subscriptions.set(subscription.endpoint, {
    endpoint: subscription.endpoint,
    subscription,
    user: user || 'Anonymous',
    createdAt: Date.now()
  });
  console.log(`[WebPush] Device subscribed. Total devices: ${subscriptions.size}`);
  return res.json({ success: true, count: subscriptions.size });
});

app.post('/api/unsubscribe', (req, res) => {
  const { endpoint } = req.body;
  if (endpoint) {
    subscriptions.delete(endpoint);
  }
  return res.json({ success: true });
});

app.post('/api/send-push', async (req, res) => {
  const { title, body, data, customSubscriptions } = req.body;
  
  const payload = JSON.stringify({
    title: title || 'Laporan Supervisi Masuk!',
    body: body || 'Ada data supervisi baru yang masuk ke sistem.',
    icon: 'https://i.ibb.co/HTKMs1Q7/LPI-3-10-New.png',
    badge: 'https://i.ibb.co/HTKMs1Q7/LPI-3-10-New.png',
    vibrate: [250, 100, 250, 100, 250],
    data: data || { url: '/' },
    tag: 'supervisi-' + (data?.id || Date.now()),
    renotify: true
  });

  const targets = new Map<string, webpush.PushSubscription>();
  for (const [endpoint, record] of subscriptions.entries()) {
    targets.set(endpoint, record.subscription);
  }
  
  if (Array.isArray(customSubscriptions)) {
    for (const sub of customSubscriptions) {
      if (sub && sub.endpoint) {
        targets.set(sub.endpoint, sub);
      }
    }
  }

  const results = { success: 0, failed: 0 };
  const expiredEndpoints: string[] = [];

  const promises = Array.from(targets.values()).map(async (sub) => {
    try {
      await webpush.sendNotification(sub, payload);
      results.success++;
    } catch (err: any) {
      results.failed++;
      console.warn('[WebPush] Error sending notification:', err.statusCode || err.message);
      if (err.statusCode === 410 || err.statusCode === 404) {
        expiredEndpoints.push(sub.endpoint);
      }
    }
  });

  await Promise.all(promises);

  for (const ep of expiredEndpoints) {
    subscriptions.delete(ep);
  }

  return res.json({ success: true, ...results, total: targets.size });
});

// Mount Vite or static files
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
