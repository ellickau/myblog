
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

  // === handle print, edit and delete in Blog.html === //
  const blogContainer = document.getElementById("blog-container");
  
  if (blogContainer) {
    handleBlogPage();

    blogContainer.addEventListener('click', (e) => {
      const article = e.target.closest('.blog-post'); 
      if (!article) return;

      // EDIT first
      if (e.target.closest('.blog-edit-icon')) {
          const postId = article.dataset.id;
          const currentUser = localStorage.getItem('myblog_username');
          // guard: must have user & id
          if (!postId || !currentUser) return;

          const payload = { id: postId, user: currentUser, ts: Date.now() };
          localStorage.setItem('pendingEdit', JSON.stringify(payload));
          console.log('edit → pendingEdit =', payload);

          window.location.href = 'editblog.html';
          return;
      }

      // DELETE
      if (e.target.closest('.blog-delete-icon')) {
        const postId = article.dataset.id;
        const currentUser = localStorage.getItem('myblog_username');
        if (currentUser) deletePostedBlog(postId, currentUser);
        return;
      }

      // TITLE → print
      if (e.target.closest('.post-title')) {
        printSinglePost(article);
        return;
      }
    });
  }

  // === Edit Posted Blog === //
  const editblog = document.querySelector(".edit-blog-container");
  if (editblog) {
    editPostedBlog();
  }

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
  };

  if (title.length > 128) {
      event.preventDefault();
      errorMessage.textContent = "Title cannot be more than 128 characters";
      return;
  };

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
   
    // usage of document.write() //
    const msg = "Why not create your first blog ?";
    popUpWindow(msg);
    return;    
  
  };

  blogMessage.style.backgroundColor = "transparent";  
  
  posts.forEach((post)=> {
    const article = document.createElement("article");
    article.className ="blog-post";
    article.dataset.id = post.postId;

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

// ====================== //
//   Edit Posted Blog     //
// ====================== //
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
      localStorage.removeItem("pendingEdit");
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

// =========================== //
//  Delete Posted Blog Post    //
// =========================== //
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

let loaderRafId = null;

// =============================== //
// Animate loaders by JavaScript   //
// =============================== //
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

// =========================================================//
// Document write function for displaying message in window //
// =========================================================//
function popUpWindow(content) {
    const width = 400;
    const height = 300;
    const left = (screen.width/2) - (width /2);
    const top = (screen.height/2) - (height/2);
    
// open new centered popup window //
  const features = `width=${width},height=${height},left=${left},top=${top},resizable=no`;

  const savedTheme = localStorage.getItem('theme');
  let wallpaper;

  if (savedTheme  === 'dark') wallpaper = './img/alert_wallpaper_dark.jpg';
    else wallpaper = './img/alert_wallpaper.jpg';
  
  console.log(savedTheme);

  // Open a small popup window
  let newWin = window.open("", "noPostWin", features);

  // Write content + wallpaper background
  newWin.document.write(`
  <html>
    <head>
      <title>No Posts Yet</title>
      <style>
        body {
          margin: 0;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: Arial, sans-serif;
          background: 
            linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.4)),
            url('${wallpaper}') center/cover no-repeat;
          color: white;
        }
        h2 { font-size: 1.8rem; margin-bottom: 10px; }
        p { font-size: 1.2rem; }
        button {
          margin-top: 20px;
          padding: 8px 20px;
          font-size: 1rem;
          background-color: #16a34a;
          border: none;
          border-radius: 8px;
          color: #fff;
          cursor: pointer;
        }
        button:hover {
          filter: brightness(0.9);
        }
      </style>
    </head>

    <body>
      <h3>${content}</h3>
      <button onclick="window.close()">Close</button>
    </body>
  </html>
  `);

  newWin.document.close();
  newWin.focus();

  setTimeout(() => {
    if (!newWin.closed) newWin.close(); 
  }, 5000);
}

// ===========================//
// Print Messages on blog Page//
// ===========================//
function printSinglePost(article) {
  const clonedPost = article.cloneNode(true);
  clonedPost.querySelectorAll('.blog-edit-icon, .blog-delete-icon').forEach(el => el.remove());
  const postHTML = clonedPost.outerHTML;

  // ✅ open new tab (so Close button will work)
  const printWin = window.open('', '_blank');

  printWin.document.write(`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Print Post</title>
      <style>
        body {
          background: white;
          color: black;
          font-family: Arial, sans-serif;
          margin: 40px;
          line-height: 1.6;
        }
        .post-title { text-align: center; margin-bottom: 8px; }
        .post-date  { text-align: center; color: #555; margin-bottom: 16px; }
        hr { border: 0; border-top: 1px solid #ccc; margin: 20px 0; }
        .post-content { font-size: 1.1rem; }
        @media print {
          body { background: white !important; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="text-align:right; margin-bottom:16px;">
        <button onclick="window.print()">Print</button>
        <button onclick="window.close()">Close</button>
      </div>

      ${postHTML}

      <script>
        window.onload = function() { window.print(); };
      <\/script>
    </body>
  </html>`);
  printWin.document.close();
  printWin.focus();
}
