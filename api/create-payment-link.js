const loanIdentifierKeys = ['loanid', 'loanaccountid', 'loanaccountnumber', 'loanaccountno', 'loandtlsid', 'accountnumber', 'loanreference', 'loanref', 'applicationid'];

function collectLoanRecords(value, records = [], seen = new Set()) {
  if (!value || typeof value !== 'object') return records;
  if (Array.isArray(value)) {
    value.forEach((item) => {
      collectLoanRecords(item, records, seen);
    });
    return records;
  }
  const hasLoanIdentifier = Object.entries(value).some(([key, child]) => loanIdentifierKeys.includes(key.toLowerCase().replace(/[^a-z0-9]/g, '')) && child != null && typeof child !== 'object');
  if (hasLoanIdentifier && !seen.has(value)) {
    seen.add(value);
    records.push(value);
  }
  Object.values(value).forEach((item) => collectLoanRecords(item, records, seen));
  return records;
}

function findField(record, acceptedKeys) {
  if (!record || typeof record !== 'object') return undefined;
  for (const [key, value] of Object.entries(record)) {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (acceptedKeys.includes(normalizedKey) && value != null && typeof value !== 'object') return value;
  }
  for (const value of Object.values(record)) {
    const nestedValue = findField(value, acceptedKeys);
    if (nestedValue !== undefined) return nestedValue;
  }
  return undefined;
}

function findPaymentUrl(value) {
  if (!value || typeof value !== 'object') return '';
  for (const [key, child] of Object.entries(value)) {
    if (/payment.?(link|url)|redirect.?url|short.?url|^url$/i.test(key) && typeof child === 'string' && /^https:\/\//i.test(child)) return child;
    const nestedUrl = findPaymentUrl(child);
    if (nestedUrl) return nestedUrl;
  }
  return '';
}

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ message: 'Method not allowed.' });
  }

  const panNumber = String(request.body?.panNumber || '').trim().toUpperCase();
  const loanIdentifier = String(request.body?.loanIdentifier || '').trim();
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNumber) || !loanIdentifier) {
    return response.status(400).json({ message: 'A valid PAN and selected loan are required.' });
  }

  const authKey = process.env.ROOPYA_AUTH_KEY;
  if (!authKey) return response.status(503).json({ message: 'Payment service is not configured.' });

  try {
    const summaryResponse = await fetch('https://api.roopya.money/api/v2/processing-fee/pan-loan-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'domain_name': 'vridoracapital' },
      body: JSON.stringify({ auth_key: authKey, api_code: 'CPLR019', panNumber })
    });
    if (!summaryResponse.ok) return response.status(502).json({ message: 'Could not verify the selected loan.' });

    const summary = await summaryResponse.json();
    const loan = collectLoanRecords(summary).find((item) => String(findField(item, loanIdentifierKeys) ?? '') === loanIdentifier);
    if (!loan) return response.status(404).json({ message: 'The selected loan could not be verified. Search again and retry.' });

    const contactId = findField(loan, ['contactid']);
    const leadId = findField(loan, ['leadid']);
    const amount = Number(loan.upcoming_emi?.amount);
    const pipelineId = Number(loan.pipeline_id || process.env.ROOPYA_PIPELINE_ID || 2094);
    if (!contactId || !leadId || !Number.isFinite(amount) || amount <= 0) {
      return response.status(422).json({ message: 'Required payment details were not returned for this loan. Please contact support.' });
    }
    if (!Number.isSafeInteger(pipelineId) || pipelineId <= 0) {
      return response.status(422).json({ message: 'The payment pipeline is not configured correctly.' });
    }

    const paymentResponse = await fetch('https://api.roopya.money/api/v2/processing-fee/create-paymentLink-partner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'domain_name': 'vridoracapital' },
      body: JSON.stringify({
        auth_key: authKey,
        api_code: 'CPLR019',
        amount,
        contact_id: contactId,
        lead_id: leadId,
        pipeline_id: pipelineId,
        description: 'emi payment',
        reason: 'emi payment',
        payment_type: 'payment_link'
      })
    });

    const paymentPayload = await paymentResponse.json();
    const paymentUrl = findPaymentUrl(paymentPayload);
    if (!paymentResponse.ok || !paymentUrl) return response.status(502).json({ message: 'The payment service did not return a usable payment link.' });
    return response.status(200).json({ paymentUrl });
  } catch {
    return response.status(502).json({ message: 'Unable to reach the payment service. Please try again.' });
  }
}