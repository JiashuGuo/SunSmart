# Sun Smart (Alpha Release)

## 1 Description

The SunSmart application is an IoT enabled web application for monitoring the amount of sun exposure a user receives. 

Users will carry a device (or devices) with GPS and a UV sensor to monitor their personal sun exposure. The device will periodically transmits the measured UV exposure and location to a web server that maintains the history of UV exposure for each user.

The SunSmart web application will also allow the user to monitor their exposure, receive alerts, track history, or receive health tips. The web application will have a mobile interface that allows users to view their data on model devices along with entering details each time they apply sunscreen, specifying the type of sunscreen.

### Database

Collection 1 - sampledatas

| sampleTime | sampleDate | UV_raw | latitude | longitude | deviceID |
| :--: | :--: | :--: | :--: | :--: | :--: |

### Endpoints

<a href="http://54.67.97.52/demo">http://54.67.97.52/demo</a> : If the method is GET, this point will return a JSON object which contains all documents in the database. If the method is POST, it will add a new document in the database. For purpose of debugging, every 20 seconds, a new document will be posted to this endpoint.

<a href="http://54.67.97.52/demo.html">http://54.67.97.52/demo.html</a> : You can view all documents in some visual format. 

## 2 Run this project

Before you run this project, make sure you have <a href="https://www.mongodb.com/">mongoDB</a> and <a href="https://nodejs.org/en/">Node.js</a> installed.

Clone this repo to you server:

`$ git clone git@gitlab.com:TianyangChen/SunSmart.git`

Currently, this is a private repo, this command is only applicable to group members.

Create your own `jwtkey` in `~/` directory:

`$ touch jwtkey`

Type in a random string and save it.

Then, change directory:

`$ cd SunSmart`

Run this project:

`$ npm start`

## 3 video

<a href="https://youtu.be/3f-ifqfrK_8">https://youtu.be/3f-ifqfrK_8</a>


