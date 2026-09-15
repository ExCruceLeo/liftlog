const CACHE_NAME='liftlog-app-v6-20260915';
const CORE=['./','./index.html','./manifest.json'];
self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(CORE).catch(()=>{})));
});
self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>k.startsWith('liftlog-app-') && k!==CACHE_NAME).map(k=>caches.delete(k))
    )).then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  event.respondWith(
    fetch(event.request).then(response=>{
      if(response.ok) caches.open(CACHE_NAME).then(c=>c.put(event.request,response.clone())).catch(()=>{});
      return response;
    }).catch(()=>caches.match(event.request))
  );
});
