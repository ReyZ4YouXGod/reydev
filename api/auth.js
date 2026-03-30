import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // Hanya izinkan metode POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { username, password, type } = req.body;

    try {
        // 1. Ambil list user dari database KV
        let users = await kv.get('reycloud_users') || [];

        // --- LOGIC KHUSUS OWNER (ReyCloud) ---
        // Jika login/regis pakai nama ReyCloud, paksa spek Dewa
        const isAdminAccount = (username === 'ReyCloud' && password === 'Rey1903');

        // 2. MODE: REGISTER
        if (type === 'reg') {
            const userExists = users.find(u => u.username.toLowerCase() === username.toLowerCase());
            
            if (userExists) {
                return res.json({ status: false, message: "Username sudah terdaftar, Rey! 😈" });
            }

            const newUser = {
                username: username,
                password: password,
                role: isAdminAccount ? "Creator" : "Member",
                balance: isAdminAccount ? 200000 : 0,
                joinedAt: new Date().toISOString()
            };

            users.push(newUser);
            await kv.set('reycloud_users', users);
            
            return res.json({ status: true, message: "Berhasil daftar! Silakan login." });
        }

        // 3. MODE: LOGIN
        if (type === 'login') {
            let user = users.find(u => u.username === username && u.password === password);

            // Jika akun ReyCloud belum ada di database saat login, otomatis buatkan (Auto-Seed)
            if (!user && isAdminAccount) {
                user = { username: "ReyCloud", password: "Rey1903", role: "Creator", balance: 200000 };
                users.push(user);
                await kv.set('reycloud_users', users);
            }

            if (user) {
                // Jangan kirim password balik ke client buat keamanan
                const { password, ...userWithoutPass } = user;
                return res.json({ status: true, user: userWithoutPass });
            } else {
                return res.json({ status: false, message: "Username/Password salah, Cek lagi! ❌" });
            }
        }

    } catch (error) {
        console.error("KV Auth Error:", error);
        return res.status(500).json({ status: false, message: "Database Error, hubungi Admin!" });
    }
}
