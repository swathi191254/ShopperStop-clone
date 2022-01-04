document.getElementById("searchbtn").onclick = function () {
  myFunction();
};

function myFunction() {
  document.getElementById("searchdiv").classList.toggle("show");
}

document.getElementById("signupform").addEventListener("submit", Signup);
document.getElementById("signinform").addEventListener("submit", Login);
// document.getElementById("mobileotp").addEventListener("submit", sendotp)
// document.getElementById("otp").addEventListener("submit",submitotp)

async function Signup(e) {
  e.preventDefault();
  let user_data = {
    name: document.getElementById("signupFullName").value,
    password: document.getElementById("signupPassword").value,
    email: document.getElementById("signupemail").value,
    mobile: document.getElementById("signupMobileNumber").value,
  };

  const response = await fetch("/createaccount", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user_data),
  });

  const result = await response.json();
  if (result.message) {
    alert(result.message);
  } else {
    alert("Welcome to ShopperStop");
    addascurrentuser(result.user);
  }
  window.location.reload();
}

async function Login(e) {
  e.preventDefault();

  let user_data = {
    password: document.getElementById("signinPassword").value,
    email: document.getElementById("signinemail").value,
  };

  const response = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user_data),
  });

  const result = await response.json();

  if (result.message) {
    alert(result.message);
  } else {
    alert("Welcome back");
    addascurrentuser(result.user);
  }
  window.location.reload();
  //work if result is wrong
}



if (localStorage.getItem("wishlistproducts") === null) {
  localStorage.setItem("wishlistproducts", JSON.stringify([]));
}
if (localStorage.getItem("cartproducts") === null) {
  localStorage.setItem("cartproducts", JSON.stringify([]));
}

if (isAuthenticated()) {
  getid("favitem").style.display = "none";
  let x = JSON.parse(localStorage.getItem("wishlistproducts")).length;
  if (+x > 0) {
    getid("countfav").style.display = "block";
    getid("countfav").innerHTML = x;
  }

  getid("changesign").innerHTML = `<p id="account">Your account</p>
        <hr> <p id="signoutbtn">Sign out</p>`;
  let y = JSON.parse(localStorage.getItem("cartproducts")).length;
  if (+y > 0) {
    getid("countbag").style.display = "block";
    getid("countbag").innerHTML = y;
  }

  if (localStorage.getItem("wishlistproducts") === null) {
    localStorage.setItem("wishlistproducts", JSON.stringify([]));
  }
  if (localStorage.getItem("cartproducts") === null) {
    localStorage.setItem("cartproducts", JSON.stringify([]));
  }

  if (isAuthenticated()) {
    getid("favitem").style.display = "none";
    let x = JSON.parse(localStorage.getItem("wishlistproducts")).length;
    if (+x > 0) {
      getid("countfav").style.display = "block";
      getid("countfav").innerHTML = x;
    }

    getid("changesign").innerHTML = `<h3 id="account">Your account</h3>
        <hr> <h3 id="signoutbtn">Sign out</h3>`;
    let y = JSON.parse(localStorage.getItem("cartproducts")).length;
    if (+y > 0) {
      getid("countbag").style.display = "block";
      getid("countbag").innerHTML = y;
    }

    getid("countfav").addEventListener("click", function () {
      window.location.href = "/wishlist";
    });
    getid("favicon").addEventListener("click", function () {
      window.location.href = "/wishlist";
    });
    getid("carticon").addEventListener("click", function () {
      window.location.href = "/cart";
    });
    getid("countbag").addEventListener("click", function () {
      window.location.href = "/cart";
    });
  }
}

function getid(id) {
  return document.getElementById(id);
}
getid("signoutbtn")?.addEventListener("click", () => {
  signoutbtn();
});

function signoutbtn() {
  let text = "Do you want to sign out?";
  if (confirm(text) == true) {
    logout();
   
  } else {
    text = "You canceled!";
  }
}
document.getElementById("searchform").addEventListener("submit", search);
document.getElementById("media_searchform").addEventListener("submit", search);

function search(e) {
  e.preventDefault();
  let searchvalue = document.getElementById("searchinput").value;
  if(!searchvalue){
    searchvalue = document.getElementById("mediasearchinput").value;
  }
  searchvalue = searchvalue.toUpperCase();
  window.location.href = `/search?search=${searchvalue}`;
}

getid("mobileotp").addEventListener("submit", (e) => {
  e.preventDefault();
  getid("containerjs").style.display = "block";
});

getid("formclose").addEventListener("click", () => {
  getid("containerjs").style.display = "none";
});

// *************

function isAuthenticated() {
  let cookie = document.cookie.split("token=");
  if (cookie) {
    if (cookie[1]?.length > 100) {
      return true;
    }
  }

  return false;
}

function logout() {
  localStorage.removeItem("currentuser");
  apilogout()
}

function addascurrentuser(user) {
  if (localStorage.getItem("currentuser") != null) {
    localStorage.removeItem("currentuser");
  }
  var user = JSON.stringify(user);

  localStorage.setItem("currentuser", user);
}

// *************debouncing********

async function searchtext() {
  let val= getid("searchinput").value;
  if(!val){
    val= getid("mediasearchinput").value;
  }
  let x = {
    search: val,
  };

  const response = await fetch("/search/suggestion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(x),
  });

  const result = await response.json();
  if (result.result) {
    let container = getid("searchsuggestion");
    container.innerHTML = "";
    for (let i = 0; i < 4; i++) {
      let el = result.result[i];
      if (el) {
        let div = document.createElement("div");
        div.innerHTML = `<p>${el.Product_Title}</p>`;
        div.style.cursor = "pointer";
        div.onclick = function () {
          window.location.href = "/" + el._id;
        };
        container.append(div);
      } else continue;
    }
  }
}

const debounce = function (fn, d) {
  let timer;
  return function () {
    let context = this,
      args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, d);
  };
};

const debounceForData = debounce(searchtext, 300);

var mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}



getid("closingbtn").addEventListener("click", function(){
    document.querySelector(".container").style.display = "none";
})



async function apilogout(){
  const response = await fetch("/user/logout", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const result= await response.json()
  if(result=="successful"){
    window.location.reload();
  }
  else{
    console.log(result)
  }
}



getid("closecookie").addEventListener("click", function(){
  getid("cookiemessage").style.display="none";
})