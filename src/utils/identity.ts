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
        case 'classManager':
            file = classManagerRouter;
            break;
        case 'Directors':
            file = DirectorsRouter;
            break;
        case 'Operators':
            file = OperatorsRouter;
            break;
        default:
            file = dynamicRouter;
    };
    return file
}
