import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // Proteksi: Cuma boleh GET (biar gak sembarang orang narik data)
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // 1. Ambil Data Users dari Vercel KV
        const users = await kv.get('reycloud_users') || [];
        
        // 2. Ambil Data Income dari Vercel KV
        // (Pastikan key 'reycloud_income' sudah ada, kalau belum default 0)
        const income = await kv.get('reycloud_income') || 0;

        // 3. Kirim Data Real-Time ke Dashboard
        res.status(200).json({
            status: true,
            totalMember: users.length,
            totalIncome: income,
            // Kamu juga bisa tambahkan stats lain di sini
            serverActive: 1 // Contoh stats manual
        });

    } catch (err) {
        console.error("Stats Error:", err);
        res.status(500).json({ status: false, message: "Database Error" });
    }
}
