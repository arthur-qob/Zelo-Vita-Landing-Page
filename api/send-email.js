module.exports = async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	const { firstName, lastName, email, phone, country, medication, message } =
		req.body

	if (!firstName || !lastName || !email || !country || !medication) {
		return res.status(400).json({ error: 'Missing required fields' })
	}

	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			from: 'Zelo Vita Landing Page <onboarding@resend.dev>',
			to: ['consultoriazelovitaim@gmail.com'],
			subject: `New Prospect Contact — ${firstName} ${lastName} (${medication})`,
			html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #5ED3E6;">Novo Contato de Prospect</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 8px 0; color: #666;">Nome</td><td style="padding: 8px 0; font-weight: bold;">${firstName} ${lastName}</td></tr>
                        <tr><td style="padding: 8px 0; color: #666;">E-mail</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
                        <tr><td style="padding: 8px 0; color: #666;">Telefone</td><td style="padding: 8px 0;">${phone || '—'}</td></tr>
                        <tr><td style="padding: 8px 0; color: #666;">País</td><td style="padding: 8px 0;">${country}</td></tr>
                        <tr><td style="padding: 8px 0; color: #666;">Medicamento(s)</td><td style="padding: 8px 0; font-weight: bold;">${medication}</td></tr>
                        <tr><td style="padding: 8px 0; color: #666; vertical-align: top;">Informações Adicionais</td><td style="padding: 8px 0;">${message || '—'}</td></tr>
                    </table>
                </div>
            `
		})
	})

	if (!response.ok) {
		const error = await response.json()
		console.error('Resend error:', JSON.stringify(error))
		return res.status(502).json({
			error: error.message ?? 'Failed to send email',
			details: error
		})
	}

	return res.status(200).json({ success: true })
}
