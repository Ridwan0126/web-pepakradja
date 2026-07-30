import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phoneNumber, message } = req.body;

  if (!phoneNumber || !message) {
    return res.status(400).json({ error: "Missing phoneNumber or message" });
  }

  try {
    // Format phone number with country code (assuming Indonesia +62)
    const formattedNumber = phoneNumber.startsWith("62")
      ? `+${phoneNumber}`
      : `+62${phoneNumber.substring(1)}`;

    // Send message via Twilio WhatsApp
    const result = await client.messages.create({
      from: `whatsapp:${twilioPhoneNumber}`,
      to: `whatsapp:${formattedNumber}`,
      body: message,
    });

    res.status(200).json({
      success: true,
      messageSid: result.sid,
      message: "Pesan WhatsApp berhasil dikirim",
    });
  } catch (error) {
    console.error("[v0] WhatsApp API error:", error);
    res.status(500).json({
      error: "Gagal mengirim pesan WhatsApp",
      details: error.message,
    });
  }
}
