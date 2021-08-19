//Total endpoints = 2
const axios = require("axios").default

const uri = process.env.API_URI_LOCAL

describe("testing shipping endpoints", async () => {
  // 1
  test("should create shipping", async () => {
    const res = await axios.post(`${uri}/shipping-create`, {
      id_order_shipping: 1,
      id_order: 2,
      os_company: "my company",
    })
    expect(res.status).toEqual(201)
  })

  // 2
  test("should update shipping", async () => {
    const res = await axios.post(`${uri}/shipping-update`)
    expect(res.status).toEqual(200)
  })
})
