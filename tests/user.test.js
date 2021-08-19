//Total endpoints = ?
const axios = require("axios").default

const { deleteUser, getUserId, getUserToken } = require("./fixtures/actions")
const { userOne, userTwo } = require("./fixtures/data")
const uri = process.env.API_URI_LOCAL

describe("tests user endpoints", () => {
    afterAll(() => deleteUser())

    // 1
    test("should create new user", async () => {
        const res = await axios.post(`${uri}/user_create`, userTwo)
        expect(res.status).toEqual(201)
    })

    // 2
    test("should login user", async () => {
        const res = await axios.post(`${uri}/user_login`, {
            user_email: userTwo.user_email,
            user_password: userTwo.user_password,
        })
        expect(res.status).toEqual(201)
    }, 10000)

    // 4
    // test("should verify user email", async () => {
    //   const id_user = await getUserId(userTwo.user_first_name)
    //   const res = await axios.post(`${uri}/user_email_verify/${id_user}`)
    //   expect(res.status).toEqual(200)
    // })

    // 5
    // test("should get user access level", async () => {
    //   const res = await axios.post(`${uri}/user_access_level_get`, {
    //     user_email: "mejabidurotimi@gmail.com",
    //   })
    //   expect(res.status).toEqual(200)
    // })

    6
    test("should get user details", async () => {
        const id_user = await getUserId(userTwo.user_first_name)
        const res = await axios.get(`${uri}/user_details/${id_user}`)
        expect(res.status).toEqual(200)
    }, 10000)

    // 7
    // test("should get user full name", async () => {
    //   const res = await axios.get(`${uri}/user-first-last-get-all`)
    //   expect(res.status).toEqual(200)
    // })

    // 8
    test("should update user", async () => {
        const id_user = await getUserId(userTwo.user_first_name)
        const token = await getUserToken(userTwo.user_first_name)
        const res = await axios.put(`${uri}/user_update`, {
            id_user,
            token,
            user_password: userTwo.user_password,
            user_last_name: "Peter",
        })
        expect(res.status).toEqual(201)
    }, 10000)

    // 9
    test("should get user addresses", async () => {
        const id_user = await getUserId(userTwo.user_first_name)
        const res = await axios.get(`${uri}/user_addresses_get/${id_user}`)
        expect(res.status).toEqual(200)
    }, 10000)

    // 10
    test("should update user addresses", async () => {
        const id_user = await getUserId(userTwo.user_first_name)
        const token = await getUserToken(userTwo.user_first_name)
        const res = await axios.put(`${uri}/user_addresses_update`, {
            id_user,
            token,
            user_address_billing: "first street",
            user_address_shipping: "second street",
        })
        expect(res.status).toEqual(201)
    }, 10000)

    // 3
    test("should logout user", async () => {
        const token = await getUserToken(userTwo.user_first_name)
        const res = await axios.post(`${uri}/user_logout/`, {
            token,
        })
        expect(res.status).toEqual(201)
    }, 10000)
})
