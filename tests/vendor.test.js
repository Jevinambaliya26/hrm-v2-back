//Total tests = 3
const axios = require("axios").default

const { getVendorId, deleteVendorRecord } = require("./fixtures/actions")

const { vendorTwo, userOne, utils } = require("./fixtures/data")

const uri = process.env.API_URI_LOCAL

describe("testing vendor endpoints", async () => {
  afterAll(async () => {
    //creates new vendor and delete at the end
    const target = await getVendorId()
    deleteVendorRecord(target)
  })

  // 1
  test("should create new vendor", async () => {
    const res = await axios.post(`${uri}/vendor_create`, vendorTwo)
    expect(res.status).toEqual(201)
  })

  //2
  test("should create vendor review", async () => {
    const res = await axios.post(`${uri}/vendor_review_create`, {
      id_user: userOne.id_user,
      id_product_m2m_vendor: utils.id_product_m2m_vendor,
      vendor_review: utils.review,
      token: utils.token,
    })
  })
})
