// Scheduler Algo

// Global Vars
let employees = new Map();
let days = [0, 1, 2, 3, 4, 5, 6];
let currID = 1;

let shiftHours = {
    SL_morning: 7.25,
    TM_morning: 7,
    SL_night: 6.75,
    TM_night: 6.5,
    SL_FSmorning: 7.5,
    TM_FSmorning: 7.25,
    SL_FSnight: 7.5,
    TM_FSnight: 7.25
}


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


/**************************************
    autoScheduleTemplate 
***************************************/
/*
    Friday and Saturday are priority days (more busy)
    - loop and create shifts until total hours is filled
        - Add ShiftLead to every shift
        - Add one team member to each shift

*/
function autoScheduleTemplate(schedule, totalHours){
    currHours = 0;

    // function to add a shift
    function addShift(day, shift){
        // create keys to check for hours
        let slKey;
        let tmKey;
        if(day == 'Friday' || day == 'Saturday'){
            slKey = "SL_FS" + shift;
            tmKey = "TM_FS" + shift;
        }else{
            slKey = "SL_" + shift;
            tmKey = "TM_" + shift;
        }

        // add SL to shift
        if(schedule[day][shift].SL.length == 0){
            let hours = shiftHours[slKey];
            if(currHours + hours > totalHours){
                return false;
            }
            schedule[day][shift].SL.push({employees: null, hours});
            currHours += hours;
        }
        // add TM to shift
        let hours = shiftHours[tmKey];
        if(currHours + hours > totalHours){
            return false;
        }else{
            schedule[day][shift].TM.push({employees: null, hours});
            currHours += hours;
        }
        return true;
    }

    // create the schedule template
    for(let day in schedule){
        if(!addShift(day, "morning")) break;
        if(!addShift(day, "night")) break;
    }

    console.log("Template created. Amount of Hours filled = ", currHours);
    
}


/**************************************
   autoAssign Algorithm
***************************************/
function autoAssign(schedule, employees, totalHours)
{
    shuffleDays(days);
    // create two new arrays (one with TMs one with SLs)
    
    // Shuffle both arrays


    for(let i = 0; i < days.length; i++){
        const currentDay = days[i];
    }
}

//

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
function addEmployee(name, availability, preferredShift, amountOfShifts, role, currShiftNum){
    let currEmployee = {
        id: currID, 
        name: name, 
        availability: availability, 
        preferredShift: preferredShift,
        preferredAmountofShifts: amountOfShifts,
        role: role,
        currShiftNum: currShiftNum
    };
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

autoAssign(schedule, employees, 280);


function printFullSchedule() {
    for (let day in schedule) {
        console.log(day);
        for (let shift in schedule[day]) {
            console.log("  " + shift);
            for (let role in schedule[day][shift]) {
                let assignments = schedule[day][shift][role];
                console.log("    " + role + ": " + assignments.map(a => a.employees).join(", "));
            }
        }
    }
}



autoScheduleTemplate(schedule, 150);
printFullSchedule(schedule);
