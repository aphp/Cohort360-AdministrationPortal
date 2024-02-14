import api from 'services/api'
import { User, MeState, Order, UserRole } from 'types'

export const getUsers = async (order: Order, page?: number, searchInput?: string) => {
  const searchFilter = searchInput ? `&search=${searchInput}` : ''

  // TODO: mettre reducer au lieu des &
  const usersResp = await api.get(
    `/users/?manual_only=true&page=${page}&ordering=${order.orderDirection === 'desc' ? '-' : ''}${
      order.orderBy
    }${searchFilter}`
  )

  if (usersResp.status !== 200) {
    return {
      users: undefined,
      total: 0
    }
  }

  return {
    users: usersResp.data.results ?? undefined,
    total: usersResp.data.count ?? 0
  }
}

export const getUser = async (username: string) => {
  try {
    const userResp = await api.get(`/users/${username}/`)

    return userResp.data ?? undefined
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur", error)
  }
}

export const buildPartialUser = (user: User, userRights: UserRole): MeState => {
  return {
    username: user.username ?? '',
    firstName: user.firstname ?? null,
    lastName: user.lastname ?? null,
    email: user.email ?? null,
    displayName: user.display_name ?? null,
    userRights: userRights
  }
}