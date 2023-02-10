import  Sequelize  from "sequelize" ;    

const sequelize = new Sequelize ("teqo", "root", "" , {
    host: 'localhost',
    dialect: 'mysql',
    logging:false,
    // logging: (qry) => {
    //   console.log(qry);
    // }
});

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  
  export default sequelize;
  
  