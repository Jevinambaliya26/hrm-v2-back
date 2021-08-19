//Total endpoints = 6
const axios = require("axios").default

const { userOne, productOne, productTwo, utils, vendorTwo } = require("./fixtures/data")

const {
    getProductId,
    getProductVendorId,
    grabProductVendorId,
    deleteProductRecord,
    getOrderProductId,
    getUserToken,
} = require("./fixtures/actions")

const uri = process.env.API_URI_LOCAL

describe("tests product endpoints", () => {
    afterAll(async () => {
        const id_product = await getProductId(productTwo.product_title)
        // const id_product_m2m_vendor = await getProductVendorId(id_product)
        const id_product_m2m_vendor = await grabProductVendorId()
        await deleteProductRecord(id_product, id_product_m2m_vendor)
    })

    // 1
    test("should get product categories", async () => {
        const res = await axios.get(`${uri}/categories_get`)
        expect(res.status).toEqual(200)
    }, 10000)

    //2
    test("should search product", async () => {
        const res = await axios.post(`${uri}/product_search/0`, {
            keyword: productOne.product_title,
        })
        expect(res.status).toEqual(200)
    }, 10000)

    //3
    test("should create new product", async () => {
        const res = await axios.post(`${uri}/product-create`, productTwo)
        expect(res.status).toEqual(201)
    }, 10000)

    // 4
    test("should get product", async () => {
        const id_product = await getProductId(productTwo.product_title)
        const res = await axios.get(`${uri}/product_get/${id_product}`)
        expect(res.status).toEqual(200)
    }, 10000)

    //5
    test("should get product details", async () => {
        const id_product = await getProductId(productTwo.product_title)
        const res = await axios.get(`${uri}/product_details_get/${id_product}`)
        expect(res.status).toEqual(200)
    }, 10000)

    // 6
    test("should create product review", async () => {
        const token = await getUserToken(userOne.user_first_name)
        const id_product_m2m_vendor = await grabProductVendorId()
        const data = {
            // id_product_m2m_vendor,
            id_product_m2m_vendor: 5,
            product_review: userOne.review,
            id_user: userOne.id_user,
            token,
        }

        const res = await axios.post(`${uri}/product_review_create`, data)
        expect(res.status).toEqual(201)
    }, 20000)
})
