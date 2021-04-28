import axios from "../api"

import { BackendCareSite, /*CareSite, /*CareSiteType*/ } from "types"

export const submitGetCareSites = async (): Promise<BackendCareSite> => {
    const caresiteResp = await axios.get(`/care-sites/`)
    
    if (caresiteResp.status !== 200) {
        return undefined
    }
    return caresiteResp.data.results ?? undefined
}

