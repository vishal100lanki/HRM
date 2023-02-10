
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Token from "../models/Token.js";
import message from "../../Traits/message.js";


var Authorization = function (req, res, next) {
    
    var token = req.headers.authorization;
    token = token?.split(' ')[1] || null;
    
    var msg = message.failed("Unable to Authorized User");

    if (!token) {
        return res.status(401).send(msg);
    };

    jwt.verify(token, 'thisismyprivatekeyforUsertoverify', async function (err, decoded) {
       
        
        if (err) {
            return res.status(401).send(msg) ;
        };

        
    
        const is_token = await Token.findOne({
            raw: true,
            where: {
            token_id: decoded.tid   
        }});

        if(!is_token)
        {
            return res.status(401).send(msg) ;
        }

        let user_id = is_token.user_id;

        const user = await User.findByPk(user_id);
        
        if(!user)
        {
            return res.status(401).send(msg) ;
        }
        req.user = user.dataValues;
        // console.log(req.user);
        req.token_id = decoded.tid ;
        next();
    });
}
  
export default  Authorization;



