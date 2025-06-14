const configs = {
  API_ENDPOINT : "https://petunia-bank-backend.onrender.com",

  TOKEN_NAME : "token",

  LOGIN_PAGE: "login.html",
  INDEX_PAGE: {redirect_url: "./", pathname: ""}
}


function logout(){
  localStorage.removeItem(configs.TOKEN_NAME)
  window.location.href = `${configs.API_ENDPOINT}/logout`
}

function getToken(){
  return localStorage.getItem(configs.TOKEN_NAME) ?? ""
}

function getTokenHeader(){
    return { "Authorization" : `Bearer ${getToken()}`}
}

function setToken(token){
  return localStorage.setItem(configs.TOKEN_NAME, token)
}


function checkLogin(role=""){
    fetch(`${configs.API_ENDPOINT}/home/info`, {
      headers: getTokenHeader(),
      credentials: 'include'
})
  .then(r => {
    if (r.status == 401 && !window.location.pathname.includes("login")) {
      return window.location.href = configs.LOGIN_PAGE
    }

    if (r.status != 401 && window.location.pathname.includes("login")) {
      return window.location.href = configs.INDEX_PAGE.redirect_url
    }

    return r.json()
  })

  .then(r => {

    let path = window.location.pathname.split("/")
    path = path[path.length-1].replace(".html", "")

    if(path != configs.INDEX_PAGE.pathname){
      try{
        const tempRole = r["permissions"][`${path}View`]
        if(!tempRole || tempRole == undefined){ return window.location.href = configs.INDEX_PAGE.redirect_url }

      }catch{}

    }

    setTimeout(() => {
      document.body.style.visibility = "visible"
    }, 500)

  })

}


document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.querySelector("#logoutBtn")

  if(logoutBtn!=null) logoutBtn.addEventListener("click", logout)

})