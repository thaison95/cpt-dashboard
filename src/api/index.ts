const apiUrl = import.meta.env.VITE_API_URL

export const tradersFetcher = async () =>
  await fetch(`${apiUrl}/traders`).then(response => response.json())
