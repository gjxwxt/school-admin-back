const dynamicRouter = require("../json/dynamicRouter.js");
const classManagerRouter = require("../json/classManagerRouter.js");
const DirectorsRouter = require("../json/DirectorsRouter.js");
const OperatorsRouter = require("../json/OperatorsRouter.js");

export async function getIdentityMenu(identity): Promise<object> {
    let file: {};
    switch (identity){
        case 'admin':
            file = dynamicRouter;
            break;
        case 'operator':
            file = dynamicRouter;
            break;
        case 'campus_admin':
            file = OperatorsRouter;
            break;
        case 'campus_operator':
            file = OperatorsRouter;
            break;
        default:
            file = dynamicRouter;
    };
    return file
}
