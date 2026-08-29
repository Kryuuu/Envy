import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { nama_murid, mata_pelajaran, materi, jam } = await req.json();

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return NextResponse.json(
        { success: false, error: "Telegram config missing in .env.local" },
        { status: 500 }
      );
    }

    const message = `🔔 *TEST NOTIFIKASI*\n\n`
      + `Ini adalah pesan percobaan dari sistem:\n`
      + `- *Murid*: ${nama_murid}\n`
      + `- *Mata Pelajaran*: ${mata_pelajaran}\n`
      + `- *Materi*: ${materi}\n`
      + `- *Jam*: ${new Date(jam).toLocaleString("id-ID", { timeStyle: "short", dateStyle: "medium" })}`;

    const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    if (!tgRes.ok) {
      const errorData = await tgRes.text();
      let errorMessage = `Telegram API Error: ${errorData}`;
      
      if (errorData.includes("chat not found")) {
        errorMessage = "Chat ID tidak ditemukan atau Anda belum klik Start/Mulai pada Bot Telegram Anda. Pastikan Chat ID benar dan sudah kirim /start ke bot.";
      }
      
      throw new Error(errorMessage);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
