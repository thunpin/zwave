# zwave
Web project in node to control ZWAVE devices.

## configure environment
Install the [nodejs](http://nodejs.org)

Intall the [openzwave lib](http://www.openzwave.com/), see the instructions in
[open-zwave](https://github.com/OpenZWave/open-zwave).

Clone the project (```git clone https://github.com/thunpin/zwave.git```). 
Install the ptoject dependencies (```cd zwave && npm install```). <br>
<b>Note1:</b> If has problem with npm-openzewave dependence, please visite the
[page plugin](https://github.com/OpenZWave/node-openzwave-shared) and follow the
instructions.

## execute project
In this example we're using the device in /dev/ttyUSB0:
```sudo ZWV_DEVICE='/dev/ttyUSB0' node server.js```