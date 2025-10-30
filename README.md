<h1>myBlog – Simple LocalStorage Blog App</h1>
<p>myBlog is a front-end web application built using HTML, CSS, and JavaScript that allows users to register, log in, and create, edit, or delete personal blog posts — all stored locally in the browser via local PC localStorage.</p>
<p>Author: Ellick Au</p>
<p>Built as part of the myBlog learning project for the course of "L3 Software Development"(HTML/CSS/JS).</p>
<p>Date: 30 Oct 2025</p>


<h3>🚀 Features</h3>
<ul>
  <li>🌓 Dark / Light mode toggle (state saved in localStorage)</li>
  <li>👤 User authentication (login/register/logout)</li>
  <li>💾 All data saved locally (no server required)</li>
  <li>🔍 Auto-load personal posts only on blog.html</li>
  <li>🌀 Loader animation with graceful start/stop</li>
</ul>

<hr>

<h3>⚙️ Technologies Used</h3>
<ul>
  <li>HTML5 for structure</li>
  <li>CSS3 for styling and layout)</li>
  <li>JavaScript (ES6) for logic and interaction</li>
  <li>Auto-load personal posts only on blog.html</li>
  <li>LocalStorage API for persistent client-side data</li>
</ul>

<hr>

<h3>🧠 How It Works</h3>
<ul>
  <li>When a user registers, the app stores a record under users_profile in localStorage.</li>
  <li>On login, it checks that username and password match.</li>
  <li>When logged in, the username is stored in myblog_username.</li>
  <li>Blog posts are stored in blogPosts, each tagged with the username.</li>
  <li>Only the current user’s posts are shown in blog.html.</li>
</ul>

<hr>

<h3>🔒 Security Note</h3>
<p>This is a client-side demo app — passwords and data are saved in localStorage, not encrypted.</p>
<p>Do not use real passwords or sensitive data.</p>
<p>In production, you would replace the storage layer with a secure backend (e.g. Flask, Node.js, or Firebase).</p>

<hr>

<h3>💡 Future Improvements</h3>
<ul>
  <li>Add encryption for stored passwords.</li>
  <li>Connect to a real database (MongoDB/Firebase)</li>
  <li>Implement comments or image uploads.</li>
  <li>Add pagination and search features</li>
  <li>Enhnace features through REACT / Boosttraps5 Framework</li>
</ul>


