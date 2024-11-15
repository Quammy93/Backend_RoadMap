const fs = require('fs');
const path = './tasks.json';

// Initialize tasks.json file if it doesn't exist
function initializeTasksFile() {
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, JSON.stringify([]), 'utf8');
        console.log('Initialized tasks.json with an empty array.');
    }
}

// Read tasks from tasks.json
function readTasks() {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
}

// Write tasks to tasks.json
function writeTasks(tasks) {
    fs.writeFileSync(path, JSON.stringify(tasks, null, 2), 'utf8');
}

// Task management functions (Add, List, Update, etc.)
function addTask(description) {
    const tasks = readTasks();
    const newTask = {
        id: tasks.length + 1,
        description,
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    writeTasks(tasks);
    console.log(`Task added successfully (ID: ${newTask.id})`);
}

function listTasks(status) {
    const tasks = readTasks();
    const filteredTasks = status ? tasks.filter(task => task.status === status) : tasks;
    console.log(filteredTasks);
}

// Initialize file, then parse command-line arguments
initializeTasksFile();
const [,, action, ...args] = process.argv;

switch(action) {
    case 'add':
        addTask(args.join(" "));
        break;
    case 'list':
        listTasks(args[0]);
        break;
    // Add more cases for other actions
    default:
        console.log("Unknown action");
}

