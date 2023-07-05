import { createLogger, transports, format } from 'winston';
import { environment } from '../config';

const logLevel = environment === 'development' ? 'debug' : 'warn';

export default createLogger({
  transports: [
    new transports.Console({
      level: logLevel,
      format: format.combine(
        format.errors({ stack: true }),
        format.prettyPrint(),
      ),
    }),
  ],
  exceptionHandlers: [
    new transports.Console({
      level: 'error',
      format: format.combine(
        format.errors({ stack: true }),
        format.prettyPrint(),
      ),
    }),
  ],
  exitOnError: false, // do not exit on handled exceptions
});
