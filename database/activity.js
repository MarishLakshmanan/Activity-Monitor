import * as SQLite from "expo-sqlite";
import { schedulePushNotification } from "../config/NotificationProvider";


function openDatabase() {
    if (Platform.OS === "web") {
    return {
        transaction: () => {
        return {
            executeSql: () => {},
        };
        },
    };
    }

    const db = SQLite.openDatabase("StudentDB");
    return db;
}
  
const db = openDatabase();

export function createActivity(){
    db.transaction((tx)=>{
        const query = "create TABLE if not EXISTS activity (id varchar(255), name varchar(255), description varchar(255), duration varchar(255), priority boolean,progress varchar(255),pause integer, start varchar(255),end varchar(255),completed boolean)"
        tx.executeSql(query)
    },(error)=>{
        console.log(error.message);
    },()=>{
        console.log("Created Tracker");
    })
}

export function insertActivity(activity){
    activity.duration = JSON.stringify(activity.duration)
    activity.progress = JSON.stringify(activity.progress)

    db.transaction((tx)=>{
        const query = "INSERT INTO activity VALUES (?,?,?,?,?,?,?,?,?,?)"
        tx.executeSql(query,[activity.id,activity.name,activity.description,activity.duration,activity.priority,activity.progress,activity.pause,activity.start,activity.end,activity.completed])
    },(error)=>{
        console.log(error);
    },()=>{
        if(activity.priority===true){
            insert(activity.id);
        }
        console.log("Inserted");
    })
}


export function updateActivityProgress(id,value){
    console.log("Progress");
    console.log(value);
    if(typeof value==="object"){
        value = JSON.stringify(value)
    }
    db.transaction((tx)=>{
        const query = `UPDATE activity SET progress=? WHERE id=?`
        tx.executeSql(query,[value,id])
    },(error)=>{
        console.log(error);
    },()=>{console.log("Updated");})
}


export function updateActivity(id,field,value){
    if(typeof value==="object"){
        value = value.toString();
    }
    db.transaction((tx)=>{
        const query = `UPDATE activity SET ${field}=? WHERE id=?`
        tx.executeSql(query,[value,id])
    },(error)=>{
        console.log(error);
    },()=>{
        if(field==="priority" && value==true){
            insert(id)
        }else{
            deleteTime(id)
        }
        console.log("Updated");
    })
}

export function updateActivityAll(id,activity){
    activity.duration = JSON.stringify(activity.duration)
    activity.progress = JSON.stringify(activity.progress)
    db.transaction((tx)=>{
        const query = `UPDATE activity SET name=?, description=?, duration=?, priority=?, progress=?, pause=?, start=?, end=? WHERE id=?`
        tx.executeSql(query,[activity.name,activity.description,activity.duration,activity.priority,activity.progress,activity.pause,activity.start,activity.end,id])
    },(error)=>{
        console.log(error);
    },()=>{console.log("Updated");})
}

function difference(a,b){
    const v1 = (a.duration.hour*60)+a.duration.min
    const v2 = (b.duration.hour*60)+b.duration.min
    return (v1<=v2)
}

export function getActivities(setActivities){
    db.transaction((tx)=>{
        const query = "SELECT * FROM activity"
        tx.executeSql(query,[],
            (_,{rows})=>{
                let arr = []
                rows._array.map((data)=>{
                    data.duration = JSON.parse(data.duration)
                    data.progress = JSON.parse(data.progress)
                    data.priority = (data.priority===1)
                    data.completed = (data.completed===1)
                    arr.push(data)
                })
                arr.sort(difference)
                setActivities(arr)
            }
        )
    },(error)=>{
        console.log(error.message);
        createActivity()
        getActivities(setActivities)
    },()=>{
        console.log("success");
    })
}



export function getActivitiesreturn(){
    db.transaction((tx)=>{
        const query = "SELECT * FROM activity"
        tx.executeSql(query,[],
            (_,{rows})=>{
                let arr = []
                rows._array.map((data)=>{
                    data.duration = JSON.parse(data.duration)
                    data.progress = JSON.parse(data.progress)
                    data.priority = (data.priority===1)
                    data.completed = (data.completed===1)
                    arr.push(data)
                })
                arr.sort(difference)
                return arr
            }
        )
    },(error)=>{
        console.log(error.message);
        createActivity()
        getActivitiesreturn()
    },()=>{
        console.log("success");
    })
}

export function deleteActivities(id){
    db.transaction((tx)=>{
        let query = "select * from activity where id=?";
        tx.executeSql(query,[id],
            (_,{rows})=>{
                let item = rows._array[0];
                console.log(item);
                if(item.priority===1){
                    deleteTime(id)
                }            
            }
        )
    },(error)=>{
        console.log(error.message);
    },()=>{
        db.transaction((tx)=>{
            let query = "DELETE FROM activity WHERE id=?"
            tx.executeSql(query,[id])
        })
    })
    
}

export function createTime(){
    db.transaction((tx)=>{
        let query = "create TABLE if not EXISTS time (id varchar(255),score int)"
        tx.executeSql(query)
        query = "select * from time";
        tx.executeSql(query,[],
            (_,{rows})=>{
                if(rows._array.length==0){
                    query = "insert into time values (1234,0)"
                    console.log("inserted time");
                    tx.executeSql(query)
                }               
            }
        )
    },(error)=>{
        console.log(error.message);
    },()=>{
        console.log("Created Time");
    })
}

export function getTime(setTime){
    let score = 0;
    db.transaction((tx)=>{
        let query = "Select * from time where id=1234"
        tx.executeSql(query,[],
            (_,{rows})=>{
                score = rows._array[0].score
            }
        )
    },(error)=>{
        console.log(error.message);
        createTime()
        getTime()
    },()=>{
        console.log("Get time");
        let remainingTime = ((24 - new Date().getHours())*60)+((60 - new Date().getMinutes()))+60
        console.log(remainingTime,score);
        if(remainingTime<=score){
            schedulePushNotification("Wake up!","You have activities set to complete and not enough time left",{},null)
        }
    })
}

export function setTime(time){
    console.log("set",time);
    db.transaction((tx)=>{
        let query = "update time set score=? where id=?";
        tx.executeSql(query,[time,"1234"])
    },(error)=>{
        console.log(error.message);
    },()=>{
        console.log("set time");
    })
}

function insert(id){
    db.transaction((tx)=>{
        let query = "Select * from activity where id=?"
        tx.executeSql(query,[id],
            (_,{rows})=>{
                let activity = rows._array[0]
                query = "Select * from time where id=1234"
                tx.executeSql(query,[],
                    (_,{rows})=>{
                        let score = (rows._array[0].score)
                        let duration = JSON.parse(activity.duration)
                        let h = ((duration.hour*60) + (duration.min))
                        setTime((score+h))
                    }
                )
                let duration = JSON.parse(activity.duration)
                let h = ((duration.hour*60) + (duration.min))
                setTime(h)
            }
        )
    },(error)=>{
        console.log(error.message);
        createTime()
        insert(id)
    },()=>{
        console.log("Insert time");
    })
    
}

function deleteTime(id){
    db.transaction((tx)=>{
        let query = "Select * from activity where id=?"
        tx.executeSql(query,[id],
            (_,{rows})=>{
                let activity = rows._array[0]
                query = "Select * from time where id=1234"
                tx.executeSql(query,[],
                    (_,{rows})=>{
                        let score = (rows._array[0].score)
                        let duration = JSON.parse(activity.duration)
                        let h = ((duration.hour*60) + (duration.min))
                        let v = score-h
                        if(v>0){
                            setTime((score-h))
                        }else{
                            setTime(0)
                        }
                    }
                )
            }
        )
    },(error)=>{
        console.log(error.message);
    },()=>{
        console.log("Updated time");
    })
}