// Scheduler Algo

// Global Vars
let employees = new Map();
let days = [0, 1, 2, 3, 4, 5, 6];
let currID = 1;

// schedules

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
    Monday: {morning: {SL: [], TM: []}, float: {TM: []}, night: {SL: [], TM: []} },
    Tuesday: { morning: {SL: [], TM: []}, float: {TM: []}, night: {SL: [], TM: []} },
    Wednesday: { morning: {SL: [], TM: []}, float: {TM: []}, night: {SL: [], TM: []} },
    Thursday: { morning: {SL: [], TM: []}, float: {TM: []}, night: {SL: [], TM: []} },
    Friday: { morning: {SL: [], TM: []}, float: {TM: []}, night: {SL: [], TM: []} },
    Saturday: { morning: {SL: [], TM: []}, float: {TM: []}, night: {SL: [], TM: []} },
    Sunday: { morning: {SL: [], TM: []}, float: {TM: []}, night: {SL: [], TM: []} }
};


/*
    Auto Scheduler Algorithm
*/
/*
    - Shuffle week days
    - While there are unassigned preferred shifts
        - shuffle employee list
        - each employee give preferred shift
    - 2nd pass 
        - shuffle employee list
        - assign based on availability and remaining hours
    Optional: Assign float shift only if extra labor is allowed
*/
function autoSchedule(schedule, employees, totalHours)
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
function assignShift(day, shift, role, id){
    let employee = employees.get(id);

    // check to see if employee is available that shift and day
    if (employee.availability[day][shift] == false){
        console.log("Not available for ", shift);
        return false;
    }
    // check if they already worked that day
    if (workingThatDay(day, id)){
        console.log("Already working this day");
        return false;
    }
    // check if they are SL and if theres already one on that shift
    if(role == "SL" && shift != "float" && schedule[day][shift].SL.length > 0){
        console.log("Already has Shift lead on shift");
        return false;
    }


    // add onto shift
    schedule[day][shift][role].push(id);
    console.log('Assigned ', employee.name, ' to shift ', day, ' ', shift, '.');

}

function workingThatDay(day, id){
    let shifts = schedule[day];
    for(let shiftName in shifts) {
        let roles = shifts[shiftName];
        for( let role in roles){
            if(roles[role].includes(id)){
                return true;
            }
        }
    }
    return false;
}


/*
    Employee Helpers
*/
// add employee to map
// {id, name, availability, preferredShift}
function addEmployee(name, availability, preferredShift){
    let currEmployee = {id: currID, name: name, availability: availability, preferredShift: preferredShift};
    employees.set(currID, currEmployee);

    currID++;

    return;
}

// removes employee from map
function removeEmployee(id){
    if(employees.has(id)){
        employees.delete(id);
    }
    return;
}

// Takes id and finds day and shift to update their availability to true or false
function editAvailability(id, day, shift, available){
     if(employees.has(id)){
        let currEmployee = employees.get(id);
        currEmployee.availability[day][shift] = available;
    }
    return;
}

// Helper to assign availabilities using true and false
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


/**************************************
    TESTING SCHEDULER FUNCTIONS
***************************************/

// Create some employees
addEmployee("Hannah Lee", {
    Monday: createAvailability(true, true, false),
    Tuesday: createAvailability(true, true, false),
    Wednesday: createAvailability(true, false, true),
    Thursday: createAvailability(true, true, false),
    Friday: createAvailability(true, false, true),
    Saturday: createAvailability(true, false, false),
    Sunday: createAvailability(false, false, false)
}, "morning");

addEmployee("John Doe", {
    Monday: createAvailability(true, true, true),
    Tuesday: createAvailability(true, true, true),
    Wednesday: createAvailability(true, true, true),
    Thursday: createAvailability(true, true, true),
    Friday: createAvailability(true, true, true),
    Saturday: createAvailability(true, true, true),
    Sunday: createAvailability(true, true, true)
}, "night");

addEmployee("Jane Smith", {
    Monday: createAvailability(true, true, true),
    Tuesday: createAvailability(false, true, true),
    Wednesday: createAvailability(true, true, true),
    Thursday: createAvailability(true, true, true),
    Friday: createAvailability(true, false, true),
    Saturday: createAvailability(true, false, true),
    Sunday: createAvailability(true, true, true)
}, "float");

// Assign shifts
console.log("\n--- Assign Shifts ---");
assignShift("Monday", "morning", "SL", 1);   // Hannah as SL morning
assignShift("Monday", "morning", "TM", 2);   // John as TM morning
assignShift("Monday", "float", "TM", 3);     // Jane as float
assignShift("Monday", "morning", "SL", 2);   // John trying to be SL morning (should fail)
assignShift("Monday", "float", "SL", 1);     // Hannah trying float SL (should fail)

// Check workingThatDay
console.log("\n--- Check Working That Day ---");
console.log("Hannah working Monday?", workingThatDay("Monday", 1)); // true
console.log("John working Monday?", workingThatDay("Monday", 2));   // true
console.log("Jane working Monday?", workingThatDay("Monday", 3));   // true
console.log("Hannah working Tuesday?", workingThatDay("Tuesday", 1)); // false

// Print schedule for Monday
console.log("\n--- Monday Schedule ---");
for (let shift in schedule.Monday) {
    console.log(shift, schedule.Monday[shift]);
}

// Edit availability and re-test
console.log("\n--- Edit Availability ---");
editAvailability(1, "Monday", "morning", false);
console.log("Hannah availability Monday morning:", employees.get(1).availability.Monday.morning);

// Try to assign again
console.log("\n--- Attempt Re-Assign ---");
assignShift("Monday", "morning", "SL", 1); // should fail

