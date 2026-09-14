import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Admin key needed to bypass RLS or write securely if needed
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Just using anon key since it seems to be the only one available
const supabase = createClient(supabaseUrl, supabaseKey);

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function GET() {
  try {
    // Cari jadwal yang waktunya 15 menit lagi (atau kurang) dari sekarang, dan belum dikirim notifnya
    const now = new Date();
    const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60000);

    const { data: jadwalList, error } = await supabase
      .from("jadwal_ngajar")
      .select("*")
      .eq("notif_sent", false)
      .gte("jam", now.toISOString())
      .lte("jam", fifteenMinutesFromNow.toISOString());

    if (error) throw error;

    let sentCount = 0;

    for (const jadwal of jadwalList || []) {
      const message = `🔔 *PENGINGAT MENGAJAR*\n\n`
        + `Halo! Jadwal mengajar Anda akan dimulai sebentar lagi (kurang dari 15 menit):\n`
        + `- *Murid*: ${jadwal.nama_murid}\n`
        + `- *Mata Pelajaran*: ${jadwal.mata_pelajaran}\n`
        + `- *Materi*: ${jadwal.materi}\n`
        + `- *Jam*: ${new Date(jadwal.jam).toLocaleString("id-ID", { timeStyle: "short", dateStyle: "medium" })}`;

      if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        // Kirim ke Telegram
        const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: "Markdown",
          }),
        });

        if (tgRes.ok) {
          // Tandai sudah dikirim
          await supabase.from("jadwal_ngajar").update({ notif_sent: true }).eq("id", jadwal.id);
          sentCount++;
        }
      } else {
        // Jika belum ada token, mock sending
        console.log("Mock sending TG message:", message);
        await supabase.from("jadwal_ngajar").update({ notif_sent: true }).eq("id", jadwal.id);
        sentCount++;
      }
    }

    return NextResponse.json({ success: true, sent_count: sentCount });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
