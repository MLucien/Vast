

'use strict';

class AppService{
    constructor($http){
        this.$http = $http;
        this.socket =  null;
    }
    httpCall(httpData){
        if (httpData.url === undefined || httpData.url === null || httpData.url === ''){
            alert(`Invalid HTTP call`);
        }
        const HTTP = this.$http;
        const params = httpData.params;
        return new Promise( (resolve, reject) => {
            HTTP.post(httpData.url, params).then( (response) => {
                resolve(response.data);
            }).catch( (response, status, header, config) => {
                reject(response.data);
            });
        });
    }
    connectSocketServer(userId){
        const socket = io.connect( { query: `userId=${userId}` });
        this.socket = socket;
    }

    socketEmit(eventName, params){
        this.socket.emit(eventName, params);
    }

    socketOn(eventName, callback) {
        this.socket.on(eventName, (response) => {
            if (callback) {
                callback(response);
            }
        });
    }
    
    getMessages(userId, friendId) {
        return new Promise((resolve, reject) => {
            this.httpCall({
                url: '/getMessages',
                params: {
                    'userId': userId,
                    'toUserId': friendId
                }
            }).then((response) => {
                resolve(response);
            }).catch((error) => {
                reject(error);
            });
        });
    }



    getPostList(posts, from_user_id) {
        return new Promise((resolve, reject) => {
            this.httpCall({
                url: '/getPosts',
                'posts': posts,
                'from_user_id': from_user_id
            }).then((response) => {
                resolve(response);
            }).catch((error) => {
                reject(error);
            });
        });
    }

   // this is to test the angular on the different approaches it can receive data and sort of arrays
    // selectFeed = () => {

    //     const products = [{ id: 1, product: 'Sugar', quality: 'Good', quantity: '200 packs' }, { id: 2, product: 'Wheat', quality: 'Super', quantity: '100 bags' }, { id: 3, product: 'Rice', quality: 'Fine', quantity: '50 packs' }];
    //     $scope.data.products = products;
    //     selectFeed () {

    //        const products = [{ id: 1, product: 'Sugar', quality: 'Good', quantity: '200 packs' }, { id: 2, product: 'Wheat', quality: 'Super', quantity: '100 bags' }, { id: 3, product: 'Rice', quality: 'Fine', quantity: '50 packs' }];
    //        $scope.products = products;
    //  }
    

    //     $scope.$apply(() => {

    // const products = [{ id: 1, product: 'Sugar', quality: 'Good', quantity: '200 packs' }, { id: 2, product: 'Wheat', quality: 'Super', quantity: '100 bags' }, { id: 3, product: 'Rice', quality: 'Fine', quantity: '50 packs' }];
    // $scope.data.products = products;



    // });




   // end of the test




 

    scrollToBottom(){
        const messageThread = document.querySelector('.message-thread');
        setTimeout(() => {
            messageThread.scrollTop = messageThread.scrollHeight + 500;
        }, 10);        
    }
}
