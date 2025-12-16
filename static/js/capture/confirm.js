
const params={
        spot_id:response.spot_id
    };
const isSuccess=response.success;
const redirectURL = isSuccess?GetparamURL("/spotpost/postsuccess",params):"/spotpost/postfailure";
window.location.href=redirectURL;