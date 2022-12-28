const apiUrl = "http://localhost:3000"
// const apiUrl = "https://final-backend-rl106.herokuapp.com"
export function logout() {
    fetch(`${apiUrl}/logout`, {
        credentials: 'include',
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        // body: JSON.stringify(BODY)
    }).then((response) => response.json())
        .then((response) => {
            if (response.result === "success") {
                console.log("logout successful")
            }
            else{
                console.log(response.result)
            }
        })

}

export async function getArticles() {
    var articles
    await fetch(`${apiUrl}/articles`, {
        credentials: 'include',
        method: 'GET'
    }).then((response) => response.json())
        .then((response) => {
            articles = response.articles
        })
    return articles
}

export async function getHeadline(uname) {
    var headline
    await fetch(`${apiUrl}/headline/${uname}`, {
        credentials: 'include',
        method: 'GET'
    }).then((response) => response.json())
        .then((response) => {
            headline = response.headline
        })
    return headline
}

export async function putHeadline(uname, newHeadline) {
    var headline
    var BODY = {
        headline: newHeadline
    }
    await fetch(`${apiUrl}/headline`, {
        credentials: 'include',
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(BODY)
    }).then((response) => response.json())
        .then((response) => {
            headline = response.headline
        })
    return headline
}


export async function getEmail() {
    var email
    await fetch(`${apiUrl}/email`, {
        credentials: 'include',
        method: 'GET'
    }).then((response) => response.json())
        .then((response) => {
            email = response.email
        })
    return email
}

export async function putEmail(newEmail) {
    if (!newEmail) return
    var email
    var BODY = {
        email: newEmail
    }
    await fetch(`${apiUrl}/email`, {
        credentials: 'include',
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(BODY)
    }).then((response) => response.json())
        .then((response) => {
            email = response.email
        })
    return email
}

export async function getZipcode() {
    var zipcode
    await fetch(`${apiUrl}/zipcode`, {
        credentials: 'include',
        method: 'GET'
    }).then((response) => response.json())
        .then((response) => {
            zipcode = response.zipcode
        })
    return zipcode
}

export async function putZipcode(newZipcode) {
    if (newZipcode === "")  return
    var zipcode
    var BODY = {
        zipcode: newZipcode
    }
    await fetch(`${apiUrl}/zipcode`, {
        credentials: 'include',
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(BODY)
    }).then((response) => response.json())
        .then((response) => {
            zipcode = response.zipcode
        })
    return zipcode
}

export async function getDob() {
    var dob
    await fetch(`${apiUrl}/dob`, {
        credentials: 'include',
        method: 'GET'
    }).then((response) => response.json())
        .then((response) => {
            dob = response.dob
        })
    return dob
}


export async function getPhone() {
    var phone
    await fetch(`${apiUrl}/phone`, {
        credentials: 'include',
        method: 'GET'
    }).then((response) => response.json())
        .then((response) => {
            phone = response.phone
        })
    return phone
}

export async function putPhone(newPhone) {
    if (newPhone === "")  return
    var phone
    var BODY = {
        phone: newPhone
    }
    await fetch(`${apiUrl}/phone`, {
        credentials: 'include',
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(BODY)
    }).then((response) => response.json())
        .then((response) => {
            phone = response.phone
        })
    return phone
}

export async function putAvatar(img) {
    if (img === "") return
    var payload
    payload = new FormData();
    payload.append('img', img)
    var newAvatar
    await fetch(`${apiUrl}/avatar`, {
        credentials: "include",
        method: "PUT",
        body: payload,
    })
        .then((response) => response.json())
        .then((resp) => {
            if(resp.result === 'success') {
                newAvatar = resp.avatar;
                console.log("Successfully Changed Avatar")
            }
            else {
                // TODO What may cause failed post uploading?
                console.log("Failed in Uploading Avatar")
            }
        })
        .catch((err) => {
            console.log(err.message)
        })
    return newAvatar
}

export async function getAvatar() {
    var avatar
    await fetch(`${apiUrl}/avatar`, {
        credentials: 'include',
        method: 'GET'
    }).then((response) => response.json())
        .then((response) => {
            avatar = response.avatar
        })
    return avatar
}

export async function putPassword(newPassword) {
    if (newPassword === "")  return
    var password
    var BODY = {
        password: newPassword
    }
    await fetch(`${apiUrl}/password`, {
        credentials: 'include',
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(BODY)
    }).then((response) => response.json())
        .then((response) => {
    })
}

export async function findUser(text) {
    var following
    await fetch(`${apiUrl}/following/${text}`, {
        credentials: 'include',
        method: 'PUT'
    }).then((response) => response.json())
        .then((response) => {
            following = response.following
        })
    // following = await names2infos(following)
    console.log("in actions add "+following.length)
    return following
}

async function names2infos(names) {
    for (var i=0; i<names.length; i++) {
        var follow = names[i]
        var headline
        var avatar
        await fetch(`${apiUrl}/headline/${follow}`, {
            credentials: 'include',
            method: 'GET'
        }).then((resp) => resp.json())
            .then((resp) => {
                headline = resp.headline
            })
        await fetch(`${apiUrl}/avatar/${follow}`, {
            credentials: 'include',
            method: 'GET'
        }).then((resp) => resp.json())
            .then((resp) => {
                avatar = resp.avatar
            })
        names[i] = {
            username: follow,
            headline: headline,
            avatar: avatar
        }
    }
    return names
}

export async function getFollows(user) {
    var following
    await fetch(`${apiUrl}/following`, {
        credentials: 'include',
        method: 'GET'
    }).then((response) => response.json())
        .then((response) => {
            following = response.following
        })
    // following = await names2infos(following)
    return following
}

export function delFollow(user) {
    var following
    return fetch(`${apiUrl}/following/${user}`, {
        credentials: 'include',
        method: 'DELETE'
    }).then((response) => response.json())
        .then((response) => {
            following = response.following
            return following
        })
    // following = await names2infos(following)
    console.log("In actions del "+following.length)
    return following
}