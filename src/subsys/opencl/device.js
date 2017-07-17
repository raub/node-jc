'use strict';

const cl = require('node-opencl');

const UniformBuffer = require('./uniform-buffer');


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
if (cl.createCommandQueueWithProperties !== undefined) {
	queue = cl.createCommandQueueWithProperties(context, device, []); // OpenCL 2
} else {
	queue = cl.createCommandQueue(context, device, null); // OpenCL 1.x
}

console.log(cl.getPlatformInfo(platform, cl.PLATFORM_VERSION));

const uniforms = new UniformBuffer(cl, context, 32000);


module.exports = {
	uniforms,
	cl,
	platform,
	context,
	device,
	queue,
};
