
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
  btn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  localStorage.setItem(KEY, isDark ? DARK : 'light');
}

function initTheme() {
  const btn = document.getElementById('btn-dark-mode');
  if (!btn) return;

  // Initialize them, default by light mode
  const saved = localStorage.getItem(KEY);
  const isDark = saved ? saved === DARK : false;
  applyTheme(isDark);

  // Toggle when button is clicked
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

  // Except handling if no username in myblog_username //
  const username = localStorage.getItem('myblog_username');
  const logoutLink = document.getElementById('logoutLink');
  const blogLink = document.querySelector('a[href="blog.html"]');

  // if no username, adjust navbar
  if (!username) { 
    // change logout to login when no uername in localStorage
    if (logoutLink) {  
      logoutLink.removeAttribute("id");                
      logoutLink.textContent = "Login";                
      logoutLink.setAttribute("href", "login.html");   
    }
    // disabled Blog link wehn no username in localStorage
    if (blogLink) {    
      blogLink.classList.add("disabled");              
      blogLink.addEventListener("click", (e) => e.preventDefault()); 
    }
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

  // ===== Logout & Clear LocalStorage ===== //
  const logout = document.getElementById('logoutLink');
  
  if (logout) {
    logout.addEventListener('click', (event) => {
      event.preventDefault();
      localStorage.removeItem("myblog_username");
      window.location.href = "index.html";
    })
  }

});

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
    const passwordPattern = /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/;

    errorMessage.textContent = '';
    errorMessage.style.color = 'red';
        
    // validate all fields without blank
    if (!username || !email || !password) {
        
        // alert("Please fill in all fields!");
         errorMessage.textContent = "Please fill in all fields!";
        return;
    } 

    // validate username, more than 4 characters
    // convert the username to lowecase
    // check with db if username exsits ( to be udpated)
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
    
    // validate password - contains min 1 upper case , 1 symbol and character
    // check on db and replace by checking if password matched !
    if (!passwordPattern.test(password)) {
        event.preventDefault();
        errorMessage.textContent= "Password contains min 1 upper case , 1 symbol and character";
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

    // anmination place here //
    loader.style.display = "block";
    loginForm.style.opacity ="0.5";

    setTimeout( () => {
      if (loader) loader.style.display = "none";
      window.location.href = "blog.html";
    }, 3000);
 
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
  const passwordPattern = /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/;

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
      errorMessage.textContent= "Password contains min 1 upper case , 1 symbol and character";
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

  setTimeout( () => {
    if (loader) loader.style.display = "none";
    window.location.href = "login.html";
  }, 3000);
};


// =========================== //
//       Handle New Blog       //
// =========================== //
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
      username,
      title,
      content,
      date: new Date().toLocaleDateString()
    };

    // retirieve blogPosts and add new Post to LocalStorage
    let posts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    posts.push(post);
    localStorage.setItem("blogPosts", JSON.stringify(posts));

    errorMessage.textContent = "Blog Saved & Posted";
    errorMessage.style.color = "green";
    
    loader.style.display = "block";
    newBlogForm.style.opacity = "0.9";
    
    setTimeout( () => {
      if (loader) loader.style.display = "none";
      newBlogForm.reset();
      window.location.href ="blog.html";

    }, 3000);

  } else
  {
    event.preventDefault();
    errorMessage.textContent = "Please login first.";
  };

};

// ===================== //
//   handle Blog Page    //
// ===================== //
function handleBlogPage(event) {

  const blogContainer = document.getElementById("blog-container");
  const blogMessage = document.getElementById("blog-message");
  const currentUser = localStorage.getItem("myblog_username");
  
  if ((!blogContainer)) return;
  
  // Clear rendered posts to prevent duplicates.
  blogContainer.innerHTML = "";

  let allPosts  = JSON.parse(localStorage.getItem("blogPosts") || "[]");
  let posts = allPosts.filter(post => post.username === currentUser);
 
  if (posts.length === 0) {
    posts = [];
    blogMessage.textContent = "No Blog post yet";
    
    const emptyPost = document.querySelector(".blog-post");
    if (emptyPost) emptyPost.style.display = "none"; 
    return;
    
  };

  blogMessage.style.backgroundColor = "transparent";

  posts.forEach(function(post) {
    const article = document.createElement("article");
    article.className ="blog-post";

    const h2 = document.createElement("h2");
    h2.className = "post-title";
    h2.textContent = post.title;

    const date = document.createElement("p");  
    date.className = "post-date";
    date.innerHTML = `Posted on ${post.date} &nbsp; <span class="userTag">by ${post.username}</span>`;

    const content = document.createElement("p");
    content.className = "post-content";
    content.textContent = post.content;

    article.appendChild(h2);
    article.appendChild(date);
    article.appendChild(content);
    
    blogContainer.appendChild(article);
        
  });
    
};


