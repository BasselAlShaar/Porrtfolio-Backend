import personal_infoRepository from "../../repositories/personal_info/personal_info.repository.js";

import type { 
    UpdatePersonalInfoData
} from "../../../types/personal_info/personal_info.js";

//get one
const getPersonalInfo = async () => {
    return personal_infoRepository.get();
}

//update
const updatePersonalInfo = async (
    data: UpdatePersonalInfoData
) => {
    return personal_infoRepository.update(data);
}

export default {
    getPersonalInfo,
    updatePersonalInfo
}