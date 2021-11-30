This is a Telegram bot designed to filtering spam messages.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Edit spam patterns

You can start editing the spam patterns regexp by modifying `src/spamPatterns.ts`.

## Before deploy

See `.env.example` file what enviroment variables to set up need.

## Deploy on Netlify

This project uses `@netlify/plugin-nextjs` plugin.

Just [add](https://app.netlify.com/start) the new site in netlify dashboard from your git repository.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## After deploy

For the bot to work, you need to set a webhook, for this you can call the following command:

```sh
curl https://{HOST}/api/{TELEGRAM_BOT_TOKEN}/setup
```

Where: `{HOST}` equals to your enviroment variable `HOST` value and `{TELEGRAM_BOT_TOKEN}` equals to your enviroment variable `TELEGRAM_BOT_TOKEN` value.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
