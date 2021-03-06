import serve from '@moped/serve-assets';

serve(
  import('./server')
    .then(server => server.default as any)
    .catch(ex => {
      console.error('Error loading server');
      console.error(ex.stack || ex.message || ex);
      process.exit(1);
      throw new Error('Should be unreachable code');
    }),
  {
    manifestFileName: 'public/asset-manifest.json',
    publicDirectoryName: 'public',
    proxyHtmlRequests: true,
  },
);
