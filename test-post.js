async function test() {
  try {
    const res = await fetch("http://localhost:3000/api/test-notif", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama_murid: "Budi",
        mata_pelajaran: "Matematika",
        materi: "Aljabar",
        jam: new Date().toISOString()
      })
    });
    
    const text = await res.text();
    console.log("STATUS:", res.status);
    console.log("RESPONSE:", text);
  } catch(e) {
    console.error("FETCH ERROR:", e);
  }
}
test();
