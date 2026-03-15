// data_sdk.js for Supabase integration
// Replace with your Supabase Project URL and anon key

const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

window.dataSdk = {
  async list() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ckg_pasien?select=*`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    if (!res.ok) throw new Error("Gagal mengambil data");
    return await res.json();
  },
  async create(data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ckg_pasien`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Gagal menambah data");
    return (await res.json())[0];
  },
  async update(id, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ckg_pasien?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Gagal mengubah data");
    return (await res.json())[0];
  },
  async delete(id) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ckg_pasien?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    if (!res.ok) throw new Error("Gagal menghapus data");
    return true;
  },
};

// Optional: Realtime via polling (Supabase JS client needed for true realtime)
window.dataSdk.subscribe = (callback, intervalMs = 5000) => {
  let stopped = false;
  async function poll() {
    while (!stopped) {
      try {
        const data = await window.dataSdk.list();
        callback(data);
      } catch {}
      await new Promise(r => setTimeout(r, intervalMs));
    }
  }
  poll();
  return () => { stopped = true; };
};
