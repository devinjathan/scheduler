// Scheduler Algo

// Global Vars

/*
    Employees item structure:
    id:
    name: FirstName LastName,
    availability: days they can work,
    preferredShift: preferred shift of either "morning" or "night",
    preferredAmountofShifts: amount of days/shifts in a week,
    role: Shift Lead "SL" or Team Member "TM",
    currShiftNum: counter for current amount of shifts in week
*/
let employees = new Map();

let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
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
function autoScheduleTemplate(schedule, totalHours, priorityShifts){
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
        if(schedule[day][shift].SL.length === 0){
            let hours = shiftHours[slKey];
            if(currHours + hours > totalHours){
                return false;
            }
            schedule[day][shift].SL.push({employees: null, hours});
            //schedule[day][shift].push(SL: [employees: null, hours]);
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
        console.log(day);
        if(!addShift(day, "morning")) break;
        if(!addShift(day, "night")) break;
    }
    // loop through priority days until all priority days are full
    for(let ps of priorityShifts){
        if(!addShift(ps.day, ps.shift)){
            break;
        }
    }

    // after priority days add floaters WIP
    

    console.log("Template created. Amount of Hours filled = ", currHours);
    schedule.totalAssignedHours = currHours;
}


/**************************************
   autoAssign Algorithm
***************************************/
function autoAssign(schedule, employees)
{
    shuffle(days);
    console.log(days);
    // create two new arrays (one with TMs one with SLs)
    let shiftLeads = Array.from(employees.entries()).filter(([id, emp]) => emp.role === "SL").map(([id, emp]) => id);
    console.log("Shift Leads IDs:", shiftLeads);
    let teamMembers = Array.from(employees.entries()).filter(([id, emp]) => emp.role === "TM").map(([id, emp]) => id);
    console.log("Team Members IDs:", teamMembers);
    let wholeCrew = Array.from(employees.keys());


    // Phase 1: Assign all shift lead shifts
    for(let day of days){
        for(let currShift in schedule[day]){
            if(!(schedule[day][currShift].SL)) continue;
            schedule[day][currShift].SL.forEach(spot =>{
                if(spot.employees === null){
                    let bestID = bestCandidate(shiftLeads, day, currShift);
                    console.log(bestID);
                    if(bestID !== null){
                        assignShift(day, currShift, "SL", bestID);
                    }
                }
            })
        }
    }

    //Phase 2: Assign each team member 1 day
    for(let day of days){
        for(let currShift in schedule[day]){
            schedule[day][currShift].TM.forEach(spot =>{
                if(spot.employees === null){
                    let bestID = bestCandidate(wholeCrew, day, currShift);
                    console.log(bestID);
                    if(bestID !== null){
                        assignShift(day, currShift, "TM", bestID);
                    }
                }
            })
        }
    }

    //Phase 3: Fill rest of slots


}

//

/**************************************
    Helper Functions
***************************************/

/*
    Shuffle days using Fisher-Yates Shuffle
*/
function shuffle(arr){
    for(let i = arr.length - 1; i > 0; i--){
        const random = Math.floor(Math.random() * (i+1));

        [arr[i], arr[random]] = [arr[random], arr[i]];
    }
}

/*
    Best Candidate:
    Takes pool of employees and picks one that is best fit for shift based off of availability and preference
    pool - Array of ids
    day - day for shift
    shift - current shift either morning or night or floater
 */
function bestCandidate(pool, day, shift){

    let bestScore = -1;
    let bestCandidate = null;

    for(let currID of pool){
        let employee = employees.get(currID);
        let currScore = 0;

        // Phase 1: Filter out not employees not able to work that shift
        // if not available, then score 0 and continue
        if (employee.availability[day][shift] == false){
            currScore = -10;
            continue;
        }
        // check if they already worked that day, if so score 0 then continue
        if (workingThatDay(day, currID)){
            currScore = -10;
            continue;
        }

        // skip if at preferred amount of days
        if (employee.currShiftNum >= employee.preferredAmountofShifts) {
            currScore = -10;
            continue;
        }

        // Passed prior checks get to be scored
        // Preference [0-1]
        let p = 0.5;
        if(employee.preferredShift == shift){
            p = 1;
        }

        // Fariness [0-1]
        let f = (employee.preferredAmountofShifts - employee.currShiftNum) / employee.preferredAmountofShifts;

        // Score [0-1]
        let randTieBreak = Math.random() * 0.01; // Either 0 or 0.01
        currScore = (0.3*p) + (0.7*f) + randTieBreak;

        // check if best score
        if(currScore > bestScore){
            bestScore = currScore;
            bestCandidate = currID
        }
    }

    return bestCandidate;
}


/*
    Assign Shift
*/
function assignShift(day, shift, role, id){
    let employee = employees.get(id);

    // // check to see if employee is available that shift and day
    // if (employee.availability[day][shift] == false){
    //     return false;
    // }
    // // check if they already worked that day
    // if (workingThatDay(day, id)){
    //     return false;
    // }
    // // check if they are SL and if theres already one on that shift
    // if(role == "SL" && shift != "float" && schedule[day][shift].SL.length > 0){
    //     return false;
    // }

    // add onto shift
    let slot = schedule[day][shift][role].find(s => s.employees === null);
    if(!slot){
        return false;
    }
    if(employee.preferredShift === shift){
        employee.pShiftCounter++;
    }
    slot.employees = id;
    employee.currShiftNum++;
    console.log('Assigned ', employee.name, ' to shift ', day, ' ', shift, '.');

}

/*
    Check if they are working that day
*/
function workingThatDay(day, id){
    let shifts = schedule[day];
    for(let shiftName in shifts) {
        let roles = shifts[shiftName];
        for( let role in roles){
            for(let slot of roles[role]){
                if(slot.employees === id){
                    return true;
                }
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
    let pShiftCounterBaseLine = 0;
    let currEmployee = {
        id: currID, 
        name: name, 
        availability: availability, 
        preferredShift: preferredShift,
        preferredAmountofShifts: amountOfShifts,
        role: role,
        currShiftNum: currShiftNum,
        pShiftCounter: pShiftCounterBaseLine
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

// Example Employees

// Employee 1: Shift Lead, prefers morning, wants 3 shifts
addEmployee("Hannah Lee", {
    Monday: createAvailability(true, true, false),
    Tuesday: createAvailability(true, true, false),
    Wednesday: createAvailability(true, false, true),
    Thursday: createAvailability(true, true, false),
    Friday: createAvailability(true, false, true),
    Saturday: createAvailability(true, false, false),
    Sunday: createAvailability(false, false, false)
}, "morning", 3, "SL", 0);

// Employee 2: Team Member, prefers night, wants 4 shifts
addEmployee("John Doe", {
    Monday: createAvailability(true, true, true),
    Tuesday: createAvailability(true, true, true),
    Wednesday: createAvailability(true, true, true),
    Thursday: createAvailability(true, true, true),
    Friday: createAvailability(true, true, true),
    Saturday: createAvailability(true, true, true),
    Sunday: createAvailability(true, true, true)
}, "night", 4, "TM", 0);

// Employee 3: Team Member, prefers float, wants 2 shifts
addEmployee("Jane Smith", {
    Monday: createAvailability(true, true, true),
    Tuesday: createAvailability(false, true, true),
    Wednesday: createAvailability(true, true, true),
    Thursday: createAvailability(true, true, true),
    Friday: createAvailability(true, false, true),
    Saturday: createAvailability(true, false, true),
    Sunday: createAvailability(true, true, true)
}, "float", 2, "TM", 0);

// Employee 4: Shift Lead, no preferred shift, wants 5 shifts
addEmployee("Alex Brown", {
    Monday: createAvailability(true, false, true),
    Tuesday: createAvailability(true, true, true),
    Wednesday: createAvailability(true, true, false),
    Thursday: createAvailability(true, true, true),
    Friday: createAvailability(true, true, true),
    Saturday: createAvailability(true, true, false),
    Sunday: createAvailability(true, true, true)
}, null, 5, "SL", 0);

// Employee 5: Team Member, prefers morning, wants 3 shifts
addEmployee("Lisa Green", {
    Monday: createAvailability(true, true, false),
    Tuesday: createAvailability(true, true, false),
    Wednesday: createAvailability(true, true, false),
    Thursday: createAvailability(true, true, true),
    Friday: createAvailability(true, true, false),
    Saturday: createAvailability(true, true, false),
    Sunday: createAvailability(false, false, false)
}, "morning", 3, "TM", 0);

// Employee 6: Shift Lead, prefers night, full-time 5 shifts
addEmployee("Mark Johnson", {
    Monday: createAvailability(false, true, true),
    Tuesday: createAvailability(true, false, true),
    Wednesday: createAvailability(true, false, true),
    Thursday: createAvailability(false, true, true),
    Friday: createAvailability(true, true, true),
    Saturday: createAvailability(true, false, true),
    Sunday: createAvailability(true, true, true)
}, "night", 5, "SL", 0);

// Employee 7: Shift Lead, prefers morning, 4 shifts
addEmployee("Emily Davis", {
    Monday: createAvailability(true, false, false),
    Tuesday: createAvailability(true, false, true),
    Wednesday: createAvailability(true, false, false),
    Thursday: createAvailability(true, false, false),
    Friday: createAvailability(true, true, false),
    Saturday: createAvailability(true, false, false),
    Sunday: createAvailability(false, false, false)
}, "morning", 4, "SL", 0);

// Employee 8: Shift Lead, flexible, 4 shifts
addEmployee("Michael Carter", {
    Monday: createAvailability(true, true, true),
    Tuesday: createAvailability(true, true, true),
    Wednesday: createAvailability(true, true, true),
    Thursday: createAvailability(true, true, true),
    Friday: createAvailability(true, true, true),
    Saturday: createAvailability(false, true, true),
    Sunday: createAvailability(false, false, false)
}, null, 4, "SL", 0);

// Employee 9: Team Member, prefers float, 1 shift
addEmployee("Sophie Turner", {
    Monday: createAvailability(true, true, true),
    Tuesday: createAvailability(false, true, true),
    Wednesday: createAvailability(true, true, true),
    Thursday: createAvailability(true, true, true),
    Friday: createAvailability(true, false, true),
    Saturday: createAvailability(true, false, true),
    Sunday: createAvailability(true, true, true)
}, "float", 1, "TM", 0);

// Employee 10: Team Member, prefers night, 5 shifts
addEmployee("Daniel White", {
    Monday: createAvailability(true, false, true),
    Tuesday: createAvailability(true, false, true),
    Wednesday: createAvailability(true, false, true),
    Thursday: createAvailability(true, false, true),
    Friday: createAvailability(true, false, true),
    Saturday: createAvailability(true, false, true),
    Sunday: createAvailability(true, false, true)
}, "night", 5, "TM", 0);

// Employee 11: Team Member, prefers morning, 2 shifts
addEmployee("Olivia Harris", {
    Monday: createAvailability(true, false, false),
    Tuesday: createAvailability(true, false, false),
    Wednesday: createAvailability(false, false, false),
    Thursday: createAvailability(true, false, false),
    Friday: createAvailability(false, false, false),
    Saturday: createAvailability(true, false, false),
    Sunday: createAvailability(false, false, false)
}, "morning", 2, "TM", 0);

// Employee 12: Team Member, prefers float, 3 shifts
addEmployee("Ethan Walker", {
    Monday: createAvailability(false, true, false),
    Tuesday: createAvailability(false, true, false),
    Wednesday: createAvailability(true, true, false),
    Thursday: createAvailability(true, true, false),
    Friday: createAvailability(true, true, false),
    Saturday: createAvailability(false, true, false),
    Sunday: createAvailability(false, true, false)
}, "float", 3, "TM", 0);

// Employee 13: Team Member, prefers night, 4 shifts
addEmployee("Chloe Martinez", {
    Monday: createAvailability(false, false, true),
    Tuesday: createAvailability(true, false, true),
    Wednesday: createAvailability(false, false, true),
    Thursday: createAvailability(false, false, true),
    Friday: createAvailability(true, false, true),
    Saturday: createAvailability(false, false, true),
    Sunday: createAvailability(true, false, true)
}, "night", 4, "TM", 0);


console.log("Employees Map:", employees);


function printScheduleWithHours(schedule) {
    for (let day in schedule) {
        console.log(day + ":");
        for (let shift in schedule[day]) {
            console.log("  " + shift + ":");

            let shiftData = schedule[day][shift];
            for (let role in shiftData) {
                // For each slot, show hours and "employee" if employees is null
                let output = shiftData[role].map(slot => {
                    let empName = slot.employees === null ? "employee" : slot.employees;
                    return `${empName} (${slot.hours}h)`;
                }).join(", ");

                console.log(`    ${role}: [${output}]`);
            }
        }
    }
}

function printScheduleWithWorkers(schedule) {
    for (let day in schedule) {
        console.log(day + ":");
        for (let shift in schedule[day]) {
            console.log("  " + shift + ":");

            let shiftData = schedule[day][shift];

            for (let role in shiftData) { // SL or TM
                let output = shiftData[role].map(slot => {
                    let empId = slot.employees;
                    let empName = empId === null ? "Unassigned" : employees.get(empId).name;
                    return `${empName} (${slot.hours}h)`;
                }).join(", ");

                console.log(`    ${role}: [${output}]`);
            }
        }
    }
}

function printShiftStats(employees) {
    console.log("=== Employee Shift Stats ===");
    for (let [, emp] of employees) {
        console.log(`${emp.name}:`);
        console.log(`   Preferred Shifts Wanted: ${emp.preferredAmountofShifts}`);
        console.log(`   Preferred Shifts Assigned (${emp.preferredShift || "none"}): ${emp.pShiftCounter}`);
        console.log(`   Total Shifts Assigned: ${emp.currShiftNum}`);
    }
}


function printShiftSupplyDemand(schedule, employees) {
    // count all slots in the schedule
    let totalSlots = 0;
    for (let day in schedule) {
        for (let shift in schedule[day]) {
            for (let role in schedule[day][shift]) {
                totalSlots += schedule[day][shift][role].length;
            }
        }
    }

    // sum of all preferred shifts
    let totalPreferred = 0;
    for (let [, emp] of employees) {
        totalPreferred += emp.preferredAmountofShifts;
    }

    console.log("=== Shift Supply vs Demand ===");
    console.log(`Total Shifts Available in Schedule: ${totalSlots}`);
    console.log(`Total Shifts Requested by Employees: ${totalPreferred}`);

    if (totalSlots > totalPreferred) {
        console.log(`⚠️ Oversupply: ${totalSlots - totalPreferred} more shifts than requested.`);
    } else if (totalSlots < totalPreferred) {
        console.log(`⚠️ Undersupply: ${totalPreferred - totalSlots} requested shifts not available.`);
    } else {
        console.log("✅ Perfect balance: supply matches demand.");
    }
}


const priorityShifts = [
    { day: "Saturday", shift: "night" },
    { day: "Saturday", shift: "morning" },
    { day: "Friday", shift: "night" },
    { day: "Friday", shift: "morning" },
    { day: "Sunday", shift: "morning" },
    { day: "Sunday", shift: "night" },
    { day: "Friday", shift: "morning" },
    { day: "Friday", shift: "night" },
];

autoScheduleTemplate(schedule, 280, priorityShifts);  // fill your template
printScheduleWithHours(schedule); // print nicely
console.log("Auto assigning")
autoAssign(schedule, employees);
console.log("Printing Schedule\n\n");
printScheduleWithWorkers(schedule);
console.log("Number of each employees amount of shifts");
printShiftStats(employees);
printShiftSupplyDemand(schedule, employees);

