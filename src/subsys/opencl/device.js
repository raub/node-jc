'use strict';

const cl = require('node-opencl');

const platforms = cl.getPlatformIDs();

// for(let i=0;i<platforms.length;i++) {
// 	console.info("Platform "+i+": "+cl.getPlatformInfo(platforms[i],cl.PLATFORM_NAME));
// }

const platform = platforms[0];

const devices = cl.getDeviceIDs(platform, cl.DEVICE_TYPE_ALL);

// for(let i=0; i<devices.length; i++) {
// 	console.info("  Devices "+i+": "+cl.getDeviceInfo(devices[i],cl.DEVICE_NAME));
// }

// var context = cl.createContextFromType([cl.CONTEXT_PLATFORM, platform],cl.DEVICE_TYPE_GPU);
const context = cl.createContext([cl.CONTEXT_PLATFORM, platform], devices);

const device = cl.getContextInfo(context, cl.CONTEXT_DEVICES)[0];

// Create command queue
let queue;
let version;
if (cl.createCommandQueueWithProperties !== undefined) {
	queue = cl.createCommandQueueWithProperties(context, device, []); // OpenCL 2
	version = '2.0';
} else {
	queue = cl.createCommandQueue(context, device, null); // OpenCL 1.x
	version = '1.2';
	
}

console.log(`OpenCL ${version}.`);

module.exports = {
	cl,
	platform,
	context,
	device,
	queue,
};
