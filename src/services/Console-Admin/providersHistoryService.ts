import api from '../api'
import { AxiosResponse } from 'axios'

// import { fakeResponse, generateFakeBackendUser, isCloseToSameDay, fakeResponseList } from "utils";
// import { Profile, BackendProfileReceived, BackendProfileToSend, PagedListResponse, MANUAL_CDM_SOURCE, HTTP_ERROR_BAD_REQUEST } from "types";
// import { NULL_START_DATE, NULL_END_DATE, FAKE_PROFILES, PROVIDER_SOURCE_VALUE_LENGTH, FAKE_USERS } from "../constants";
// import { HTTP_ERROR_NOT_FOUND, HTTP_SUCCESS_OK, HTTP_SUCCESS_CREATED, HTTP_ERROR_FORBIDDEN, HTTP_ERROR_CONFLICT } from "../types";
// import { buildPartialUser } from "./userService";

// const DEV_MODE = process.env.REACT_APP_IS_DEV === "1";

// export const submitCreateProfile = async (profile: Profile): Promise<AxiosResponse<any>> => {
//   const url = `${config.path.profiles}`;
//   const backProfileToSend = buildBackendProfileToSend(profile);
//   console.log(`Sending to: ${url}`, backProfileToSend);

//   if (DEV_MODE) {
//     return new Promise(resolve => {
//       let p: any;
//       if (FAKE_PROFILES.find(({cdm_source, provider_id}) => cdm_source===MANUAL_CDM_SOURCE && provider_id===backProfileToSend.provider_id)) {
//         resolve(fakeResponse({ message: `Provider ${backProfileToSend.provider_id} already has a manua profile`}, HTTP_ERROR_BAD_REQUEST))
//       }
//       try {
//         p = buildNewFakeProfile(backProfileToSend)
//       } catch (e) {
//         resolve(fakeResponse({ message: String(e) }, HTTP_ERROR_BAD_REQUEST))
//         return;
//       }
//       setTimeout(() => (
//         Math.random() > 0.9 ?
//           resolve(fakeResponse({ message: "" }, HTTP_ERROR_CONFLICT))
//           : resolve(fakeResponse(p, HTTP_SUCCESS_CREATED))
//       ), 1000);
//     });
//   }

//   return axios.post(url, backProfileToSend);
// };

// export const submitUpdateProfile = (profileId: string, partialProfile: Partial<Profile>): Promise<AxiosResponse<BackendProfileReceived>> => {
//   const url = `${config.path.profiles}${profileId}/`;
//   partialProfile = buildPartialBackendProfile(partialProfile);
//   console.log(`Updating at: ${url}`, partialProfile);

//   if (DEV_MODE) {
//     let p = FAKE_PROFILES.find(({ provider_history_id }) => provider_history_id.toString() === profileId);
//     return new Promise(resolve => {
//       setTimeout(() => (
//         (!p || Math.random() > 0.9) ?
//           (!p || Math.random() > 0.7 ?
//             resolve(fakeResponse({ message: `Profil non trouvé avec l'id ${profileId}` }, HTTP_ERROR_NOT_FOUND))
//             : resolve(fakeResponse({ message: "Modification refusée" }, HTTP_ERROR_FORBIDDEN))
//           )
//           : resolve(fakeResponse(_.assign(p, partialProfile), HTTP_SUCCESS_OK))
//       ), 1000);
//     });
//   }

//   return axios({
//     method: "patch",
//     url,
//     data: partialProfile,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
// };

// export type ProfileParams = {
//   providerHistoryId?: string;
//   providerId?: string;
//   providerSourceValue?: string;
//   providerName?: string;
//   lastName?: string;
//   firstName?: string;
//   page?: number;
//   ordering?: string[];
// }

// export const submitGetProfiles = ({
//   providerHistoryId,
//   providerId,
//   providerSourceValue,
//   providerName,
//   lastName,
//   firstName,
//   page,
//   ordering,
// }: ProfileParams): Promise<AxiosResponse<PagedListResponse<BackendProfileReceived>>> => {
//   let url = `${config.path.profiles}`;

//   const fieldParams = [
//     { name: "provider_history_id", value: providerHistoryId },
//     { name: "provider_id", value: providerId },
//     { name: "provider_source_value", value: providerSourceValue },
//     { name: "provider_name", value: providerName },
//     { name: "lastname", value: lastName },
//     { name: "firstname", value: firstName },
//   ]

//   const fullParams = [...fieldParams, { name: "page", value: page }, { name: "ordering", value: ordering?.join(",") }]
//     .filter(({ name: n, value: v }) => v !== undefined);
//   const toAdd = fullParams.map(({ name: n, value: v }) => `${n}=${v}`).join("&");

//   url = toAdd.length ? `${url}?${toAdd}` : url;
//   console.log(`Requesting to: ${url}`);

//   if (DEV_MODE) {
//     let toReturn = FAKE_PROFILES.filter((p) => (
//       fieldParams.every(({ name, value }) => value === undefined || (_.get(p, name) as string).indexOf(value.toString()) > -1)
//     ));
//     let totalCount = toReturn.length;
//     if (ordering) {
//       const frontToBack = {
//         providerHistoryId: "provider_history_id",
//         providerId: "provider_id",
//         providerSourceValue: "provider_source_value",
//         providerName: "provider_name",
//         lastName: "lastname",
//         firstName: "firstname",
//       }
//       const [backendOrdering, directions] = _.unzip(ordering
//         .filter((f) => _.get(frontToBack, f.replace("-", "")))
//         .map((f) => [_.get(frontToBack, f.replace("-", "")), f.startsWith("-") ? "desc" : "asc"])
//       );
//       toReturn = _.orderBy(toReturn, backendOrdering, directions);
//     }
//     let actual_page = page || 0;
//     toReturn = toReturn.length > actual_page * 50 ? toReturn.slice(actual_page * 50, (actual_page + 1) * 50) : toReturn;

//     return new Promise(resolve => {
//       setTimeout(() => (
//         Math.random() > 0.99 ?
//           resolve(fakeResponse({ message: "Accès refusé" }, HTTP_ERROR_FORBIDDEN))
//           : resolve(fakeResponse(fakeResponseList(toReturn, totalCount), HTTP_SUCCESS_OK))
//       ), 1000);
//     });
//   }

//   return axios.get(config.path.profiles,
//     {
//       params: fullParams.reduce((dct, { name, value }) => ({ ...dct, [name]: value }), {})
//     }
//   );
// };

export const submitGetProfile = async (profileId: string) => {
    const profileResp = await api.get(`/profiles/?provider_id=${profileId}`)

    if (profileResp.status !== 200){
        return undefined
    }

    return profileResp.data.results ?? undefined

//   if (DEV_MODE) {
//     let p = FAKE_PROFILES.find(({ provider_history_id }) => provider_history_id.toString() === profileId);
//     return new Promise(resolve => {
//       setTimeout(() => (
//         (!p || Math.random() > 0.9) ?
//           ((!p || Math.random() > 0.5) ?
//             resolve(fakeResponse({ message: `Profil non trouvé avec l'id ${profileId}` }, HTTP_ERROR_NOT_FOUND))
//             : resolve(fakeResponse({ message: "Requête refusée" }, HTTP_ERROR_FORBIDDEN))
//           )
//           : resolve(fakeResponse(p, HTTP_SUCCESS_OK))
//       ), 1000);
//     });
//   }
};

// export const buildProfile = (responseProfile: BackendProfileReceived): Profile => {
//   // if (!responseProfile.provider_id || !responseProfile.provider_source_value || !responseProfile.is_active) return null;
//   const startDate = responseProfile.actual_valid_start_datetime && new Date(responseProfile.actual_valid_start_datetime);
//   const endDate = responseProfile.actual_valid_end_datetime && new Date(responseProfile.actual_valid_end_datetime);
//   return {
//     providerId: responseProfile.provider_id,
//     profileId: responseProfile.provider_history_id,
//     providerName: responseProfile.provider_name,
//     firstName: responseProfile.firstname,
//     lastName: responseProfile.lastname,
//     email: responseProfile.email,
//     providerSourceValue: responseProfile.provider_source_value,
//     isActive: responseProfile.actual_is_active,
//     isValid: responseProfile.is_valid,
//     isMainAdmin: responseProfile.is_main_admin,
//     startDate: !startDate ? null : (isCloseToSameDay(NULL_START_DATE, startDate) ? null : startDate),
//     endDate: !endDate ? null : (isCloseToSameDay(NULL_END_DATE, endDate) ? null : endDate),
//     createdBy: responseProfile.created_by,
//     provider: buildPartialUser(responseProfile.provider),
//     birthDate: responseProfile.birth_date,
//     careSiteId: responseProfile.care_site_id,
//     source: responseProfile.cdm_source,
//     gender: responseProfile.gender_source_value,
//     specialtySourceValue: responseProfile.specialty_source_value,
//     yearOfBirth: responseProfile.year_of_birth,
//     dea: responseProfile.dea,
//     npi: responseProfile.npi,
//   }
// }

// export const buildBackendProfileToSend = (profile: Profile): BackendProfileToSend => {
//   // if (!user.provider_id || !user.provider_source_value || !user.is_active) return null;
//   return {
//     provider_id: profile.providerId,
//     provider_history_id: profile.profileId,
//     provider_name: profile.providerName,
//     firstname: profile.firstName,
//     lastname: profile.lastName,
//     email: profile.email,
//     provider_source_value: profile.providerSourceValue,
//     is_active: profile.isActive,
//     valid_start_datetime: profile.startDate,
//     valid_end_datetime: profile.endDate,
//     birth_date: profile.birthDate,
//     care_site_id: profile.careSiteId,
//     cdm_source: profile.source,
//     gender_source_value: profile.gender,
//     specialty_source_value: profile.specialtySourceValue,
//     year_of_birth: profile.yearOfBirth,
//     dea: profile.dea,
//     npi: profile.npi,
//   }
// }

// export const buildPartialBackendProfile = (profile: Partial<Profile>): Partial<BackendProfileToSend> => {
//   // if (!user.provider_id || !user.provider_source_value || !user.is_active) return null;
//   return _.pickBy({
//     provider_id: profile.providerId,
//     provider_history_id: profile.profileId,
//     provider_name: profile.providerName,
//     firstname: profile.firstName,
//     lastname: profile.lastName,
//     email: profile.email,
//     provider_source_value: profile.providerSourceValue,
//     is_active: profile.isActive,
//     valid_start_datetime: profile.startDate,
//     valid_end_datetime: profile.endDate,
//     birth_date: profile.birthDate,
//     care_site_id: profile.careSiteId,
//     cdm_source: profile.source,
//     gender_source_value: profile.gender,
//     specialty_source_value: profile.specialtySourceValue,
//     year_of_birth: profile.yearOfBirth,
//     dea: profile.dea,
//     npi: profile.npi,
//   }, _.identity);
// }

// export const buildNewFakeProfile = (beProfile: Partial<BackendProfileToSend>): Partial<BackendProfileReceived> => {
//   const { valid_end_datetime, valid_start_datetime, is_active } = beProfile;
//   if (!beProfile.email
//     || !beProfile.firstname
//     || !beProfile.lastname
//     || !beProfile.provider_source_value) throw new Error("You need at least firstname, lastname, email and provider_source_value for building a user");

//   return {
//     ...beProfile,
//     provider_history_id: Math.floor(Math.random() * 10 ** PROVIDER_SOURCE_VALUE_LENGTH),
//     cdm_source: MANUAL_CDM_SOURCE,
//     actual_valid_end_datetime: valid_end_datetime || null,
//     actual_valid_start_datetime: valid_start_datetime || null,
//     actual_is_active: is_active,
//     is_main_admin: false,
//     is_valid: (valid_start_datetime === null || valid_start_datetime === undefined || new Date() > valid_start_datetime)
//       && (valid_start_datetime === null || valid_start_datetime === undefined || new Date() < valid_start_datetime)
//       && is_active,
//     created_by: "",
//     provider: FAKE_USERS.find(({ provider_id }) => provider_id === beProfile.provider_id) || generateFakeBackendUser({
//       lastname: beProfile.lastname,
//       firstname: beProfile.firstname,
//       email: beProfile.email,
//       provider_source_value: beProfile.provider_source_value,
//     }),
//   };
// }
