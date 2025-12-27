
export async function getActiveUser(token: string,date: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/active-users?year=${date}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
  const resData = await response.json()
  if (!response.ok) {
    throw new Error(resData.message || "Failed to get profile")
  }
  return resData
}


export async function getStats(token: string,) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
  const resData = await response.json()
  if (!response.ok) {
    throw new Error(resData.message || "Failed to get stats")
  }
  return resData
}
