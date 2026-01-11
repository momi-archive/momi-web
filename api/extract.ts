import { parse } from 'node-html-parser';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();
    const root = parse(html);

    const getMeta = (name: string) => {
      return (
        root.querySelector(`meta[property="${name}"]`)?.getAttribute('content') ||
        root.querySelector(`meta[name="${name}"]`)?.getAttribute('content') ||
        ''
      );
    };

    const title =
      getMeta('og:title') ||
      getMeta('twitter:title') ||
      root.querySelector('title')?.text ||
      '';

    const description =
      getMeta('og:description') ||
      getMeta('twitter:description') ||
      getMeta('description') ||
      '';

    const image =
      getMeta('og:image') ||
      getMeta('twitter:image') ||
      '';

    return new Response(
      JSON.stringify({
        title: title.trim(),
        description: description.trim(),
        image: image,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Scraper error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
