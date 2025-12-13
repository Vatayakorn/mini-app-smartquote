# btz-rate-miniapp

Telegram Mini App for BTZ Rate Bot customer search.

## Environment Variables

Create `.env` file:

```env
BOT_TOKEN=your_telegram_bot_token
CUSTOMER_API_URL=https://lf-api.wg-kube.com/v1/customers
CUSTOMER_API_KEY=your_api_key
ALLOWED_OPERATOR_IDS=111111,222222
```

## Development

```bash
npm install
npm run dev
```

## Deploy to Vercel

```bash
npx vercel
```

Set environment variables in Vercel dashboard.

## BotFather Setup

1. Message @BotFather
2. `/mybots` → Select your bot → `Bot Settings` → `Menu Button`
3. Set URL to your Vercel deployment URL
