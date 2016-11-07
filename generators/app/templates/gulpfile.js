/*** gulpfile.js for the newly created generator-nextui ***/
/***                    Author: Eimji                   ***/
/***               Updated: 2016, Nov, 3rd              ***/

'use strict';
var gulp = require('gulp');
require('gulp-grunt')(gulp); 

<% if (applicationType === 'freshApp') { %>
var webserver = require('gulp-webserver');
<% } %>

<% if (applicationType === 'bgpPathmanApp' || applicationType === 'srPathmanApp') { %>
var shell = require('gulp-shell');
<% } %>

// run complete grunt tasks for NeXt
gulp.task('next', [
	'grunt-default'
]);

gulp.task('next:dev', [
	'grunt-dev'
]);

gulp.task('next:test', [
	'grunt-test'
]);

<% if (applicationType === 'justBuild') { %>

gulp.task('default', ['next']);
gulp.task('clean', ['grunt-clean']);


<% } else if (applicationType === 'freshApp') { %>

gulp.task('build', ['next']);
gulp.task('default', ['build']);
gulp.task('clean', ['grunt-clean']);

gulp.task('serve', ['build'], function() {
  gulp.src('target/app')
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

<% } else if (applicationType === 'bgpPathmanApp') { %>

/*** Only for my demo ***/
/*gulp.task('patch', shell.task([
	<% if (props.gitClone) { %>
	'patch -p1 < ../pathman_demo.patch'
	<% } else { %>
	'patch -p2 < ../pathman_demo.patch'
	<% } %>
],{cwd:'target/pathman-bgp'}));*/
/***    for my demo   ***/

<% if (props.gitClone) { %>

gulp.task('serve', ['next'], shell.task([
	'/bin/cp ../../next/js/next.js client/lib/next/js/next.js',
	'python2 rest_server_v5.py'
],{cwd:'target/pathman-bgp/pathman'}));
gulp.task('build', ['next'], shell.task([
	'/bin/cp ../../next/js/next.js client/lib/next/js/next.js'
],{cwd:'target/pathman-bgp/pathman'}));

<% } else { %>

gulp.task('serve', ['next'], shell.task([
	'/bin/cp ../next/js/next.js client/lib/next/js/next.js',
	'python2 rest_server_v5.py'
],{cwd:'target/pathman-bgp'}));
gulp.task('build', ['next'], shell.task([
	'/bin/cp ../next/js/next.js client/lib/next/js/next.js'
],{cwd:'target/pathman-bgp'}));	

<% } %>	

gulp.task('clean', ['grunt-clean']);
gulp.task('default', ['build']);


<% } else if (applicationType === 'srPathmanApp') { %>

gulp.task('build', ['next'], shell.task([
	'gulp build',
	'/bin/rm -rf ../../client/pathman_sr/vendor/NeXt',
	'/bin/cp -r ../../../next ../../client/pathman_sr/vendor/NeXt'
],{cwd:'target/pathman-sr/client-src/pathman_sr'}));

gulp.task('default', ['next'], shell.task([
	'gulp',
	'/bin/rm -rf ../../client/pathman_sr/vendor/NeXt',
	'/bin/cp -r ../../../next ../../client/pathman_sr/vendor/NeXt'	
],{cwd:'target/pathman-sr/client-src/pathman_sr'}));

gulp.task('clean', ['grunt-clean'], shell.task([
	'gulp clean'
],{cwd:'target/pathman-sr/client-src/pathman_sr'}));

gulp.task('serve', ['clean', 'build'], shell.task([
	'python2 rest_server_v6.py'
],{cwd:'target/pathman-sr'}));

<% } %>