const fs = require('fs');
const path = require('path');
const dbPath = path.join('/tmp', 'user.json');

export default async function handler(req, res) {
    try {
        let totalMember = 0;
        if (fs.existsSync(dbPath)) {
            const users = JSON.parse(fs.readFileSync(dbPath));
            totalMember = users.length;
        } else {
            totalMember = 1; // Default cuma ReyCloud
        }

        res.json({
            status: true,
            totalMember: totalMember,
            totalIncome: 0 // Sementara 0 karena database income belum dibuat
        });
    } catch (err) {
        res.json({ status: false, totalMember: 1 });
    }
}
