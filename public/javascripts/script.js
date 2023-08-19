
// for opening the profile ..... 

var profileImage = document.querySelector("#profile-image");
var menu = document.querySelector(".update-profile-sidebar")
var closeMenu = document.querySelector(".close-menu")

profileImage.addEventListener("click", () => {
    menu.style.width = "25%",
        menu.style.padding = "20px"
})

closeMenu.addEventListener("click", () => {
    menu.style.width = "0%",
        menu.style.padding = "0px"
})


//upload profile image
document.querySelector(".change-icon").addEventListener("click", function () {
    document.querySelector("#Profile-photo-input").click();
});
document.querySelector("#Profile-photo-input").addEventListener("change", function () {
    document.querySelector("form[action='/uploadProfilePhoto']").submit();
});
