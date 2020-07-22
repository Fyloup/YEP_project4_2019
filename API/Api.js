import axios from 'axios';

let KodiAPI = {};
let entryPoint = "http://localhost:3001";
const header = {
    'Content-Type': 'application/json'
}

///Post methods

KodiAPI.signIn = async(email) => {
    try {
        const response = await axios({
            method: "POST",
            headers: header,
            url: entryPoint + "/users/login",
            data: {
                email: email,
            }
        });
        return response.data;
    } catch (e) {
        return ("refused");
    }
}

KodiAPI.signUp = async (email) => {
    try {
        const response = await axios({
            method: 'POST',
            url: entryPoint + "/users",
            data: {
                name: "test",
                surname: "test",
                email: email,
                password: "test"
            }
        });
        return response.data;
    } catch (e) {
        console.log("error: ", e);
    }
};

KodiAPI.followTwitchChannel = async(token, name, userId) => {
    try {
        const response = await axios({
            method:  "POST",
            url: entryPoint + "/twitch/follow",
            headers: {
                Authorization: "Bearer " + token
            },
            data: {
                name: name,
                userId: userId
            }
        });
        return response.data;
    } catch (e) {
        console.log(e);
    }
}

KodiAPI.uploadPicture = async(token, photo, title, description) => {
    try {
        const response = await axios({
            method: "POST",
            url: entryPoint + "/upload/file",
            headers: {
                Authorization: "Bearer " + token
            },
            data: {
                photo: photo,
                title: title,
                description : description
            }
        });
        return response.data;
    } catch (e) {
        console.log(e);
    }
}

KodiAPI.addtoWatchList = async(token, data) => {
    try {
        const response = await axios({
            method: "POST",
            url: entryPoint + "/videoList/addToWatchList",
            headers: {
                Authorization: "Bearer " + token
            },
            data: data
        });
        return response.data;
    } catch (e) {
        console.log(e);
    }
}


///Get methods

KodiAPI.getTopTwitchGames = async () => {
    let res = await axios
        .get('http://localhost:3001/twitch/TopGames', {
            headers: header,
        })
        .then(r => {
            console.log(r);
            return r;
        })
        .catch(e => console.log(e));
};

KodiAPI.getTopSteamsByGames = async (gameId) => {
    let res = await axios
        .get('http://localhost:3001/twitch/Streams/' + gameId, {
            headers: header,
        })
        .then(r => {
            console.log(r);
            return r;
        })
        .catch(e => console.log(e));
};

KodiAPI.getFavTwitchStream = async (token) => {
    let res = await axios
        .get('http://localhost:3001/twitch/favStream', {
            headers: {
                Authorization: "Bearer " + token
            },
        })
        .then(r => {
            console.log(r);
            return r;
        })
        .catch(e => console.log(e));
};


KodiAPI.getTopTvShows = async () => {
    let res = await axios
        .get('http://localhost:3001/videoList/topShow', {
            headers: header,
        })
        .then(r => {
            console.log(r);
            return r;
        })
        .catch(e => console.log(e));
};


KodiAPI.getMyWatchList = async (token) => {
    let res = await axios
        .get('http://localhost:3001/videoList/details', {
            headers: {
                Authorization: "Bearer " + token
            },
        })
        .then(r => {
            console.log(r);
            return r;
        })
        .catch(e => console.log(e));
};


KodiAPI.getUserInfo = async(token) => {
    try {
        const response = await axios({
            method: "GET",
            headers: {
                Authorization: "Bearer " + token
            },
            url: entryPoint + "/users/info"
        });
        return response.data;
    } catch (e) {
        return ("refused");
    }
}

//Patch methods

KodiAPI.patchUserInfo = async(token, data) => {
    try {
        const response = await axios({
            method: "PATCH",
            headers: {
                Authorization: "Bearer " + token
            },
            url: entryPoint + "/users",
            data: data
        });
        return response.data;
    } catch (e) {
        return ("refused");
    }
}

KodiAPI.unfollowStreamer = async(token, name) => {
    try {
        const response = await axios({
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + token
            },
            url: entryPoint + "/twitch/remove",
            data: {
                name: name
            }
        });
        return response.data;
    } catch (e) {
        console.log(e);
        return ("refused");
    }
}

KodiAPI.removeShow = async(token, name) => {
    try {
        const response = await axios({
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + token
            },
            url: entryPoint + "/videoList/remove",
            data: {
                name: name
            }
        });
        return response.data;
    } catch (e) {
        console.log(e);
        return ("refused");
    }
}

export default KodiAPI;
