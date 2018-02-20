// Register function for signing out.
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('signout').addEventListener('click', function() {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("redirect");
    window.location.href = "/";
  });
});