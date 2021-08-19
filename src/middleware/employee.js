const handler = require("../middleware/handler");

const db = require("../lib/database/query")
const connection = require("../lib/database/connect");
const {
    ensureAuthorized
} = require("./auth");

const getEmployeePermissionHandler = async (event) => {
    const employee_id = event.user_id;

    const data = await connection.query(
        `SELECT 
        cm.name AS company_name,
        dm.name AS department_name,
        desMast.name AS designation,
        em.* FROM employee em
        LEFT JOIN company_master cm ON cm.id = em.company_id
        LEFT JOIN department_master dm ON dm.id  =  em.department_id
        LEFT JOIN designation_master desMast ON desMast.id = em.designation_id
        WHERE em.id = '${employee_id}'`
    );

    if (data.length === 0) {
        return handler.returner([false, ''], 'Internal server error.', 500);
    }

    for (let ele of data) {
        const permission = await connection.query(`
            select mm.name,mm.type,mpm.* from module_permission_master mpm 
            LEFT JOIN module_master mm ON mm.id = mpm.module_id
            where mpm.employee_id =  ${ele.id}
        `);

        if ( permission.length === 0 ) {
            return handler.returner([false, ''], 'Internal server error.', 500);
        }

        ele.module_permission = permission;
    }

    console.log(data[0]);
    return handler.returner([true, data[0]], 'Employee permissions data', 200);
}

module.exports.getEmployeePermission = async (event) => {
    return await ensureAuthorized(event, getEmployeePermissionHandler);
}

const getEmployeeHandler = async (event) => {
    try {
        const employee_id = event.user_id;
    
        const emp = await db.search_one("employee", 'id', employee_id);
        if (emp.length === 0) {
            return handler.returner([false, ''], 'Internal server error', 500)
        }
    
        return handler.returner([true, emp[0]], 'Single employee data!!', 200)
    } catch (error) {
        return handler.returner([false, error], 'Internal server errors', 500)
    }
}

// Checking auth token
module.exports.getEmployee = async (event) => {
    return await ensureAuthorized(event, getEmployeeHandler);
}

module.exports.createEmployee = async (event) => {
    try{ 
        let reqBody = JSON.parse(event.body)
        let empBody = {}
        empBody.first_name = reqBody.first_name
        empBody.employee_id = reqBody.employee_id
        empBody.last_name = reqBody.last_name
        empBody.user_name = reqBody.user_name
        empBody.email = reqBody.email
        empBody.password = reqBody.password
        empBody.joining_date = reqBody.joining_date
        empBody.phone = reqBody.phone
        empBody.company_id = reqBody.company_id
        empBody.department_id = reqBody.department_id
        empBody.designation_id = reqBody.designation_id
        empBody.is_active = true
        empBody.roll_id = 1
        empBody.created_by = 1
        empBody.updated_by = 1
        const data =  await db.insert_new(empBody, "employee")
        for(let permission of reqBody.module_permission){
            let permissonObject = {}
            permissonObject.module_id = permission.module_id
            permissonObject.employee_id = data.insertId
            permissonObject.read = permission.read
            permissonObject.update = permission.update
            permissonObject.delete = permission.delete
            permissonObject.import = permission.import
            permissonObject.export = permission.export
            permissonObject.is_active = true
            permissonObject.created_by = 1
            permissonObject.updated_by = 1
            await db.insert_new(permissonObject, "module_permission_master")
        }
        return handler.returner([true, data], 'Employee created successfully!!', 200)
    }catch(error){
        return handler.returner([false, error], 'Something went wrong', 500)
    }
}


module.exports.getEmployeeList = async () => {
    const data = await connection.query(
        `select em.id, em.first_name, em.last_name, em.user_name,
        dm.name AS designation
        FROM employee em
        LEFT JOIN designation_master dm ON dm.id = em.designation_id`
    );

    if ( data.length === 0 ) {
        return handler.returner([false, ''], 'Internal server error.', 500);
    }

    return handler.returner([true, data], "Get employee list successfully!!", 200)
}

module.exports.getEmployeeEditData = async (event) => {
    let { id } = event.pathParameters

    const data = await connection.query(`select 
    cm.name as company_name,
    dm.name as department_name,
    desMast.name as designation,
    em.* from employee em
    LEFT JOIN company_master cm on cm.id = em.company_id
    LEFT JOIN department_master dm ON dm.id  =  em.department_id
    LEFT JOIN designation_master desMast on desMast.id = em.designation_id
    where em.id = ${id}
    `)
    const permisson =
        await connection.query(`select mm.name,mm.type,mpm.* from module_permission_master mpm 
    LEFT JOIN module_master mm ON mm.id = mpm.module_id
    where mpm.employee_id = ${id}`)
    if (data && data.length > 0) data[0].module_permission = permisson
    return handler.returner([true, data[0]], "Get edit employee details", 200)
}

module.exports.deleteEmployeeData = async (event)=>{
    let { id } = event.pathParameters
    try{
        let data = await connection.query(`update prod.employee set is_active = false where id = ${id}`);
        return handler.returner([true,data], 'Employee deleted successfully!!', 200)
    }catch(error){
        return handler.returner([false, error], 'Something went wrong', 500)

    }
}