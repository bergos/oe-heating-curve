import shell from 'shelljs'

// create build folder
shell.mkdir('-p', 'build')

// copy libraries
shell.cp('node_modules/bootstrap/dist/css/bootstrap.css', 'build')
shell.cp('node_modules/highcharts/highcharts.js', 'build')

// copy code
shell.cp('public/*', 'build')
