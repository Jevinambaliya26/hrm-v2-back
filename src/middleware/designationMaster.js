const handler = require("../middleware/handler");
const connection = require("../lib/database/connect");
module.exports.getDesignationMasterData = async (event) => {
    let { department_id } = event.pathParameters
    const data = await connection.query(
        `SELECT id, name as designation_name
        FROM designation_master where department_id = ${department_id}`
    );

    return handler.returner([true, data], 'Get company master data successfully!!', 200)
}