This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Configuration

### Variables d'environnement

Créez un fichier `.env.local` avec les variables suivantes :

#### Dash OAuth
- `DASH_CLIENT_ID` : Votre client ID Dash
- `DASH_CLIENT_SECRET` : Votre client secret Dash
- `DASH_REFRESH_TOKEN` : Votre refresh token Dash
- `DASH_REDIRECT_URI` : L'URI de redirection pour OAuth

#### WhatsApp Business API
- `WHATSAPP_API_URL` : URL de l'API WhatsApp (ex: `https://graph.facebook.com/v18.0`)
- `WHATSAPP_PHONE_NUMBER_ID` : ID de votre numéro de téléphone WhatsApp Business
- `WHATSAPP_ACCESS_TOKEN` : Token d'accès WhatsApp Business
- `WHATSAPP_GROUP_ID` : ID du groupe WhatsApp où envoyer les messages

### Webhook Dash

L'endpoint webhook est disponible à : `/api/webhook/dash`

Configurez ce webhook dans votre compte Dash pour recevoir les événements. Lorsqu'un événement "new asset" est reçu, un message WhatsApp sera automatiquement envoyé au groupe configuré.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
