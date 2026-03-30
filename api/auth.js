const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
    // Tambahkan header CORS biar gak diblokir browser
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');

    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

    const { username, password } = req.body;

    try {
        // Coba baca file user.json yang ada di root folder
        const filePath = path.join(process.cwd(), 'users.json');
        
        if (!fs.existsSync(filePath)) {
            return res.status(500).json({ status: false, message: "File user.json tidak ditemukan di server!" });
        }

        const fileData = fs.readFileSync(filePath, 'utf8');
        const users = JSON.parse(fileData);

        // Cari user yang cocok
        const user = users.find(u => u.username === username && String(u.password) === String(password));

        if (user) {
            return res.status(200).json({ status: true, user });
        } else {
            return res.status(401).json({ status: false, message: "Username atau Password Salah!" });
        }

    } catch (error) {
        return res.status(500).json({ status: false, message: "Error: " + error.message });
    }
}
