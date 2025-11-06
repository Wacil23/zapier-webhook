import { NextResponse } from "next/server";

interface DashWebhookEvent {
  type: string;
  data?: {
    asset?: {
      id?: string;
      name?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
  [key: string]: any;
}

async function sendWhatsAppMessage(message: string) {
  const whatsappApiUrl = process.env.WHATSAPP_API_URL;
  const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const whatsappAccessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const whatsappGroupId = process.env.WHATSAPP_GROUP_ID;

  if (
    !whatsappApiUrl ||
    !whatsappPhoneNumberId ||
    !whatsappAccessToken ||
    !whatsappGroupId
  ) {
    console.error("⚠️ Variables d'environnement WhatsApp manquantes");
    return false;
  }

  try {
    const response = await fetch(
      `${whatsappApiUrl}/${whatsappPhoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${whatsappAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: whatsappGroupId,
          type: "text",
          text: {
            body: message,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Erreur lors de l'envoi du message WhatsApp:", error);
      return false;
    }

    const result = await response.json();
    console.log("✅ Message WhatsApp envoyé avec succès:", result);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi du message WhatsApp:", error);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const body: DashWebhookEvent = await req.json();

    console.log("📥 Événement reçu de Dash:", body);

    // Vérifier si c'est un événement "new asset"
    if (
      body.type === "new asset" ||
      body.event === "new asset" ||
      body.event_type === "new asset"
    ) {
      const asset = body.data?.asset || body.asset || body.data;
      const assetName = asset?.name || asset?.title || "Nouvel asset";
      const assetId = asset?.id || "N/A";

      const message =
        `🎉 Nouvel asset créé dans Dash!\n\n` +
        `📦 Nom: ${assetName}\n` +
        `🆔 ID: ${assetId}\n` +
        `⏰ Date: ${new Date().toLocaleString("fr-FR")}`;

      const sent = await sendWhatsAppMessage(message);

      if (sent) {
        return NextResponse.json(
          {
            success: true,
            message: "Événement traité et message WhatsApp envoyé",
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            success: false,
            message: "Événement reçu mais échec de l'envoi WhatsApp",
          },
          { status: 500 }
        );
      }
    }

    // Si ce n'est pas un événement "new asset", on retourne juste un succès
    return NextResponse.json(
      { success: true, message: "Événement reçu mais non traité" },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Erreur lors du traitement du webhook:", errorMessage);
    return NextResponse.json(
      { error: "Erreur lors du traitement du webhook" },
      { status: 500 }
    );
  }
}

// Permettre aussi GET pour la vérification du webhook (si nécessaire)
export async function GET() {
  return NextResponse.json({ message: "Webhook Dash actif" }, { status: 200 });
}
