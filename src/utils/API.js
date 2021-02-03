import axios from "./axios"

export const getAllCategories = async () => {
    try {
        const categories = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/categories`)
        return categories.data
    } catch (err) {
        console.warn("err in getAllCategories", err)
    }
}

export const addCategories = async categoryName => {
    try {
        return await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/categories`, { name: categoryName })
    } catch (err) {
        console.warn("AddCategories", err)
    }
}

export const deleteCategories = async categoryId => {
    try {
        return await axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/categories/${categoryId}`)
    } catch (err) {
        console.warn("AddCategories", err)
    }
}