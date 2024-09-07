const mongoose = require('mongoose');
import 'dotenv/config';

export const connectDatabase = () => {
 mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
  })
  .then((data: { connection: { host: any } }) => {
   console.log(
    `mongod connected with server: ${data.connection.host}, ${process.env.MONGODB_CONNECTION_STRING}`,
   );
  });
};

//   module.exports = connectDatabase;
