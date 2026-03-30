const fs = require('fs');
const path = require('path');

// Lokasi database (sementara di folder /tmp agar Vercel tidak error saat nulis)
const dbPath = path.join('/tmp', 'user.json');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { username, password, type } = req.body;

    // Inisialisasi database jika belum ada di memori sementara Vercel
    if (!fs.existsSync(dbPath)) {
        const initialData = [{ username: "ReyCloud", password: "Rey1903", role: "Creator", balance: 200000 }];
        fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
    }

    let users = JSON.parse(fs.readFileSync(dbPath));

    if (type === 'reg') {
        if (users.find(u => u.username === username)) {
            return res.json({ status: false, message: "Username sudah ada!" });
        }
        users.push({ username, password, role: "Member", balance: 0 });
        fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
        return res.json({ status: true, message: "Berhasil Daftar!" });
    }

    if (type === 'login') {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            return res.json({ status: true, user });
        } else {
            return res.json({ status: false, message: "Username/Password Salah!" });
        }
    }
}
