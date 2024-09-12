const mongoose = require('mongoose');
import 'dotenv/config';

export const connectDatabase = () => {
 mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then((data: { connection: { host: any } }) => {
   console.log(
    `mongod connected with server`,
   );
  });
};

//   module.exports = connectDatabase;
