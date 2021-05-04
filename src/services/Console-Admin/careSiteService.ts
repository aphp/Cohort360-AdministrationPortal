import axios from "../api"
import { BackendCareSite } from "types"

export const submitGetCareSites = async (): Promise<BackendCareSite[] | undefined> => {
    const caresiteResp = await axios.get(`/care-sites/limited/`)
    
    if (caresiteResp.status !== 200) {
        return undefined
    }

    return caresiteResp.data.results ?? undefined

}