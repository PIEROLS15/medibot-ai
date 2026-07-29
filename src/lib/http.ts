export async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
    const response = await fetch(input, init)

    let body: unknown = null

    try {
        body = await response.json()
    } catch {
        body = null
    }

    if (!response.ok) {
        const message =
            typeof body === 'object' && body && ('message' in body || 'error' in body)
                ? String((body as { message?: unknown; error?: unknown }).message ?? (body as { error?: unknown }).error)
                : `Request failed with status ${response.status}`

        throw new Error(message)
    }

    return body as T
}

export async function safeJson(response: Response) {
    try {
        return await response.json()
    } catch {
        return await response.text()
    }
}
