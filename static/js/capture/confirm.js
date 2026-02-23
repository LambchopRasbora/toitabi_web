
const params={
        spotId:response.spotId
    };
const isSuccess=response.success;
const redirectURL = isSuccess?GetparamURL("/spotpost/postsuccess",params):"/spotpost/postfailure";
window.location.href=redirectURL;