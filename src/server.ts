import Logger from './core/Logger';
import app from './app'
const port = process.env.PORT || 3000;
app.listen(port, () => {
  Logger.info(`server running on port : ${port}`);
})
.on('error', (e) => Logger.error(e));