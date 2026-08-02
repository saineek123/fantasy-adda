// ======================================
// Fantasy Adda Auth System
// ======================================

import { auth, database } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    ref,
    set,
    get
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";


// ======================================
// SHOW / HIDE PASSWORD
// ======================================

const togglePassword = document.getElementById("togglePassword");

if (togglePassword) {

    togglePassword.addEventListener("click", () => {

        const password = document.getElementById("password");

        if (password.type === "password") {

            password.type = "text";

            togglePassword.innerHTML =
                '<i class="fa fa-eye-slash"></i>';

        } else {

            password.type = "password";

            togglePassword.innerHTML =
                '<i class="fa fa-eye"></i>';

        }

    });

}

const toggleConfirmPassword =
document.getElementById("toggleConfirmPassword");

if (toggleConfirmPassword) {

    toggleConfirmPassword.addEventListener("click", () => {

        const confirmPassword =
        document.getElementById("confirmPassword");

        if (confirmPassword.type === "password") {

            confirmPassword.type = "text";

            toggleConfirmPassword.innerHTML =
                '<i class="fa fa-eye-slash"></i>';

        } else {

            confirmPassword.type = "password";

            toggleConfirmPassword.innerHTML =
                '<i class="fa fa-eye"></i>';

        }

    });

}



// ======================================
// SIGNUP
// ======================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

signupForm.addEventListener("submit", async (e) => {

e.preventDefault();

const name =
document.getElementById("name").value.trim();

const email =
document.getElementById("email").value.trim();

const phone =
document.getElementById("phone").value.trim();

const password =
document.getElementById("password").value.trim();

const confirmPassword =
document.getElementById("confirmPassword").value.trim();

const referral =
document.getElementById("referral").value.trim();

const terms =
document.getElementById("terms").checked;


// Validation

if(name==""){

alert("Enter Full Name");

return;

}

if(password!=confirmPassword){

alert("Passwords do not match");

return;

}

if(!terms){

alert("Accept Terms & Conditions");

return;

}

try{

const userCredential =
await createUserWithEmailAndPassword(
auth,
email,
password
);

const user=userCredential.user;


// Save User

await set(ref(database,"users/"+user.uid),{

uid:user.uid,

name:name,

email:email,

phone:phone,

referral:referral,

wallet:{

recharge:0,

bonus:0,

winning:0

},

status:"Active",

createdAt:new Date().toISOString()

});

alert("Account Created Successfully");

window.location.href="login.html";

}

catch(error){

alert(error.message);

}

});

}



// ======================================
// LOGIN
// ======================================

const loginForm=document.getElementById("loginForm");

if(loginForm){

loginForm.addEventListener("submit",async(e)=>{

e.preventDefault();

const email=document.getElementById("phone").value.trim();

const password=document.getElementById("password").value.trim();

try{

await signInWithEmailAndPassword(

auth,

email,

password

);

alert("Login Successful");

window.location.href="index.html";

}

catch(error){

alert(error.message);

}

});

}



// ======================================
// AUTO LOGIN
// ======================================

onAuthStateChanged(auth,async(user)=>{

if(user){

const snapshot=await get(
ref(database,"users/"+user.uid)
);

if(snapshot.exists()){

console.log(snapshot.val());

}

}

});




// ======================================
// LOGOUT FUNCTION
// ======================================

window.logout=function(){

signOut(auth)

.then(()=>{

window.location.href="login.html";

})

.catch((error)=>{

alert(error.message);

});

}