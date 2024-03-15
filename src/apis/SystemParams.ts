import axios from 'axios';

const ERROR = 'An error occurred.';

export const upload = async (data: FormData) => {
    try {
        const response = await axios.post('/v1/uploads',data, {headers: { 'content-type': 'multipart/form-data' }});
        return response.data;
    } catch (error: any) {
        if (error?.response?.data?.error) {
            throw new Error(error?.response?.data?.error)
        }
        throw new Error(ERROR)
    }
}