import UserRepo from "../database/repository/UserRepo";
import moment from 'moment';

 const updateStageEveryWeek = async () => {
    const users = await UserRepo.findAll(); 
    for (const user of users) {
      const currentWeek = moment().diff(moment(user.createdAt), 'weeks');
      const newStage = Math.min(40, user.stage + currentWeek);
  
      if (newStage !== user.stage) {
        user.stage = newStage;
        await UserRepo.updateInfo(user);
      }
    }
  };
  
  setInterval(updateStageEveryWeek, 604800000); 
  export default updateStageEveryWeek;