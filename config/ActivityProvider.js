import React, { createContext, useContext, useEffect, useState } from 'react';
import { getActivities, getTime } from '../database/activity';

const ActivityContext = createContext();
const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [time,setTime] = useState(0)

  const get = async () => {
    getActivities(setActivities)

  };

  useEffect(() => {
    get()
  }, []);

  return (
    <ActivityContext.Provider value={{activities,setActivities}}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => useContext(ActivityContext);

export default ActivityProvider;