export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

    const { amount, username, method } = req.body;
    const API_KEY = "9AwCqt0h99ArK0Jy7R5PYpP1FmdQ0SWN"; // Ambil di dashboard Pakasir
    const PROJECT_SLUG = "reyclouddev"; // Ganti dengan slug project Pakasirmu
    const ORDER_ID = "WEB-" + Date.now(); // Generate ID unik

    try {
        const response = await fetch(`https://app.pakasir.com/api/transactioncreate/${method || 'qris'}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                project: PROJECT_SLUG,
                order_id: ORDER_ID,
                amount: parseInt(amount),
                api_key: API_KEY
            })
        });

        const data = await response.json();
        
        if (data.payment) {
            res.status(200).json({ 
                status: true, 
                payment: data.payment,
                order_id: ORDER_ID 
            });
        } else {
            res.status(400).json({ status: false, message: "Gagal buat invoice!" });
        }
    } catch (e) {
        res.status(500).json({ status: false, message: "Server Error" });
    }
}
