// Thin wrapper over POST https://order.li.fi/quote/request.
// Public endpoint, no auth, CORS-enabled — safe to call directly from the browser.

const ENDPOINT = 'https://order.li.fi/quote/request'

export async function fetchQuote(body, { signal } = {}) {
  const started = performance.now()
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(body),
    signal,
  })

  const elapsedMs = Math.round(performance.now() - started)
  const text = await res.text()
  let json
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    throw new ApiError(`Non-JSON response (${res.status}): ${text.slice(0, 240)}`, res.status, elapsedMs)
  }

  if (!res.ok) {
    const message = Array.isArray(json?.message) ? json.message.join('; ') : json?.message || res.statusText
    throw new ApiError(message || 'Request failed', res.status, elapsedMs, json)
  }

  return { data: json, elapsedMs, status: res.status }
}

export class ApiError extends Error {
  constructor(message, status, elapsedMs, body) {
    super(message)
    this.status = status
    this.elapsedMs = elapsedMs
    this.body = body
  }
}
