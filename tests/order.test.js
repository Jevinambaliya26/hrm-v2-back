//Total endpoints = 2
//id_product_m2m_vendor is the required for this test.
const axios = require("axios").default

const { userOne, orderTwo } = require("./fixtures/data")
const { deleteOrderRecord, getOrderId } = require("./fixtures/actions")

const uri = process.env.API_URI_LOCAL

describe("tests order endpoints", () => {
    afterAll(async () => {
        const id_order = await getOrderId(orderTwo.pay)
        await deleteOrderRecord(id_order)
    })

    // 1
    test("should create order", async () => {
        const res = await axios.post(`${uri}/order_create`, {
            id_user: userOne.id_user,
            id_product_m2m_vendor: [65],
            paymentMethod: orderTwo.pay,
        })
        expect(res.status).toEqual(201)
    }, 10000)

    // 2
    test("should update order", async () => {
        const id_order = await getOrderId(orderTwo.pay)
        const res = await axios.put(`${uri}/order_update`, {
            id_user: userOne.id_user,
            id_order,
            id_order_status: 2,
        })
        expect(res.status).toEqual(201)
    })

    // 3
    test("should track order", async () => {
        const res = await axios.post(`${uri}/order_tracking`, {
            os_tracking_number: "88888888",
        })
        expect(res.status).toEqual(200)
    })
})
