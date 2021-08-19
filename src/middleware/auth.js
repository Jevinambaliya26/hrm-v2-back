const jwt = require('jsonwebtoken');

const handle = require('./handler');

const conn = require('../lib/database/connect');

const PRIVATE = "4f93ac9d10cb751b8c9c646bc9dbccb9";

module.exports.login = async (event) => {
    const {email, password} = JSON.parse(event.body);

    const employee = await conn.query(
        `SELECT * FROM employee WHERE email = '${email}' AND password = '${password}';`
    );

    if ( employee.length === 0 ) {        
        return handle.returner([false, ''], 'Email/Password incorrect', 401);
    }

    const token = jwt.sign({
        email,
    }, PRIVATE, {
        subject: employee[0].id.toString(),
        expiresIn: '1d',
    });

    return handle.returner([true, token], 'logged-in', 200);
}

module.exports.ensureAuthorized = async (event, next) => {
    const auth = JSON.stringify(event.headers.Authorization);

    if ( !auth ) {
        return handle.returner([false, ''], 'Unauthorized', 401);
    }

    const [, t] = auth.split(' ');
    const [token, ] = t.split("\"");
    
    try {
        var tok = jwt.verify(token, PRIVATE);
        
        event.user_id = tok.sub;
        
        return await next(event);
    } catch(err) {
        return handle.returner([false, ''], 'Unauthorized', 401);
    }
}
