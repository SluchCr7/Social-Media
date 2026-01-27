import api from "./api";

const getData = async (type, setter) => {
    try {
        const res = await api.get(`/${type}`);
        if (typeof setter === 'function') {
            setter(res.data);
        }
        return res.data;
    } catch (err) {
        console.error(`Error fetching ${type}:`, err);
    }
};

export default getData;