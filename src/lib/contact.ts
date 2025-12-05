export async function getCOntact() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contracts?limit=3`, {
        headers: {
            "Content-Type": "application/json",
        },
    })
    const resData = await response.json()
    if (!response.ok) {
        throw new Error(resData.message || "Failed to get stats")
    }
    return resData
}
