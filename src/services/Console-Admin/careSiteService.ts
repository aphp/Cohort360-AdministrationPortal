import axios from "../api"
import { BackendCareSite } from "types"

export const getCareSites = async (): Promise<BackendCareSite[] | undefined> => {
    const caresiteResp = await axios.get(`/care-sites/limited/`)
    
    if (caresiteResp.status !== 200) {
        return undefined
    }

    return caresiteResp.data.results ?? undefined

}

export const getManageableCareSites = async (): Promise<BackendCareSite[] | undefined> => {
    const manageableCareSitesResp = await axios.get(`/care-sites/manageable/`)

    if (manageableCareSitesResp.status !== 200){
        return undefined
    }

    return manageableCareSitesResp.data.results ?? undefined
}