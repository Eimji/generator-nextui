/*
Author: Eimji
*/

'use strict';
var yeoman = require('yeoman-generator'),
  chalk = require('chalk'),
  inquirer = require('inquirer'),
  _ = require('lodash'),
  extend = _.merge,
  remote = require('yeoman-remote'),
  path = require('path'),
  mkdirp = require('mkdirp');

var memFs = require('mem-fs');
var editor = require('mem-fs-editor');
 
var store = memFs.create();
var fs = editor.create(store);


module.exports = yeoman.Base.extend({
  initializing: function () {
    // Have Yeoman greet the user.
    var welcome =
      "\n" +
      chalk.green.bold("\n  ___                 ___            _ _      _   _   ") +
      chalk.green.bold("\n / _ \\ _ __  ___ _ _ |   \\ __ _ _  _| (_)__ _| |_| |_ ") +
      chalk.green.bold("\n| (_) | '_ \\/ -_) ' \\| |) / _` | || | | / _` | ' \\  _|") +
      chalk.green.bold("\n \\___/| .__/\\___|_||_|___/\\__,_|\\_, |_|_\\__, |_||_\\__|") +
      chalk.green.bold("\n      |_|                       |__/    |___/         ") +  
      "\n" +
      chalk.green.bold("\n _  _    __  ___     _   _ ___ ") +
      chalk.green.bold("\n| \\| |___\\ \\/ / |_  | | | |_ _|") +
      chalk.green.bold("\n| .` / -_)>  <|  _| | |_| || | ") +
      chalk.green.bold("\n|_|\\_\\___/_/\\_\\\\__|  \\___/|___|") +
      "\n\n" +
      chalk.blue.bold("Thanks for using OpenDaylight NeXt UI!\nMore info: https://wiki.opendaylight.org/view/NeXt:Main\nNeed help? https://github.com/Eimji/generator-nextui\n") +
      "\n";   
       
    this.log(welcome);

    this.props = {};
  },

  prompting: {
    askForInstallation: function () {
      return inquirer.prompt([{
        type: 'list',
        name: 'applicationType',
        message: 'Which type of installation do you want to use with NeXt UI?',
        choices: [{
          name: 'Install a new application',
          value: 'freshApp'
        },{
          name: 'Install the BGP & Pathman applications',
          value: 'bgpPathmanApp'
        },{
          name: 'Install the Pathman Segment Routing application',
          value: 'srPathmanApp'
        },{
          name: 'No application, just build the library',
          value: 'justBuild'
        }],
        default: 0
      }]).then(function (answer) {
        this.applicationType = answer.applicationType;
      }.bind(this));
    },

    askForPathmanConfig: function () {
      if (this.applicationType === 'bgpPathmanApp' || this.applicationType === 'srPathmanApp') {
        var storedPasswd;

        var prompts = [{
          name: 'odl_ip',
          message: 'ODL IP address',
          default: '198.18.1.80'
        }, {
          name: 'odl_port',
          message: 'ODL port number',
          default: '8181'
        }, {
          name: 'odl_user',
          message: 'ODL username',
          default: 'admin'
        }, {
          type:'password',
          name: 'odl_password',
          message: 'ODL password',
          default: 'admin',
          validate: function(str) {
            storedPasswd = str;
            return str !== '';
          }
        }, {
          type:'password',
          name: 'repeat_odl_password',
          message: 'Repeat ODL password',
          default: 'admin',
          validate: function(str){
            if (str !== storedPasswd) {
              console.log(chalk.white.bgRed("\nRepeated password doesn't match."));
              return false;
            }
            
            return true; 
          }
        }];  

        this.log('Pathman needs to know how to access your OpenDaylight controller.');

        return this.prompt(prompts).then(function (props) {
          this.props = extend(this.props, props);
        }.bind(this));  
      }  
    },

    askForCloningGitRepositories: function () {
      this.log('');

      return inquirer.prompt([{
        type: 'confirm',
        name: 'gitClone',
        message: 'Do you want to clone the Git repository(ies)?',
        default: false
      }]).then(function (answer) {
        this.props.gitClone = answer.gitClone;
      }.bind(this));      
    }
  },

  writing: {
    getNeXt: function () {
      var done = this.async();

      /*this.fs.copy(
        this.templatePath('dummyfile.txt'),
        this.destinationPath('dummyfile.txt')
      );*/

      if (this.props.gitClone) {
        this.log(chalk.white.bgBlue('\nCloning https://github.com/opendaylight/next.git. Please wait...'));
        this.spawnCommand('git', ['clone', 'https://github.com/opendaylight/next.git', '.']).on('close', done);

      } else {
        this.log(chalk.white.bgBlue('\nDownloading the NeXt UI framework from Github. Please wait...'));
        remote('opendaylight', 'next', 'master', function (err, cachePath) {
          this.fs.copy(
            path.join(cachePath, '/.*'),
            this.destinationRoot()
          );
          this.fs.copy(
            cachePath,
            this.destinationRoot()
          ); 

          done();

        }.bind(this), 'refresh');
      }
    },

    getWebApp: function () {

      if(this.applicationType === 'freshApp' || this.applicationType === 'justBuild')
        return;

      var done = this.async();

      if (this.props.gitClone) {
        switch(this.applicationType) {
          case 'bgpPathmanApp':
            this.log(chalk.white.bgBlue('\nCloning https://github.com/CiscoDevNet/Opendaylight-BGP-Pathman-apps.git. Please wait...'));
            this.spawnCommand('git', ['clone', 'https://github.com/CiscoDevNet/Opendaylight-BGP-Pathman-apps.git', 'target/pathman-bgp']).on('close', done);
            break;

          case 'srPathmanApp':
            this.log(chalk.white.bgBlue('\nCloning https://github.com/CiscoDevNet/pathman-sr.git. Please wait...'));
            this.spawnCommand('git', ['clone', 'https://github.com/CiscoDevNet/pathman-sr.git', 'target/pathman-sr']).on('close', done);
            break;

          default:
        }
      } else {
        switch(this.applicationType) {
          case 'bgpPathmanApp':
            this.log(chalk.white.bgBlue('\nDownloading the BGP & Pathman applications from Github. Please wait...'));
            remote('CiscoDevNet', 'Opendaylight-BGP-Pathman-apps', 'master', function (err, cachePath) {
              this.fs.copy(
                path.join(cachePath, 'pathman'),
                this.destinationPath('target/pathman-bgp')
              );          
              done();
            }.bind(this), 'refresh');        
            break;

          case 'srPathmanApp':
            this.log(chalk.white.bgBlue('\nDownloading the Pathman SR application from Github. Please wait...'));
            remote('CiscoDevNet', 'pathman-sr', 'master', function (err, cachePath) {
              this.fs.copy(
                path.join(cachePath, 'client-src'),
                this.destinationPath('target/pathman-sr/client-src')
              );
              this.fs.copy(
                path.join(cachePath, 'client-src/pathman_sr/.*'),
                this.destinationPath('target/pathman-sr/client-src/pathman_sr')
              );                             
              this.fs.copy(
                path.join(cachePath, 'client'),
                this.destinationPath('target/pathman-sr/client')
              ); 
              this.fs.copy(
                path.join(cachePath, '**/*.py'),
                this.destinationPath('target/pathman-sr')
              );                                           
              done();
            }.bind(this), 'refresh');              
            break;

          default:
        } 
      } // end no gitClone
    }
  },

  conflicts: function () {
    this.conflicter.force = true;
  },

  install: {
    prepareFiles: function () {
      this.log(chalk.white.bgBlue('\nUpdating the files package.json, .jshintrc files and gruntfile.js for NeXt UI.'));
      
      var packageJson = fs.readJSON(this.destinationPath('package.json'));     
      packageJson.devDependencies = {};
      this.write(this.destinationPath('package.json'), JSON.stringify(packageJson, null, 2));  

      var jshintrc = fs.read(this.destinationPath('.jshintrc')),
        _jshintrc = [jshintrc.slice(0, jshintrc.length - 3), ',"elision":true', jshintrc.slice(jshintrc.length - 3)].join('');
      this.write(this.destinationPath('.jshintrc'), _jshintrc); 

      
      switch(this.applicationType) {
        case 'justBuild':   
          break;

        case 'freshApp':
          // create app/js, app/css, and app/fonts
          mkdirp('target/app/css', function (err) {
            if (err) console.error(err);
          });          
          mkdirp('target/app/js', function (err) {
            if (err) console.error(err);
          });
          mkdirp('target/app/fonts', function (err) {
            if (err) console.error(err);
          });  
          mkdirp('target/app/media', function (err) {
            if (err) console.error(err);
          });                    
          this.template('next/index.html', 'target/app/index.html');
          break;

        case 'bgpPathmanApp':
          if (this.props.gitClone) {
            this.template('bgpPathman/pathman_ini.py', 'target/pathman-bgp/pathman/pathman_ini.py');
          } else {
            this.template('bgpPathman/pathman_ini.py', 'target/pathman-bgp/pathman_ini.py');
          }

          /*** Only for my demo ***/
          //this.template('bgpPathman/pathman_demo.patch', 'target/pathman_demo.patch'); 
          break;

        case 'srPathmanApp':  
          packageJson = fs.readJSON(this.destinationPath('target/pathman-sr/client-src/pathman_sr/package.json'));    
          packageJson.dependencies = {}; 
          packageJson.devDependencies = {};
          this.write(this.destinationPath('target/pathman-sr/client-src/pathman_sr/package.json'), JSON.stringify(packageJson, null, 2));  

          this.template('srPathman/pathman_ini.py', 'target/pathman-sr/pathman_ini.py');
          this.template('srPathman/gulpfile.js', 'target/pathman-sr/client-src/pathman_sr/gulpfile.js');
          break;

        default:
      }
      

      this.template('next/gruntfile.js', 'gruntfile.js');
      this.template('gulpfile.js', 'gulpfile.js');
    },

    installNeXt: function () {
      var done = this.async();

      this.log(chalk.white.bgBlue("\nI'm all done. Running "+chalk.yellow("npm install")+" for you to install the required dependencies for NeXt UI."));
      this.spawnCommand('npm', ['install', '--save-dev', 'grunt', 'grunt-contrib-clean', 'grunt-contrib-compress', 'grunt-contrib-concat', 'grunt-contrib-copy', 'grunt-contrib-cssmin', 'grunt-contrib-jshint', 'grunt-contrib-less', 'grunt-contrib-qunit', 'grunt-contrib-uglify', 'grunt-contrib-yuidoc', 'grunt-header', 'grunt-exec', 'phantomjs-prebuilt']).on('close', done);   
    },

    installGulp: function () {
      var done = this.async();
      // to run NeXt grunt tasks in gulpfile.js
      this.spawnCommand('npm', ['install', 'gulp-grunt', 'gulp-shell']).on('close', done);
    },

    installWebApp: function () {
      /*this.installDependencies({bower: false});*/
      switch(this.applicationType) {
        case 'freshApp':
          this.log(chalk.white.bgBlue("\nInstalling gulp-webserver for you to run a local webserver with LiveReload."));
          this.npmInstall(['gulp-webserver']);
          break;

        case 'bgpPathmanApp':
          break;

        case 'srPathmanApp':  
          // Change working directory to 'gulp' for dependency install
          var npmdir = process.cwd() + '/target/pathman-sr/client-src/pathman_sr';
          process.chdir(npmdir);
          this.log(chalk.white.bgBlue("\nRunning "+chalk.yellow("npm install")+" and "+chalk.yellow("bower install")+" to install the required dependencies for SR Pathman."));
          this.npmInstall(['gulp'], { 'save': true });
          this.npmInstall(['browser-sync', 'del', 'gulp-watch', 'gulp-autoprefixer', 'gulp-uglify', 'gulp-less', 'gulp-rigger', 'gulp-clean-css', 'gulp-rename', 'gulp-htmlmin'], { 'save-dev': true });

          this.bowerInstall();
          break;  

        default:     
      }

    }
  },

  end: function () {
    this.log(chalk.white.bgBlue("\nFinish!")+"\n\nHow to use:\n");
    if (this.applicationType !== 'justBuild') {
      /*** Only for my demo ***/
      //this.log("gulp patch: to add Orange modifs ;)\n");
      this.log("gulp serve: to launch the server");
    } else {
      this.log("gulp or gulp next: to build the NeXt library\n"); 
    }
  }

});
