import axios from "axios";


const getData = async (type , setter) => {
    await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/${type}`).then((res) => {
        setter(res.data)
    })
    .catch((err) => {
        console.log(err)
    })
}

export default getData