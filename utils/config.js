class Config{
	
	constructor(app){
		// default to html
		app.set('view engine', 'html');

		// link to app templates 
		app.set('views', (__dirname + '/../views'));

		//docs requirements
		app.use(require('express').static(require('path').join('client')));

	}
}
module.exports = Config;