"user strict";

app.controller("authController", function (
  $scope,
  $location,
  $timeout,
  appService
) {
  $scope.data = {
    regUsername: "",
    regPassword: "",
    usernameAvailable: false,
    loginsurname: "",
    loginname: "",
    Userage: "",
    regGender: "",
    regRelantionshiop: "",
    logincountry: "",
  };

  /* verify username existence*/
  let TypeTimer;
  const TypingInterval = 800;
  /* timer ends*/

  $scope.initiateCheckUserName = () => {
    $scope.data.usernameAvailable = false;
    $timeout.cancel(TypeTimer);
    TypeTimer = $timeout(() => {
      appService
        .httpCall({
          url: "/usernameCheck",
          params: {
            username: $scope.data.regUsername,
          },
        })
        .then((response) => {
          $scope.$apply(() => {
            $scope.data.usernameAvailable = response.error ? true : false;
          });
        })
        .catch((error) => {
          $scope.$apply(() => {
            $scope.data.usernameAvailable = true;
          });
        });
    }, TypingInterval);
  };

  $scope.clearCheckUserName = () => {
    $timeout.cancel(TypeTimer);
  };

  $scope.registerUser = () => {
    appService
      .httpCall({
        url: "/registerUser",
        params: {
          username: $scope.data.regUsername,
          password: $scope.data.regPassword,
          surname: $scope.data.loginsurname,
          name: $scope.data.loginname,
          age: $scope.data.Userage,
          gender: $scope.data.regGender,
          relantionshiop: $scope.data.regRelantionshiop,
          country: $scope.data.logincountry,
        },
      })
      .then((response) => {
        $location.path(`/home/${response.userId}`);
        $scope.$apply();
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  $scope.loginUser = () => {
    appService
      .httpCall({
        url: "/login",
        params: {
          username: $scope.data.loginUsername,
          password: $scope.data.loginPassword,
          surname: $scope.data.loginsurname,
          name: $scope.data.loginname,
          age: $scope.data.Userage,
          gender: $scope.data.regGender,
          relantionshiop: $scope.data.regRelantionshiop,
          country: $scope.data.logincountry,
        },
      })
      .then((response) => {
        $location.path(`/home/${response.userId}`);
        $scope.$apply();
      })
      .catch((error) => {
        alert(error.message);
      });
  };
});
