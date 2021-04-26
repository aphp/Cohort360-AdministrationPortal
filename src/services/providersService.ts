import axios, {AxiosResponse} from "axios"
import { BACK_API_URL } from "../constants"

export const submitGetProfiles = async () => {
    const baseURL = BACK_API_URL
    let url = `${baseURL}/providers/`

    const profiles = await axios.get(url)

    console.log(`profiles`, profiles)
    
    return profiles.data.results

}