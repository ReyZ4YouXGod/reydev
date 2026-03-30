import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { username, password, type } = req.body;
    let users = await kv.get('reycloud_users') || [];

    // AUTO SEED CREATOR
    const adminExist = users.find(u => u.username === 'ReyCloud');
    if (!adminExist) {
        users.push({ username: "ReyCloud", password: "Rey1903", role: "Creator", balance: 200000 });
        await kv.set('reycloud_users', users);
    }

    if (type === 'register') {
        if (users.find(u => u.username === username)) return res.json({ status: false, message: "Username exists!" });
        users.push({ username, password, role: "Member", balance: 0 });
        await kv.set('reycloud_users', users);
        return res.json({ status: true, message: "Register Success!" });
    }

    if (type === 'login') {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) return res.json({ status: true, user });
        return res.json({ status: false, message: "Wrong Credentials, Rey! 😈" });
    }
}
