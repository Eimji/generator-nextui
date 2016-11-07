# generator-nextui [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Yeoman generator for [OpenDaylight Next UI framework](https://github.com/opendaylight/next)

The generator helps you to get started rapidly with OpenDaylight NeXt UI:
*   scaffold (i.e. automate) the build process of NeXt UI with required npm dependencies, by using the latest version (from https://github.com/opendaylight/next). 
*   select the application you want to start with NeXt:
    *   Cisco BGP and PCEP Pathman application: https://github.com/CiscoDevNet/Opendaylight-BGP-Pathman-apps
    *   Cisco Segment Routing Pathman application: https://github.com/CiscoDevNet/pathman-sr
    *   or simply start a new NeXt-based application from scratch.
*   the generator will scaffold your selected application for you without any effort: automatically installing npm and bower dependencies, with gulp as the build system to build, run and test your project.
*   you can either clone the Github repositiory (-ries) or just download only the required files from it.
![preview image](https://raw.githubusercontent.com/Eimji/generator-nextui/master/nextui.png)

## Installation
We assume you have pre-installed [node.js](https://nodejs.org/).

There are two methods for installing generator-nextui.
### Using npm 
*This method will be coming soon, as the generator is not submitted to https://www.npmjs.com/ for the moment.*

First, install [Yeoman](http://yeoman.io) and generator-nextui using [npm](https://www.npmjs.com/).
```bash
npm install -g yo
npm install -g generator-nextui
```
Then, create a directory in which you can generate your new project:
```bash
mkdir my_new_project_folder
cd my_new_project_folder
yo nextui
```
### Cloning this repsository 
*The preferable method for installing generator-nextui.*

Clone the generator repository.
```bash
git clone https://github.com/Eimji/generator-nextui.git
cd generator-nextui
npm link
```
Then, install [Yeoman](http://yeoman.io).
```bash
npm install -g yo
```
Now, create a new directory, in which you can generate your new project:
```bash
mkdir my_new_project_folder
cd my_new_project_folder
yo nextui
```
## How to use 
Have a look at the gulpfile.js file in the root folder of your generated project to learn how to use. It depends on the type of application you have chosen when generating your project.

The NeXt framework is installed in the root folder of the your generated project.
To build NeXt, enter the following command:
```bash
gulp next
```

### New fresh application from scratch
The application is installed in the folder target/app
A local webserver with LiveReload, using https://github.com/schickling/gulp-webserver, is running for you. To start the server, type:
```bash
gulp serve
```
### Cisco BGP & PCEP Pathman application
The BGP and PCEP Pathman application is installed in the folder *target/pathman-bgp*. To start the Python webserver, type:
```bash
gulp serve
```
### Cisco Pathman Segment Routing application
The Pathman SR application is installed in the folder *target/pathman-sr*. To start the Python webserver, type:
```bash
gulp serve
``` 
## More info
*   OpenDayligh NeXt UI: https://github.com/opendaylight/next
*   Cisco OpenDaylight BGP and PCEP Pathman Apps: https://github.com/CiscoDevNet/Opendaylight-BGP-Pathman-apps
*   Cisco OpenDaylight Pathman Segment Routing App: https://github.com/CiscoDevNet/pathman-sr
## License

MIT © [Eimji](https://eimji.io)


[npm-image]: https://badge.fury.io/js/generator-nextui.svg
[npm-url]: https://npmjs.org/package/generator-nextui
[travis-image]: https://travis-ci.org/Eimji/generator-nextui.svg?branch=master
[travis-url]: https://travis-ci.org/Eimji/generator-nextui
[daviddm-image]: https://david-dm.org/Eimji/generator-nextui.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/Eimji/generator-nextui

