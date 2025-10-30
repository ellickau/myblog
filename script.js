
// ------------------------------------ //
// Scripts to toggle light or dark mode //
// -------------------------------------//
const KEY = 'theme';               // Key name for localStorage
const DARK = 'dark';               // Value to store when dark mode is active
const CLASS = 'dark';              // CSS class applied to <body> for dark mode

function applyTheme(isDark) {
  const btn = document.getElementById('btn-dark-mode');
  if (!btn) return;
  document.body.classList.toggle(CLASS, isDark);
  btn.setAttribute('aria-pressed', String(isDark));
  
  const iconSun = "<img src='./img/sun-fill.svg'>";
  const iconMoon = "<img src='./img/moon-fill.svg'>";

  if (isDark) btn.innerHTML = iconSun;
    else btn.innerHTML = iconMoon;

  localStorage.setItem(KEY, isDark ? DARK : 'light');
}

function initTheme() {
  const btn = document.getElementById('btn-dark-mode');
  if (!btn) return;

  // Initialize them, default by light mode //
  const saved = localStorage.getItem(KEY);
  const isDark = saved ? saved === DARK : false;
  applyTheme(isDark);

  // Toggle when button is clicked //
  btn.addEventListener('click', () => {
    const newIsDark = !document.body.classList.contains(CLASS);
    applyTheme(newIsDark);
  });
}

// Run setup once DOM is ready
document.addEventListener("DOMContentLoaded", initTheme);

// ================================================== //
// addEventListener handlers for all Forms in my-blog //
// ================================================== // 
document.addEventListener("DOMContentLoaded", () => {

  // ===== logout and & redirect ==== //
  const authLink = document.getElementById("authLink");
  const username = localStorage.getItem("myblog_username");
  const blogLink = document.querySelector('a[href="blog.html"]');

  if (authLink) {
    if (username) {
      // User is logged in, show Logout
      authLink.textContent = "Logout";
      authLink.setAttribute("href", "#"); // prevent direct reload
      authLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.setItem('logout_message', `${username}, thank you for using my-Blog, see you next time!`);
        localStorage.removeItem("myblog_username");
        window.location.href = "index.html";
      });
    } else {
      // Not logged in, show Login
      authLink.textContent = "Login";
      authLink.setAttribute("href", "login.html");
    }
  }

  // ===== Disable Blog link when not logged in ===== //
  if (blogLink && !username) {
    blogLink.classList.add("disabled");
    blogLink.removeAttribute("href"); 
  }



  // ===== Login Form ===== //
  const loginForm = document.getElementById("login-form");
  
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // ===== Register Form ===== //
  const registerForm = document.getElementById("register-form");
  
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }

  // =====  New Blog Form======= //
  const newBlogForm = document.getElementById("new-blog-form");

  if (newBlogForm) {
    newBlogForm.addEventListener("submit", handleNewBlog);
  }

  // =====  Blog Page ====== //
  const blogContainer = document.getElementById("blog-container");

  if (blogContainer) {
    handleBlogPage();
  }

  // ===== UserTag handler ===== //
  const usertag = document.getElementById("userTag");
  
  if (usertag) {
    const e = localStorage.getItem("myblog_username");
    if (usertag && e) usertag.textContent = `[${e}]`;
  }

  // ===== show logout message on index.html ===== //
  const logoutMsg = localStorage.getItem("logout_message");
  const header = document.querySelector(".cover-header");
  const title = document.querySelector(".cover-title");

  if (logoutMsg && header && title) {
    header.textContent = "You have logged out successfully";
    title.textContent = logoutMsg;
    localStorage.removeItem("logout_message");
  };

  // ==== Click on Eidit icon === //
  const editPosts = document.querySelectorAll(".blog-edit-icon");

  editPosts.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      const article = e.target.closest(".blog-post"); 
      if (!article) return;

      const postId = article.dataset.id;
      const currentUser = localStorage.getItem("myblog_username");
      
      localStorage.setItem("pendingEdit", JSON.stringify({
        id: postId,
        user: currentUser,
        ts: Date.now()
      }));
      window.location.href = "editblog.html";
    });
  });

  // ===== redirect to edit Blog page ==== // 
  const editblog = document.querySelector(".edit-blog-container");

  if (editblog) {
    editPostedBlog();
  }


  // ==== blog Delete === //
  const deletePosts = document.querySelectorAll(".blog-delete-icon");

  deletePosts.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      const article = e.target.closest(".blog-post"); 
      if (!article) return;

      const postId = article.dataset.id;
      // alert(`Delete icon pressed for post ${postId}`);
      const currentUser = localStorage.getItem("myblog_username");
      if (currentUser) deletePostedBlog(postId, currentUser);

    });
  });

});

//================================//
// load Posts from Local Storage //
function loadPosts() {
  return JSON.parse(localStorage.getItem("blogPosts") || "[]");
};

//================================//
// Save Posts from Local Storage //
function savePosts(posts) {
   localStorage.setItem("blogPosts", JSON.stringify(posts));
   return;
};

//=======================================//
// Get PostId and save in LocalStorage   //
function getNextPostID() {
  let nextId = Number(localStorage.getItem("blogPosts_nextId") || 0);
  nextId++;
  localStorage.setItem("blogPosts_nextId", nextId);
  return nextId;
};

// ------------------------ //
// Validation on Login Page //
// ------------------------ //
function handleLogin (event) {

    event.preventDefault();  

    const loginForm = document.getElementById("login-form");      
    let username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("error-message-error");
    const loader = document.getElementById('loader');  
  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()\-+={}[\]:;"'<>,.?/~`]).{6,}$/;

    errorMessage.textContent = '';
    errorMessage.style.color = 'red';
        
    // validate all fields without blank
    if (!username || !email || !password) {
        
        // alert("Please fill in all fields!");
         errorMessage.textContent = "Please fill in all fields!";
        return;
    } 

    // validate username, more than 4 characters
    if (username.length < 4) {
      errorMessage.textContent = "Username is less than 4 characters"
      return;
    } else 
    {
        username = username.toLowerCase();
        document.getElementById("username").value = username;        
    }

    //validate email
    if (!emailPattern.test(email)) {
        errorMessage.textContent= "Please enter a valid email address!";
        return;
    } 
    
    // check on db and replace by checking if password matched !
    if (!passwordPattern.test(password)) {
        event.preventDefault();
        errorMessage.textContent= "Password must be min 6 characters, contains at least 1 uppercase & 1 symbol";
        return;
    }
    // Check on username, email and password matchs with users_profile 

    const users = JSON.parse(localStorage.getItem("users_profile") || "[]");


    let foundUser = null;
     
    for (let i = 0; i < users.length; i++) {
      if (users[i].username === username) {
          foundUser = users[i];
           break;
          } 
      }

      // Username not exist
      if (!foundUser){
        errorMessage.textContent = "Username does not exist. Please sign up";
        errorMessage.style.color = "red"; 
        document.getElementById("username").focus();
        return;
      }

      // username is correct but password incorrect
      if (foundUser.password !=password){
        errorMessage.textContent = "Password Incorrect. Try again";
        errorMessage.style.color = "red"; 
        document.getElementById("password").value = "";
        document.getElementById("password").focus();
        return;
      }
        errorMessage.textContent = "Login successfully.";
        errorMessage.style.color = "green";
     
    // Save username to localStorage //
    localStorage.setItem('myblog_username', username);

    //anmination place here //
    loader.style.display = "block";
    loginForm.style.opacity ="0.5";
    
    animateLoadersStart();

    setTimeout( () => {
      animateLoadersStop();
      if (loader) loader.style.display = "none";
      window.location.href = "blog.html";
    }, 2000);

  };

// --------------------------- //
// Validation on Sign up Page //
// --------------------------- //
function handleRegister(event)  {
        
  event.preventDefault();

  const registerForm = document.getElementById("register-form");
  let username = document.getElementById("reg-username").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value.trim();
  const cfmpassword = document.getElementById("reg-cfm-password").value.trim();
  const errorMessage = document.getElementById("reg-message-error");
  const loader = document.getElementById('reg-loader');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()\-+={}[\]:;"'<>,.?/~`]).{6,}$/;

  errorMessage.textContent = '';
  errorMessage.style.color = 'red';
      
  // validate all fields without blank
  if (!username || !email || !password || !cfmpassword ) {
      
      // alert("Please fill in all fields!");
      event.preventDefault();
      errorMessage.textContent = "Please fill in all fields!";
      return;
  } 

  // validate username, more than 4 characters
  // convert the reg-username to lowercase
  // check with db if username exsits ( to be udpated)
  if (username.length < 4) {
      event.preventDefault();
      errorMessage.textContent = "Username is less than 4 characters";
      return;
  } else 
  {
      username = username.toLowerCase();
      document.getElementById("reg-username").value = username;
  }

  //validate email
  if (!emailPattern.test(email)) {
      event.preventDefault();
      errorMessage.textContent= "Please enter a valid email address!";
      return;
  } 
  
  // validate password - contains min 1 upper case , 1 symbol and character
  // check on db and replace by checking if password matched !
  if (!passwordPattern.test(password)) {
      event.preventDefault();
      errorMessage.textContent= "Password must be min 6 characters, contains at least 1 uppercase & 1 symbol";
      return;
  }

    // alert("Passwords do not match!");
  if (password !== cfmpassword) {
      event.preventDefault();   
      errorMessage.textContent= "Passwords do not match!";
      return;
  }

  //   Store new signed up account to LocalStorage  //
  const user = {
    username, 
    email,
    password,
  }; 

  // add users profile to Localstorage 
  let users = JSON.parse(localStorage.getItem("users_profile") || "[]");
  if(!Array.isArray(users)) users = [];
  
  let exist = false;

  // valide if new sign up already exist
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username) {
      exist = true;
      break;
    }
  }

  if (exist) {
    errorMessage.textContent = "Account already exist."
    errorMessage.style.color = "red";
    return;
  } else 
  {
    users.push(user);
    localStorage.setItem("users_profile", JSON.stringify(users));
  
    errorMessage.textContent = "Account created successfully.";
    errorMessage.style.color = "green";
  }

  // anmination place here //
  loader.style.display = "block";
  registerForm.style.opacity ="0.5";

  animateLoadersStart();

    setTimeout( () => {
      animateLoadersStop();
      if (loader) loader.style.display = "none";
      window.location.href = "blog.html";
    }, 2000);
};

// ====================== //
//   Handle New Blog      //
// ====================== //
function handleNewBlog(event)  {

  event.preventDefault();
  
  const newBlogForm = document.getElementById("new-blog-form");
  const title  = document.getElementById("new-blog-title").value.trim();
  const content = document.getElementById("new-blog-content").value.trim();
  const errorMessage = document.getElementById("new-blog-errormessage");
  const loader = document.getElementById("new-blog-loader");

  errorMessage.textContent = '';
  errorMessage.style.color = 'red';
  
  // valide all the info are non-empty //
  if (!title || !content ) { 
        event.preventDefault();  
        errorMessage.textContent = "Please fill in all fields!";
        return;
  }
      
  const username = localStorage.getItem("myblog_username");

  if (username) {
  
    // create a post object //
    const post = {
      postId: getNextPostID(),    // new added
      postHidden: false,          // new added
      username,
      title,
      content,
      date: new Date().toLocaleString()
    };

    // retirieve blogPosts and add new Post to LocalStorage
    let posts = loadPosts();
    posts.push(post);
    savePosts(posts);

    errorMessage.textContent = "Blog Saved & Posted";
    errorMessage.style.color = "green";
    
    loader.style.display = "block";
    newBlogForm.style.opacity = "0.9";

    animateLoadersStart();

    setTimeout( () => {
      animateLoadersStop();
      if (loader) loader.style.display = "none";
      window.location.href = "blog.html";
    }, 2000);

  } else
  {
    event.preventDefault();
    errorMessage.textContent = "Please login first.";
  };

};

// ===================== //
//   Handle Blog Page    //
// ===================== //
function handleBlogPage() {

  const blogContainer = document.getElementById("blog-container");
  const blogMessage = document.getElementById("blog-message");
  const currentUser = localStorage.getItem("myblog_username");
  
  if ((!blogContainer)) return;
  
  // Clear rendered posts to prevent duplicates.
  blogContainer.innerHTML = "";

  // check if User not logged in
  if (!currentUser) {
    if (blogMessage) blogMessage.textContent = "Please log in to view your posts.";
    return;
  }

  const allPosts  = loadPosts();
  const posts = allPosts.filter(post => post.username === currentUser && !post.postHidden);
 
  if (posts.length === 0) {
    if (blogMessage) {
       blogMessage.textContent = "No Blog Post yet !";
       blogMessage.style.backgroundColor = "transparent";  
       blogMessage.style.color = "white"; 
    }
    // const emptyPost = document.querySelector(".blog-post");
    // if (emptyPost) emptyPost.style.display = "none"; 
    return;    
  };

  blogMessage.style.backgroundColor = "transparent";  
  
  posts.forEach((post)=> {
    const article = document.createElement("article");
    article.className ="blog-post";
    article.dataset.id = post.postId; // keep the data-id for edit/delete action

    const h2 = document.createElement("h2");
    h2.className = "post-title";
    h2.textContent = post.title;

    const date = document.createElement("p");  
    date.className = "post-date";
    date.innerHTML = `Posted on ${post.date} &nbsp; <span class="userTag">by ${post.username}</span>`;

    const content = document.createElement("p");
    content.className = "post-content";
    content.textContent = post.content;

    const line = document.createElement("hr");

    const iconEdit = document.createElement("img");
    iconEdit.className = "blog-edit-icon";
    iconEdit.setAttribute("src", "./img/edit-com.svg");

    const iconDelete = document.createElement("img");
    iconDelete.className = "blog-delete-icon";
    iconDelete.setAttribute("src", "./img/cross-com.svg");
    
    article.appendChild(h2);
    article.appendChild(date);
    article.appendChild(content);
    article.appendChild(line);
    article.appendChild(iconEdit);
    article.appendChild(iconDelete);
       
    blogContainer.appendChild(article);
        
  });
    
};

// =============================== //
//      Edit Posted Blog           //
// =============================== //
function editPostedBlog() {

  const pending = JSON.parse(localStorage.getItem("pendingEdit") || "null");
  if (!pending || !pending.id || !pending.user) {
    // alert("Missing blog post information.");
    window.location.href = "blog.html";
    return;
  }

  const posts = loadPosts();
  const post = posts.find(p => Number(p.postId) === Number(pending.id) && p.username === pending.user);
  if (!post) {
    alert("Post not found or not owned by current user.");
    window.location.href = "blog.html";
    return;
  }

  // Grab elements AFTER they exist in DOM
  const titleInput   = document.getElementById("edit-blog-title");
  const contentInput = document.getElementById("edit-blog-content");
  const form         = document.getElementById("edit-blog-form");
  const msg          = document.getElementById("edit-blog-errormessage");
  const loader       = document.getElementById("edit-blog-loader");

  // Prefill the selected Post details
  titleInput.value   = post.title;
  contentInput.value = post.content;

  const originalTitle = post.title;
  const originalContent = post.content;

  // Handle submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newTitle = titleInput.value.trim();
    const newContent = contentInput.value.trim();

    if (newTitle === originalTitle && newContent === originalContent) {
      msg.textContent = "No changes made. Click 'Blog' back to your Posts.";
      msg.style.color = "red";
      return;
    }

    post.title = newTitle;
    post.content = newContent;
    post.date = new Date().toLocaleString();

    const updatedPosts = posts.map(p => Number(p.postId) ===Number(pending.id) ? post : p);
    savePosts(updatedPosts);

    msg.textContent = "Edited successfully and posted!";
    msg.style.color = "green";
    loader.style.display = "block";
   

    localStorage.removeItem("pendingEdit");
    
    animateLoadersStart();

    setTimeout( () => {
      animateLoadersStop();
      if (loader) loader.style.display = "none";
      window.location.href = "blog.html";
    }, 2000);

  });

};

// =============================== //
//      Delete Posted Blog Post    //
// =============================== //

function deletePostedBlog(postid, currentuser) {
  const posts = loadPosts();
  const post = posts.find(p => Number(p.postId) === Number(postid) && p.username === currentuser);
  if (!post) {
    // alert("Post not found or not owned by current user.");
    return;
  }

  // Confirm before hiding
  const confirmDelete = confirm(`Are you sure you want to delete "${post.title}"?`);
  if (!confirmDelete) return;

  post.postHidden = true;
  savePosts(posts); 
  handleBlogPage();

};


// =============================== //
// Animate loaders by JavaScript   //
// =============================== //
let loaderRafId = null;

function animateLoadersStart() {
  if (loaderRafId) return;
  const loaders = document.querySelectorAll('.loader, .reg-loader, .new-blog-loader, .edit-blog-loader');
  if (!loaders.length) return;

  let startTime = null;

  function spin(timestamp) {

    const visible = Array.from(loaders).filter(el => getComputedStyle(el).display !== 'none');
    if (visible.length === 0) { animateLoadersStop(); return; }

    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const rotation = (elapsed / 2000) * 360;

    visible.forEach(loader => {
      const angle = rotation % 360;
      loader.style.background = `conic-gradient(var(--loader-accent) ${angle}deg, #0000 ${angle}deg )`;
    });
    requestAnimationFrame(spin);
  }
  requestAnimationFrame(spin);

}

function animateLoadersStop() {
  if (loaderRafId) {
    cancelAnimationFrame(loaderRafId);
    loaderRafId = null;
  }
}
