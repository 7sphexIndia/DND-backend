import type { Request, Response } from 'express';
import { Readable } from 'stream';

export const proxyGoogleDriveImage = async (req: Request, res: Response) => {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid drive ID' });
  }

  const driveUrl = `https://docs.google.com/uc?export=download&id=${id}`;

  try {
    const response = await fetch(driveUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.error(`Google Drive fetch failed: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({ error: 'Failed to fetch from Google Drive' });
    }

    const contentType = response.headers.get('content-type');
    
    // Check if it's an HTML page (possibly virus scan prompt)
    if (contentType?.includes('text/html')) {
      const html = await response.text();
      // Look for confirmation token in common Google Drive response formats
      const confirmMatch = html.match(/confirm=([a-zA-Z0-9_-]+)/);
      if (confirmMatch) {
        const confirmUrl = `${driveUrl}&confirm=${confirmMatch[1]}`;
        const secondResponse = await fetch(confirmUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        
        if (secondResponse.ok && secondResponse.body) {
           const finalContentType = secondResponse.headers.get('content-type') || 'image/jpeg';
           res.setHeader('Content-Type', finalContentType);
           res.setHeader('Cache-Control', 'public, max-age=604800');
           const readable = Readable.fromWeb(secondResponse.body as any);
           return readable.pipe(res);
        }
      }
      return res.status(403).json({ error: 'Google Drive requires manual confirmation which could not be automated.' });
    }

    if (contentType) {
      res.setHeader('Content-Type', contentType);
    } else {
      res.setHeader('Content-Type', 'image/jpeg');
    }
    
    // Add cache headers
    res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (response.body) {
      // Stream the response body directly to the client
      const readable = Readable.fromWeb(response.body as any);
      readable.pipe(res);
    } else {
      res.status(404).json({ error: 'No content received from Google Drive' });
    }
  } catch (error) {
    console.error('Proxy Error:', error);
    if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error while proxying image' });
    }
  }
};
