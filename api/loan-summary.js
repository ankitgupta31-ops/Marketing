export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ message: 'Method not allowed.' });
  }

  const panNumber = String(request.body?.panNumber || '').trim().toUpperCase();
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNumber)) {
    return response.status(400).json({ message: 'Enter a valid PAN number.' });
  }

  const authKey = process.env.ROOPYA_AUTH_KEY;
  if (!authKey) {
    return response.status(503).json({ message: 'Loan lookup is not configured.' });
  }

  try {
    const upstreamResponse = await fetch('https://api.roopya.money/api/v2/processing-fee/pan-loan-summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'domain_name': 'vridoracapital'
      },
      body: JSON.stringify({
        auth_key: authKey,
        api_code: 'CPLR019',
        panNumber
      })
    });

    const payload = await upstreamResponse.json();
    if (!upstreamResponse.ok) {
      return response.status(502).json({ message: 'The loan service could not complete the lookup.' });
    }

    return response.status(200).json(payload);
  } catch {
    return response.status(502).json({ message: 'Unable to reach the loan service. Please try again.' });
  }
}