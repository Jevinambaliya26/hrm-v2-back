const handler = require("../middleware/handler");
const connection = require("../lib/database/connect");
module.exports.getDepartmentMasterData = async (event) => {
    let { company_id } = event.pathParameters
    const data = await connection.query(
        `SELECT id, name as department_name
        FROM department_master where company_id = ${company_id}`
    );

    return handler.returner([true, data], 'Get company master data successfully!!', 200)
}