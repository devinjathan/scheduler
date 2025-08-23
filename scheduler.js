// Scheduler Algo

// Global Vars
let employees = new Map();
let days = [0, 1, 2, 3, 4, 5, 6];
let currID = 1;

// schedules
// let shiftTemplate = [
//     {name: wdMorningSL, role: SL, start:"11:00", end:"18:15"},
//     {name: wdMorningTM, role: TM, start:"11:15", end:"18:15"},
//     {name: wdNightSL, role:SL, start:"05:15", end:"00:00"},
//     {name: wdNightTM, role:TM, start:"05:30", end:"00:00"},
//     //wknd
//     {name: wndMorningSL, role: SL, start:"11:00", end:"18:30"},
//     {name: wndMorningTM, role: TM, start:"11:15", end:"18:30"},
//     {name: wndNightSL, role: SL, start:"05:30", end:"01:00"},
//     {name: wndNightTM, role: TM, start:"05:45", end:"01:00"},
// ];

// let schedule = [
//     {day: "Monday", role: "SL", start: "11:00", end: "18:15", employee: null},
//     {day: "Monday", role: "TM", start: "11:15", end: "18:15", employee: null},
//     {day: "Monday", role: "SL", start: "17:15", end: "00:00", employee: null},
//     {day: "Monday", role: "TM", start: "17:30", end: "00:00", employee: null},
//     {day: "Monday", role: "TM", start: "17:30", end: "00:00", employee: null},

//     {day: "Tuesday", role: "SL", start: "11:00", end: "18:15", employee: null},
//     {day: "Tuesday", role: "TM", start: "11:15", end: "18:15", employee: null},
//     {day: "Tuesday", role: "SL", start: "17:15", end: "00:00", employee: null},
//     {day: "Tuesday", role: "TM", start: "17:30", end: "00:00", employee: null},
//     {day: "Tuesday", role: "TM", start: "17:30", end: "00:00", employee: null},

//     {day: "Wednsday", role: "SL", start: "11:00", end: "18:15", employee: null},
//     {day: "Wednsday", role: "TM", start: "11:15", end: "18:15", employee: null},
//     {day: "Wednsday", role: "SL", start: "17:15", end: "00:00", employee: null},
//     {day: "Wednsday", role: "TM", start: "17:30", end: "00:00", employee: null},
//     {day: "Wednsday", role: "TM", start: "17:30", end: "00:00", employee: null},

//     {day: "Thursday", role: "SL", start: "11:00", end: "18:15", employee: null},
//     {day: "Thursday", role: "TM", start: "11:15", end: "18:15", employee: null},
//     {day: "Thursday", role: "SL", start: "17:15", end: "00:00", employee: null},
//     {day: "Thursday", role: "TM", start: "17:30", end: "00:00", employee: null},
//     {day: "Thursday", role: "TM", start: "17:30", end: "00:00", employee: null},

//     {day: "Friday", role: "SL", start: "11:00", end: "18:15", employee: null},
//     {day: "Friday", role: "TM", start: "11:15", end: "18:15", employee: null},
//     {day: "Friday", role: "TM", start: "11:15", end: "18:15", employee: null},
//     {day: "Friday", role: "SL", start: "17:30", end: "01:00", employee: null},
//     {day: "Friday", role: "TM", start: "17:45", end: "01:00", employee: null},
//     {day: "Friday", role: "TM", start: "17:45", end: "01:00", employee: null},

//     {day: "Saturday", role: "SL", start: "11:00", end: "18:15", employee: null},
//     {day: "Saturday", role: "TM", start: "11:15", end: "18:15", employee: null},
//     {day: "Saturday", role: "TM", start: "11:15", end: "18:15", employee: null},
//     {day: "Saturday", role: "SL", start: "17:30", end: "01:00", employee: null},
//     {day: "Saturday", role: "TM", start: "17:45", end: "01:00", employee: null},
//     {day: "Saturday", role: "TM", start: "17:45", end: "01:00", employee: null},

//     {day: "Sunday", role: "SL", start: "11:00", end: "18:15", employee: null},
//     {day: "Sunday", role: "TM", start: "11:15", end: "18:15", employee: null},
//     {day: "Sunday", role: "SL", start: "17:15", end: "00:00", employee: null},
//     {day: "Sunday", role: "TM", start: "17:30", end: "00:00", employee: null},
//     {day: "Sunday", role: "TM", start: "17:30", end: "00:00", employee: null},

// ];

let schedule = {
    Monday: { morning: [], floater: [], night: [] },
    Tuesday: { morning: [], floater: [], night: [] },
    Wednsday: { morning: [], floater: [], night: [] },
    Thursday: { morning: [], floater: [], night: [] },
    Friday: { morning: [], floater: [], night: [] },
    Satday: { morning: [], floater: [], night: [] },
    Sunday: { morning: [], floater: [], night: [] }
};


/*
    Scheduler Algorithm
*/
function runSchedule(schedule, employees)
{
    shuffleDays(days);
    for(let i = 0; i < days.length; i++){
        const currentDay = days[i];

    }
}

/**************************************
    Helper Functions
***************************************/

/*
    Shuffle days using Fisher-Yates Shuffle
*/
function shuffleDays(arr){
    for(let i = arr.length - 1; i > 0; i--){
        const random = Math.floor(Math.random() * (i+1));

        [arr[i], arr[random]] = [arr[random], arr[i]];
    }
}

/*
    Assign Shift
*/
function assignShift(day, shift, role, employee){
    
}

/*
    Employee Helpers
*/
function addEmployee(name, availability, preferredShift){
    let currEmployee = {id: currID, name: name, availability: availability, preferredShift: preferredShift};
    employees.set(currID, currEmployee);

    currID++;

    return;
}

function removeEmployee(id){
    if(employees.has(id)){
        employees.delete(id);
    }
    return;
}

// Takes id and finds day and shift to update their availability to true or false
// id - int
// day - string
// shift - string
// available - bool
function editAvailability(id, day, shift, available){
     if(employees.has(id)){
        let currEmployee = employees.get(id);
        currEmployee.availability[day][shift] = available;
    }
    return;
}

function createAvailability(morning, float, night){
    return{
        morning: morning,
        float: float,
        night: night
    }
}


/**************************************
    Manual Scheduler
***************************************/


addEmployee("Hannah Lee", {
    Monday:    createAvailability(true, true, false),
    Tuesday:   createAvailability(true, true, false),
    Wednesday: createAvailability(true, false, true),
    Thursday:  createAvailability(true, true, false),
    Friday:    createAvailability(true, false, true),
    Saturday:  createAvailability(true, false, false),
    Sunday:    createAvailability(false, false, false)
}, "mid");

console.log("===== Current Employees =====");
for (let [id, emp] of employees) {
    console.log(`${emp.name} (ID: ${id})`);
    for (let day in emp.availability) {
        console.log(`  ${day}: ${JSON.stringify(emp.availability[day])}`);
    }
    console.log(`  Preferred Shift: ${emp.preferredShift}`);
}
