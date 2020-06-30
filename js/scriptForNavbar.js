var show = "none"
window.addEventListener("resize", function(event) {
  if (document.body.clientWidth > 993) {
    var x = document.getElementById("myLinks");
    x.style.display = "block"
    show = "block"
  }
  if (document.body.clientWidth < 992 && show === "block") {
    var x = document.getElementById("myLinks");
    x.style.display = "none"
  }

})
function myFunction() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
     show = "none"
    x.style.display = "none";
  } else {
     show = "none"
    x.style.display = "block";
  }
}
