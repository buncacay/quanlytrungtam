document.addEventListener("DOMContentLoaded", function () {
    $("#header").load("../../components/header.html");
   
     $("#sidebar").load("../../components/sidebar.html", function () {
        $.getScript("../../fetch/sidebar_be.js");
    });
  });
  