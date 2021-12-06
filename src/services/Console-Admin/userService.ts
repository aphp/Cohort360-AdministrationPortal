import { BackendUserReceived, MeState, UserRole } from 'types'

export const buildPartialUser = (responseProvider: BackendUserReceived, userRights: UserRole): MeState => {
  return {
    providerId: responseProvider.provider_id ?? 0,
    firstName: responseProvider.firstname ?? null,
    lastName: responseProvider.lastname ?? null,
    email: responseProvider.email ?? null,
    providerSourceValue: responseProvider.provider_source_value ?? '',
    yearOfBirth: responseProvider.year_of_birth ?? null,
    displayName: responseProvider.displayed_name ?? null,
    userRights: userRights
  }
}
