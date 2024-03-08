// Using ES6 import syntax
import { spawn } from 'child_process';
//import { writeFile, unlink } from 'fs/promises';

let pid = null;

const startDetachedProcess = async () => {
  const child = await spawn('node', ['build/src/main-dispatcher.js', 30802], {
    stdio: 'ignore',
    detached: true
  });

  // Save the PID to a file
  pid = child.pid;
  console.log("PID=", child.pid.toString());

  child.unref();
  //console.log(child);
};


const killDetachedProcess = async () => {
  try {
    process.kill(pid, 'SIGTERM'); // Attempt to gracefully terminate the process
    console.log(`Process ${pid} has been killed.`);
    const pid = await readFile('child.pid', { encoding: 'utf-8' });

    // Optionally, delete the PID file
    await unlink('child.pid');
  } catch (error) {
    console.error('Failed to kill the detached process:', error);
  }
};


await startDetachedProcess();

for (let j=0; j < 1000; j++)
  console.log("for somethinh else");
