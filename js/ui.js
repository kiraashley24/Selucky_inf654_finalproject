//initializing menus

//Telling the page to load DOM content first, then JS
document.addEventListener("DOMContentLoaded", function(){
    //Nav menu
    const menus = document.querySelector(".sidenav");
    M.Sidenav.init(menus, {edge: "left"});
    //Add review
    const forms = document.querySelector(".side-form");
    M.Sidenav.init(forms, {edge: "right"})
});
