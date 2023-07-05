import Logger from './core/logger';
import app from './app';
import cron from 'node-cron';
import updateStageEveryWeek from './helpers/scheduler';

const port = process.env.PORT_ADOT || 3000;

cron.schedule('0 0 * * 0', updateStageEveryWeek);

app.listen(port, () => {
  Logger.info(`server running on port : ${port}`);
})
.on('error', (e) => Logger.error(e));