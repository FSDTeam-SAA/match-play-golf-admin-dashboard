import { getActiveUser, getStats } from "@/lib/dashboard"
import { useQuery } from "@tanstack/react-query"
import { AdminDashboardResponse, MonthlyActiveUsersResponse } from "../../types/activeUserData"
import { getCOntact } from "@/lib/contact"
import { ContractsResponse } from "../../types/contact"

export function useActiveUser(token: string | undefined,date: string) {
    return useQuery<MonthlyActiveUsersResponse>({
        queryKey: ["active-user",date],
        queryFn: () => {
            if (!token) throw new Error("Token is missing")
            return getActiveUser(token,date)
        },
        enabled: !!token,
    })
}

export function useStats(token: string | undefined) {
    return useQuery<AdminDashboardResponse>({
        queryKey: ["stats"],
        queryFn: () => {
            if (!token) throw new Error("Token is missing")
            return getStats(token)
        },
        enabled: !!token,
    })
}

export function useContact() {
    return useQuery<ContractsResponse>({
        queryKey: ["contact"],
        queryFn: () => {
            return getCOntact()
        },
    })
}