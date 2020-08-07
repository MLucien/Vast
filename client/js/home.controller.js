/**
 * Buzz one pager
 * controller
 */

"user strict";

app.controller("homeController", function (
  $scope,
  $routeParams,
  $location,
  appService
) {
  const UserId = $routeParams.userId;

  $scope.data = {
    username: "",
    posts: "",
    name: "",
    surname: "",
    age: "",
    gender: "",
    relantionshiop: "",
    country: "",
    postList: [],
    postList2: [],
    chatlist: [],
    selectedFriendId: null,
    selectedFriendName: null,
    messages: [],
    postbuzz: [],
  };

  appService.connectSocketServer(UserId);

  appService
    .httpCall({
      url: "/userSessionCheck",
      params: {
        userId: UserId,
      },
    })
    .then((response) => {
      $scope.data.username = response.username;
     console.log(response);
      appService.socketEmit(`chat-list`, UserId);
      appService.socketOn("chat-list-response", (response) => {
        $scope.$apply(() => {
          if (!response.error) {
            if (response.singleUser) {
              /*
               * Removing duplicate user from chat list array
               */
              if ($scope.data.chatlist.length > 0) {
                $scope.data.chatlist = $scope.data.chatlist.filter(function (
                  obj
                ) {
                  return obj.id !== response.chatList.id;
                });
              }
              /*
               * Adding new online user into chat list array
               */
              $scope.data.chatlist.push(response.chatList);
            } else if (response.userDisconnected) {
              /*
               * Removing a user from chat list, if user goes offline
               */
              $scope.data.chatlist = $scope.data.chatlist.filter(function (
                obj
              ) {
                return obj.socketid !== response.socketId;
              });
            } else {
              /*
               * Updating entire chatlist if user logs in
               */
              $scope.data.chatlist = response.chatList;
            }
          } else {
            alert(`Faild to retrieve your messages`);
          }
        });
      });

      /*
       * This eventt will display the new incmoing message
       */
      appService.socketOn("add-message-response", (response) => {
        $scope.$apply(() => {
          if (response && response.fromUserId == $scope.data.selectedFriendId) {
            $scope.data.messages.push(response);
            appService.scrollToBottom();
          }
        });
      });
    })
    .catch((error) => {
      console.log(error.message);
      $scope.$apply(() => {
        $location.path(`/`);
      });
    });

  $scope.sendfeed = () => {
    console.log("this is being reached click");

    appService
      .httpCall({
        url: "/posts",
        params: {
          posts: $scope.data.postbuzz,
          from_user_id: $scope.data.username,
        },
      })
      .then((response) => {
        $scope.$apply();
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  $scope.selectFriendToChat = (friendId) => {
    /*
     * Highlighting the selected user from the chat list
     */
    const friendData = $scope.data.chatlist.filter((obj) => {
      return obj.id === friendId;
    });
    $scope.data.selectedFriendName = friendData[0]["username"];
    $scope.data.selectedFriendId = friendId;
    /**
     * This HTTP call will fetch chat between two users
     */
    appService
      .getMessages(UserId, friendId)
      .then((response) => {
        $scope.$apply(() => {
          $scope.data.messages = response.messages;
        });
      })
      .catch((error) => {
        console.log(error);
        alert("Try go back and redo somethings you did!.");
      });
  };

  // const dataList = [
  //   {
  //     id: "5f20def9fd06265b85fadc19",
  //     posts: "Occaecat aliqua ut duis dolor officia dolore cupidatat ",
  //     from_user_id: "Lindsey",
  //   },
  //   {
  //     id: "5f20def96371644daea5a9f1",
  //     posts: "Veniam veniam amettur ut ad. Enim tempor nulla tempor",
  //     from_user_id: "Garza",
  //   },
  //   {
  //     id: "5f20def9b79084d992ec385d",
  //     posts:
  //       "laborum enim. voluptate cillum culpa quis aliqua voluptate magna ipsum ex Lorem cupidata",
  //     from_user_id: "Rhonda",
  //   },
  //   {
  //     id: "5f20def9a3e6103bf10c0fa6",
  //     posts:
  //       "Cilum quis ddunt qui duis ad id  Deserunt dolor amet minim culpa ullamco minim consecte",
  //     from_user_id: "Villarreal",
  //   },
  //   {
  //     id: "5f20def92f622d1248097748",
  //     posts:
  //       "Ofa nisi sint ipsum tempor. Mollit occaecaerit ut ipsum consequat eiusmod aliqua.",
  //     from_user_id: "James",
  //   },
  //   {
  //     id: "5f20def92f62ffff2d1248097748",
  //     posts:
  //       "Ofa nisi sint ipsum tempor. Mollit occaecaerit ut ipsum consequat eiusmod aliqua.",
  //     from_user_id: "Lucien",
  //   },
  // ];

  // $scope.postinfo3 = [
  //   {
  //     id: "5f20def9fd06265b85fadc19",
  //     posts: "Occaecat aliqua ut duis dolor officia dolore cupidatat ",
  //     from_user_id: "Lindsey",
  //   },
  //   {
  //     id: "5f20def96371644daea5a9f1",
  //     posts: "Veniam veniam amettur ut ad. Enim tempor nulla tempor",
  //     from_user_id: "Garza",
  //   },
  //   {
  //     id: "5f20def9b79084d992ec385d",
  //     posts:
  //       "laborum enim. voluptate cillum culpa quis aliqua voluptate magna ipsum ex Lorem cupidata",
  //     from_user_id: "Rhonda",
  //   },
  //   {
  //     id: "5f20def9a3e6103bf10c0fa6",
  //     posts:
  //       "Cilum quis ddunt qui duis ad id  Deserunt dolor amet minim culpa ullamco minim consecte",
  //     from_user_id: "Villarreal",
  //   },
  //   {
  //     id: "5f20def92f622d1248097748",
  //     posts:
  //       "Ofa nisi sint ipsum tempor. Mollit occaecaerit ut ipsum consequat eiusmod aliqua.",
  //     from_user_id: "James",
  //   },
  //   {
  //     id: "5f20def92f62ffff2d1248097748",
  //     posts:
  //       "Ofa nisi sint ipsum tempor. Mollit occaecaerit ut ipsum consequat eiusmod aliqua.",
  //     from_user_id: "Lucien",
  //   },
  // ];

  //how to get data if we store it internal in a file
  // $http.get('feed.json').then( (response) => {
  //             $scope.postinfo2 = response.data;

  //            // $scope.data.messages = response.messages;
  //     }).catch( (error) => {
  //         console.log(error);
  //         alert('Error from json!.');
  //     });

  //     $http.get('js/feed.json').then(function(response){
  //         $scope.postinfo = response.data;
  //   });

  // console.log(dataList);

  appService
    .getPostList()
    .then((response) => {
      $scope.$apply(() => {
        $scope.postsData = response.postsData;
      //output to see the array before commit to the scope  console.log(response);
      });
    })
    .catch((error) => {
      console.log(error);
      alert("Try go back and redo somethings you did!.");
    });

  $scope.sendMessage = (event) => {
    if (event.keyCode === 13) {
      let toUserId = null;
      let toSocketId = null;

      /* Fetching the selected User from the chat list starts */
      let selectedFriendId = $scope.data.selectedFriendId;
      if (selectedFriendId === null) {
        return null;
      }
      friendData = $scope.data.chatlist.filter((obj) => {
        return obj.id === selectedFriendId;
      });
      /* Fetching the selected User from the chat list ends */

      /* Emmiting socket event to server with Message, starts */
      if (friendData.length > 0) {
        toUserId = friendData[0]["id"];
        toSocketId = friendData[0]["socketid"];

        let messagePacket = {
          message: document.querySelector("#message").value,
          fromUserId: UserId,
          toUserId: toUserId,
          toSocketId: toSocketId,
        };
        $scope.data.messages.push(messagePacket);
        appService.socketEmit(`add-message`, messagePacket);

        document.querySelector("#message").value = "";
        appService.scrollToBottom();
      } else {
        alert("You were not supposed to see this error, sorry try again");
      }
      /* Emmiting socket event to server with Message, ends */
    }
  };

  $scope.alignMessage = (fromUserId) => {
    return fromUserId == UserId ? true : false;
  };

  $scope.logout = () => {
    appService.socketEmit(`logout`, UserId);
    $location.path(`/`);
  };
});
