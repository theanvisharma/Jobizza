(async () => {
  const scrape = (await import('website-scraper')).default;

  try {
    const result = await scrape({
      urls: ['https://jobizzatech.com/'],
      directory: './public',
    });
    console.log('Site scraped successfully into ./public!');
  } catch (err) {
    console.error('Error scraping site:', err);
  }
})();