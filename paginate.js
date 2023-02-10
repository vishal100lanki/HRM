//Pagination

import { TokenExpiredError } from "jsonwebtoken";
async function paginate(req, res){

    let limit = 5;   
    let offset = 0;
    User.findAndCountAll()
    .then((data) => {
      let page = req.query.page;      
      let pages = Math.ceil(data.count / limit);
          offset = limit * (page - 1);     
      User.findAll({
        attributes: ['id', 'name', 'gender', 'email','password','date_of_birth', 'role_id','date_of_birth','designation_id','active_status'],
        limit: limit,
        offset: offset,
        $sort: { id: 1 }
        
      })
      .then((users) => {
        res.json(message.success("Paginated Data",{'result': users, 'count': data.count, 'pages': pages}));
      });
    })
    .catch(function (error) {
          res.json(message.failed('Internal Server Error'));
      });
  };
 

  export default {paginate}
