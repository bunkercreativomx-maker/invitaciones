// Service worker: notificaciones de confirmaciones (cumple de Adhara)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || '🤠 Nueva confirmación', {
    body: d.body || 'Alguien confirmó al cumple de Adhara',
    icon: 'img/icon-192.png', badge: 'img/icon-192.png',
    tag: d.tag || 'rsvp', renotify: true, vibrate: [120, 60, 120],
    data: { url: d.url || 'admin.html' }
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL(e.notification.data.url || 'admin.html', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    for (const c of cs) { if (c.url.includes('admin.html')) { c.focus(); return c.navigate ? c.navigate(url) : null; } }
    return self.clients.openWindow(url);
  }));
});
