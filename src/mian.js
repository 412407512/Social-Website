let postsObject,
    username = document.getElementById('username'),
    username_register = document.getElementById('username-register'),
    password = document.getElementById('password'),
    password_register = document.getElementById('password-register'),
    name = document.getElementById('name'),
    email = document.getElementById('email'),
    image = document.getElementById('image'),

    // new post 

    post_title = document.getElementById('post-title'),
    post_image = document.getElementById('post-image'),
    post_desc = document.getElementById('post-desc')

    ;

// fill inputs after login
if (username) {
    username.value = 'username';
    password.value = 'password';
}


// login user is exist
function login() {
    let username = document.getElementById('username').value,
        password = document.getElementById('password').value;
    let dataUser = {
        username: username,
        password: password
    }
    LoaderToggle(true)
    axios.post('https://tarmeezacademy.com/api/v1/login', dataUser, {
        headers: {
            'Accept': 'application/json'
        }
    }).then((response) => {

        // console.log(response.data)
        let token = response.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        // close Modal 
        closeModal('loginModal');
        // show Message Success
        toastAlert('Login Success', 'success')
        setup_ui()
    }).catch((e) => {
        toastAlert(e.response.data.message, 'danger')
    }).finally(() => {
        LoaderToggle(false)
    })
}

// add new user 
function register() {
    console.log(image.files[0])

    let dataUser = {
        username: username_register.value,
        password: password_register.value,
        name: name.value,
        email: email.value,
        image: image.files[0]
    }
    LoaderToggle(true)
    axios.post('https://tarmeezacademy.com/api/v1/register', dataUser, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
        }
    })
        .then((response) => {
            let token = response.data.token;
            if (token) {
                localStorage.token = token;
                localStorage.user = JSON.stringify(response.data.user);
            }
            // close Modal 
            closeModal('registerModal')
            // show message
            toastAlert('Register Successfully', 'success');
            // update changes 
            setup_ui()
        })
        .catch(e => toastAlert(e.response.data.message, 'danger'))
        .finally(() => {
            LoaderToggle(false)
        })
}

window.onload = () => {
    if (typeof getPosts === 'function') {
        getPosts()
    }
    setup_ui()
}

function checkUserAuth(post) {
    let user = '',
        EditBtn = ``;
    if (localStorage.getItem('user')) {
        user = JSON.parse(localStorage.getItem('user'))
        if (post.author.id === user.id) {
            EditBtn = `
            <div style='margin-left:auto'>
                <button class='btn btn-primary btn-sm' onclick='editPost(${post.id})'>Edit</button>
                <button class='btn btn-danger btn-sm' onclick='destroy(${post.id})'>Remove</button>
            </div>
            `;
        }
    }
    return EditBtn;
}

// make structure of post 
function createPostElement(post) {
    let EditBtn = checkUserAuth(post)
    // <div class="card-header" onclick="fetchUserInfo('${encodeURIComponent(JSON.stringify(post))}')" style='cursor:pointer'>

    return `
    <div class="post card mb-2 shadow">
    
                <div  class="card-header"  style='cursor:pointer'>
                    <div class="d-flex align-items-center  gap-2">
                        <a href='profile.html?user_id=${post.author.id}' class='d-flex align-items-center  gap-2'>
                        <div><img src="${post.author.profile_image}" alt="" class="user-image rounded-circle border" width="40" height="40"></div>
                        <b><span href="">@${post.author.username}</span></b>
                        </a>
                        ${EditBtn}
                    </div>
                </div>
                <a href="./post_detailes.html?id=${post.id}">

                <div class="card-body px-2">
                    <div class="image-post mb-2">
                        <img  src="${post.image = post.image ? post.image : ''}" class="rounded " alt="">
                    </div>
                    <div class="card-text text-dark mb-2">${post.created_at}</div>
                    <h5 class="card-title">${post.title == null ? 'Title-Post' : post.title}</h5>
                    <div class="card-text">
                        <p>${post.body}</p>
                    </div>
                    <hr>
                    <div class='d-flex gap-3'>
                        <a href="./post_detailes.html?id=${post.id}"> 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                        </svg>
                        (${post.comments_count}) Comments
                        </a>
                        <div id='post-tag-${post.id}' class='tags'></div>
                    </div>
                </div>
            </a>    

            </div>

        `;
    // filling tags in each post
    let current_tags_el = `post-tag-${post.id}`;
    document.getElementById(current_tags_el).innerHTML = '';
    for (const tag of post.tags) {
        document.getElementById(current_tags_el).innerHTML += `
            <a href='' class='badge bg-secondary ms-1'>#${tag}</a>
            `;
    }
}



// logout user
function logout() {
    LoaderToggle(true)
    axios.post('https://tarmeezacademy.com/api/v1/logout', null, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.token}`
        }
    })
        .then((response) => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setup_ui()
            // show alert logout 
            toastAlert('Logged out Success', 'success')

        })
        .catch(e => toastAlert(e.response.data.message, 'danger'))
        .finally(() => {
            LoaderToggle(false)
        })
}

// show Message by Alert
function toastAlert(msg, type) {
    const alertPlaceholder = document.querySelector('.liveAlertPlaceholder')

    const alert = (msg, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${msg}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')
        if (alertPlaceholder) {
            alertPlaceholder.innerHTML = '';
            alertPlaceholder.append(wrapper)
        }

    }
    alert(msg, type)

    // Get the element you want to hide
    const alertHide = document.querySelector('.liveAlertPlaceholder');

    alertHide.classList.add('show')

    setTimeout(() => {
        alertHide.classList.remove('show')
    }, 2000);

}

// close modal 
function closeModal(formName) {
    let mol = document.getElementById(formName)
    const InstanceModal = bootstrap.Modal.getInstance(mol);
    InstanceModal.hide();
}


// make changes after any registrations 
function setup_ui() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    let btn_add_new_post = document.querySelector('.btn-add-new-post');

    if (!token == '' && token.length > 40) {
        document.querySelector('.btn-actions-nav').innerHTML = `
        <div><img src='${user.profile_image}'  class='rounded-circle' style='object-fit:cover; width:40px; height:40px'></div>
        <button class="register btn btn-outline-danger mx-1" onclick='logout()' >Logout</button>
       `;

        // set uri to profile user link
        let linkProfile = document.getElementById('profile-href');
        if (linkProfile) {
            linkProfile.setAttribute('href', `profile.html?user_id=${user.id}`);
        }

        //    console.log(document.getElementById('profile-href'))

        // show btn add new post
        if (btn_add_new_post) {
            document.querySelector('.btn-add-new-post').style = 'display:grid';
        }
    } else {
        document.querySelector('.btn-actions-nav').innerHTML = `
        <button class="login btn btn-outline-success mx-1" data-bs-toggle="modal"data-bs-target="#loginModal">Login</button>
        <button class="register btn btn-outline-success mx-1"  data-bs-target='#registerModal' data-bs-toggle='modal'>Register</button>
        `;
        if (btn_add_new_post) {
            document.querySelector('.btn-add-new-post').style = 'display:none';
        }
    }
    if (typeof getPosts === 'function') {
        getPosts()
    }
}
// get posts 
function getPosts() {
    LoaderToggle(true)
    axios.get('https://tarmeezacademy.com/api/v1/posts?limit=2')

        .then((response) => {
            postsObject = response.data.data,
                postsElement = document.getElementById('posts');
            if (postsElement) {
                postsElement.innerHTML = ''; // Clear the existing posts
                for (const post of postsObject) {
                    postsElement.innerHTML += createPostElement(post);
                }
                
            }
        })
        .catch(
            error => toastAlert(error, 'danger')
            // error => console.log(error)
        ).finally(()=>{
            LoaderToggle(false)
        })
}



// get one post 
const urlParams = new URLSearchParams(location.search);
let updateComments, paramPost;
function getPost() {
    if (urlParams.has('id')) {
        paramPost = urlParams.get('id')
        axios.get(`https://tarmeezacademy.com/api/v1/posts/${paramPost}`)
            .then((response) => {
                document.querySelector('.user_post').innerHTML = `Published By: ${response.data.data.author.username}`;

                let post_details = response.data.data;

                let ActionsBtn = checkUserAuth(post_details);

                let commentsContent = ``;
                for (const comment of response.data.data.comments) {
                    commentsContent += `
                    <div class='comment col-12'>
                    <img src='${comment.author.profile_image}' class='img-comment'>
                    <div class='info-user'>
                        <h6>${comment.author.username}</h6>
                        <p>${comment.body}</p>
                    </div>    
                    </div>`;
                }


                const postContent = `
                <div class="post card mb-2 shadow" id='post-${post_details.id}'>
                    <div class="card-header">
                        <div class="d-flex align-items-center  gap-2">
                            <a class='d-flex align-items-center  gap-2' href='profile.html?user_id=${post_details.author.id}'>
                                <div><img src="${post_details.author.profile_image}" alt="" class="user-image rounded-circle border" width="40" height="40"></div>
                                <b><span href="">@${post_details.author.username}</span></b>
                            </a>
                            ${ActionsBtn}
                        </div>
                   </div>
                
                   <div class="card-body px-2">
                        <div class="image-post mb-2">
                            <img  src="${post_details.image = post_details.image ? post_details.image : ''}" class="rounded " alt="">
                        </div>
                        <div class="card-text text-dark mb-2">${post_details.created_at}</div>
                        <h5 class="card-title">${post_details.title == null ? 'Title-Post' : post_details.title}</h5>
                        <div class="card-text">
                            <p>${post_details.body}</p>
                        </div>
                        <hr>
                        <div class='p-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                            </svg>
                            (<span class='count_comments'>${post_details.comments_count}</span>)Comments
                            <div class='comments row mt-3'>
                                <form  class='d-flex gap-2  mb-3'>
                                    <input type="text" class="form-control" id='comment_name' placeholder="add comment">
                                    <button type='button' class='btn btn-success' onclick='new_comment()'>comment</button>    
                                </form>
                                ${commentsContent}
                            </div>
                            </div>
                    </div>
                </div>
                `;
                document.getElementById('post_details').innerHTML = '';
                document.getElementById('post_details').innerHTML = postContent
            }).catch(e => console.log(e));
    }
}

// add new post OR Update Post 
function new_post() {

    let inputCheck = document.getElementById('check-type-input').value;

    // check to decide store or update
    let isCreate = inputCheck == null || inputCheck == "";


    let url = ``;
    let dataPost = {
        title: post_title.value,
        body: post_desc.value,
        image: post_image.files[0]
    }
    if (isCreate === true) {
        // store
        url = `https://tarmeezacademy.com/api/v1/posts`;
        suitMessage = 'Added Post Successfully'
    }
    else {
        // update
        url = `https://tarmeezacademy.com/api/v1/posts/${inputCheck}`;
        suitMessage = 'updated Post Successfully';
        dataPost['_method'] = 'put';
    }
    axios.post(url, dataPost, {
        headers: {
            'Authorization': `Bearer ${localStorage.token}`,
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
        }
    }).then((response) => {

        // close Modal
        closeModal('new-post-Modal')
        // show message
        toastAlert(suitMessage, 'success');
        // // update posts
        getPosts()

        // Update changes or perform additional actions
        setup_ui()

        // update current post after updating

        getPost()

    })
        .catch(e => toastAlert(e, 'danger'))
}



// edit post
function editPost(id) {
    let ModalForm = document.getElementById('new-post-Modal'),
        postModal = new bootstrap.Modal(ModalForm),
        post_title = ModalForm.querySelector('#post-title'),
        post_desc = ModalForm.querySelector('#post-desc'),
        post_image = ModalForm.querySelector('#post-image')
    token = localStorage.getItem('token')
        ;

    // get element check input
    document.getElementById('check-type-input').value = id;

    ModalForm.querySelector('.modal-title').innerHTML = 'UPDATE POST';
    ModalForm.querySelector('.btn-success').innerHTML = 'Edit';

    let dataPost = {
        title: post_title.value,
        body: post_desc.value,
        image: post_image.files[0]
    }
    let headers = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
        }
    }
    axios.get(`https://tarmeezacademy.com/api/v1/posts/${id}`, dataPost, headers)
        .then((response) => {
            post_title.value = response.data.data.title
            post_desc.value = response.data.data.body
        })
        .catch(e => console.log(e))
    postModal.toggle();
}


// delete post 

function destroy(id) {
    if (id) {
        let headers = {
            headers: {
                'Authorization': `Bearer ${localStorage.token}`,
                'Accept': 'application/json'
            }
        }
        if (window.confirm('Are You Sure!?')) {
            axios.delete(`https://tarmeezacademy.com/api/v1/posts/${id}`, headers)
                .then((response) => {
                    getPosts()
                    toastAlert('deleted Success', 'success');
                    setup_ui()
                    if (urlParams.has('id')) {
                        location.href = './home.html'
                    }
                })
                .catch(e => toastAlert(e.response.data.message, 'danger'))
        }
    }
}


function getInfoUCurrentUser(user) {
    return `
    <div class="col-md-3 " id='info-user'>
                <div class="row">
                    <div class="col-md-6">
                        <img src="${user.profile_image}" width="60" height='70' style='object-fit:cover' class='rounded-circle'>
                    </div>
                    <div class="col-md-6">
                        <p class="mb-3"><b>Email:</b> ${user.email}</p>
                        <p class="mb-3"><b>Name:</b> ${user.name}</p>
                        <p><b>username:</b> ${user.username}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3"></div>
            <div class="col-md-3"></div>
            <div class="col-md-3">
                <div class="row">
                    <div class="col-md-6">
                        <h1 class="count_posts">${user.posts_count}</h1>posts
                    </div>
                    <div class="col-md-6">
                        <h1 class="count_comments">${user.comments_count}</h1>comments
                    </div>
                </div>
            </div>
        </div>
    `;
}



// function fetchUserInfo(user) {
//     let decodedUser = decodeURIComponent(user); // Decode the URL-encoded JSON string
//     let userData = JSON.parse(decodedUser); // Parse the JSON data
//     location.href=`profile.html?user_id=${userData.author.id}`
//     axios.get(`https://tarmeezacademy.com/api/v1/users/${userData.author.id}`,
//         {
//             headers: {
//                 'Authorization': `Bearer ${localStorage.token}`
//             }
//         }
//     )
//         .then((response) => {
//             console.log(response.data.data)
//             let contentProfile = document.querySelector('.profile-content').innerHTML = getInfoUCurrentUser(response.data.data);
//         })
//         .catch(
//             // e => toastAlert(e.response.data.message,'danger')
//             e => console.log(e)
//         )
// }


// fetch profile user 
function getApiUser(user_id) {
    // mean i connot see any profile of users except my profile

    // userStorage=JSON.parse(localStorage.getItem('user'));
    // if((user_id && userStorage) && (user_id == userStorage.id) )
    // {
    axios.get(`https://tarmeezacademy.com/api/v1/users/${user_id}`,
        {
            headers: {
                'Authorization': `Bearer ${localStorage.token}`
            }
        }
    )
        .then((response) => {
            console.log(response.data.data)
            let contentProfile = document.getElementById('profile-content').innerHTML = getInfoUCurrentUser(response.data.data);
            // fetch posts
            getPostsForCurrentUser();
        })
        .catch(
            // e => toastAlert(e.response.data.message,'danger')
            e => console.log(e)
        )
    // }
}


// fetch posts for the clicked user 

function getPostsForCurrentUser() {
    let containerPosts = document.getElementById('posts_current_user');
    axios.get(`https://tarmeezacademy.com/api/v1/users/${user_id}/posts`)
        .then((response) => {
            let posts = response.data.data
            for (const post of posts) {
                containerPosts.innerHTML += createPostElement(post)
            }
        })
        .catch(e => console.log(e))
}


function LoaderToggle(show = true) {
    if (show === true) {
        document.querySelector('.load-parent').style = 'display:grid';
    }
    else if (show === false) {
        document.querySelector('.load-parent').style = 'display:none';
    }
}