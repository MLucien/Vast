/**
* turning script mode on and defining all the routes of the application 
* 
*/

'use strict';

const helper = require('./helper');
const path = require('path');
class Routes{

	constructor(app){

		this.app = app;
	}
	
	appRoutes(){
		this.app.post('/usernameCheck',async (request,response) =>{
			const username = request.body.username;
			if (username === "" || username === undefined || username === null) {
				response.status(412).json({
					error : true,
					message : `username cant be empty.`
				});
			} else {
				const data = await helper.userNameCheck(username.toLowerCase());
				if (data[0]['count'] > 0) {
					response.status(401).json({
						error:true,
						message: 'This username is alreday taken.'
					});
				} else {
					response.status(200).json({
						error:false,
						message: 'This username is available.'
					});
				}
			}
		});		


		this.app.post('/posts', async(request,response) => {

			const postsResponse = {}
			const data = {
				posts : request.body.posts,
				from_user_id: request.body.from_user_id

		
				
			};		
			if (data.posts === '' & data.from_user_id === ''){
				postsResponse.error = true;
	            postsResponse.message = `They should be something buzzing you, say it`;
	            response.status(412).json(postsResponse);
			} else {
				const result = await helper.insertPosts(data);
				if (result === null) {
					postsResponse.error = true;
					postsResponse.message = `Something went wrong.`;
					response.status(417).json(postsResponse);
				} else {
					postsResponse.error = false;
					postsResponse.userId = result.insertId;
					postsResponse.message = `Buzzed.`;
					response.status(200).json(postsResponse);
				}

			}});


		this.app.post('/registerUser', async (request,response) => {
			const registrationResponse = {}
			const data = {
				username : (request.body.username).toLowerCase(),
				name : request.body.name,
				surname : request.body.surname,
				age: (request.body.age).toString(),
				gender: request.body.gender,
				relantionshiop: request.body.relantionshiop,
				country: (request.body.country).toLowerCase(),
				password : request.body.password
			};			
			if(data.username === '') {
	            registrationResponse.error = true;
	            registrationResponse.message = `username cant be empty.`;
	            response.status(412).json(registrationResponse);
	        }else if(data.password === ''){				            
	            registrationResponse.error = true;
	            registrationResponse.message = `password cant be empty.`;
	            response.status(412).json(registrationResponse);
	        }else{	        	
				const result = await helper.registerUser( data );
				if (result === null) {
					registrationResponse.error = true;
					registrationResponse.message = `User registration unsuccessful,try after some time.`;
					response.status(417).json(registrationResponse);
				} else {
					registrationResponse.error = false;
					registrationResponse.userId = result.insertId;
					registrationResponse.message = `User registration successful.`;
					response.status(200).json(registrationResponse);
				}
	        }
		});

		this.app.post('/login',async (request,response) =>{
			const loginResponse = {}
			const data = {
				username : (request.body.username).toLowerCase(),
				password : request.body.password
			};
			if(data.username === '' || data.username === null) {
	            loginResponse.error = true;
	            loginResponse.message = `username cant be empty.`;
	            response.status(412).json(loginResponse);
	        }else if(data.password === '' || data.password === null){				            
	            loginResponse.error = true;
	            loginResponse.message = `password cant be empty.`;
	            response.status(412).json(loginResponse);
	        }else{
				const result = await helper.loginUser(data);
				if (result === null || result.length === 0) {
					loginResponse.error = true;
					loginResponse.message = `Invalid username and password combination.`;
					response.status(401).json(loginResponse);
				} else {
					loginResponse.error = false;
					loginResponse.userId = result[0].id;
					loginResponse.message = `User logged in.`;
					response.status(200).json(loginResponse);
				}
	        }
		});
		
		this.app.post('/userSessionCheck', async (request,response) =>{
			const userId = request.body.userId;
			const sessionCheckResponse = {}			
			if (userId == '') {
				sessionCheckResponse.error = true;
	            sessionCheckResponse.message = `User Id cant be empty.`;
	            response.status(412).json(sessionCheckResponse);
			}else{
				const username = await helper.userSessionCheck(userId);
				if (username === null || username === '') {
					sessionCheckResponse.error = true;
					sessionCheckResponse.message = `User is not logged in.`;
					response.status(401).json(sessionCheckResponse);
				}else{
					sessionCheckResponse.error = false;
					sessionCheckResponse.username = username;
					sessionCheckResponse.message = `User logged in.`;
					response.status(200).json(sessionCheckResponse);
				}
	        }
		});
		
		this.app.post('/getMessages',async (request,response) => {
			const userId = request.body.userId;
			const toUserId = request.body.toUserId;
			const messages = {}			
			if (userId === '') {
				messages.error = true;
	            messages.message = `userId cant be empty.`;
	            response.status(200).json(messages);
			}else{
				const result = await helper.getMessages( userId, toUserId);
				if (result ===  null) {
					messages.error = true;
					messages.message = `Internal Server error.`;
					response.status(500).json(messages);
				}else{
					messages.error = false;
					messages.messages = result;
					response.status(200).json(messages);
				}
	        }
		});

	this.app.post('/getPosts',async (request,response) => {
			// const userId = request.body.userId;
			// const toUserId = request.body.toUserId;
			const postsData = {}
		
				const result = await helper.getPostList();
				postsData.postsData = result;
				
				if (result ===  null) {
					postsData.error = true;
					postsData.message = `Internal Server error.`;
					response.status(500).json(postsData);
				}else{
					postsData.error = false;
					postsData.message = result;
					response.status(200).json(postsData);

				}
				 
				//console.log(result);
			
		});
		
		this.app.get('*',(request,response) =>{
			response.sendFile(path.join(__dirname + '../../client/views/index.html'));
			/*
			* OR one can define the template engine and use response.render();
			*/
		});		
	}

	routesConfig(){
		this.appRoutes();
	}
}
module.exports = Routes;