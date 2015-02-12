/* jshint browser: true, jquery: true */
'use strict'

//var $      = require('jquery'),
    //_      = require('lodash'),
    //Firebase = require('firebase');

function hello(){
 return 'world';
};
var $tbody      = $('tbody'),
    firebaseUrl = "https://bookofcontacts.firebaseio.com",
    fb          = new Firebase(firebaseUrl),
    newFbUrl; 
    
//login/registration part....

if (fb.getAuth()) {
  $('.login').remove();
  $('.loggedIn').toggleClass('hidden');

   newFbUrl = firebaseUrl + '/users/' + fb.getAuth().uid + '/data';
  
  $.get(newFbUrl + '/friends.json', function (res) {
    Object.keys(res).forEach(function (uuid) {
      addRowToTable(uuid, res[uuid]);
    });
  });
 }
//in order for those registering to work....//
 $('#registerButton').click(function (event) {
   event.preventDefault();
   var $loginForm = $('#loginForm'),
       email      = $('#userEmail').val(),
       pass       = $('#userPassword').val(),
       data       = {email: email, password: pass};
   registerAndLogin(data, function (err, auth) {
     if (err) {
       $('.error').text(err);
     } else {
       location.reload(true);
     }
   });
 });

//in order for those loggin back in to work...//
 $('#logInButton').click(function(event){
   var $loginForm = $('#loginForm'),
       email      = $('#userEmail').val(),
       pass       = $('#userPassword').val(),
       data       = {email: email, password: pass};

   event.preventDefault();

   fb.authWithPassword(data, function(err, auth){
     if (err) {
       $('.error').text(err);
     } else {
       location.reload(true);
     }
   });
 });

//log out of user....//
$('.logout').click(function () {
  fb.unauth();
  location.reload(true);
})

//allows for the new registrant to stay logged in....//
function registerAndLogin(obj, cb) {
  fb.createUser(obj, function(err) {
    if (!err) {
      fb.authWithPassword(obj, function (err, auth){
        if (!err) {
          cb(null, auth);
        } else {
          cb(err);
        }
      });
    } else {
      cb(err);
    }
  });
}

//NOW, for the part after the login.....//
//when page loads, add data from firebase to table
$(document).ready(function setUpPage() {
  console.log("the page is set");

  $('.fillOutForm').hide();

  //$.get(firebaseUrl +'/friends.json', function(res){
    //Object.keys(res).forEach(function(uuid){
      //addRowToTable(uuid, res[uuid]);
    //});

});


//show contact form 
$('#pleaseAddMe').on('click', function toggled() {
  console.log("add the clicked items");
  $('.fillOutForm').toggle();
});

//once clicked, the info is placed on the table
$('#sendMyInfo').on('click',  function(event) {
  event.preventDefault();

  var name     = $('#name').val(),
      photoUrl = $('#photoUrl').val(),
      twitter  = $('#twitter').val(),
      phone    = $('#phone').val(),
      email    = $('#email').val(),
      $tbody   = $('tbody'),
      $tr      = $('<tr><td>' +
                   name +
                   '</td><td><img src="' +
                   photoUrl +
                   '"></td><td>' +
                   twitter +
                   '</td><td>' +
                   phone +
                   '</td><td>' +
                   email +
                   '</td><td><button id="removeRow">Remove</button><tr>');                   

//adding stuff to firebase
  var friendToAdd = JSON.stringify({
                                   name: name,
                                   photoUrl: photoUrl,
                                   twitter: twitter,
                                   phone: phone,
                                   email: email});
  
  $.post(newFbUrl + '/friends.json', friendToAdd, function(res) {
    $tr.attr('data-uuid', res.name);
    $('tbody').append($tr);

  //clear out fields once placed
  $('#name').val("");
  $('#photoUrl').val("");
  $('#twitter').val("");
  $('#phone').val("");
  $('#email').val("");
  $('.fillOutForm').hide();
  });
});

function addRowToTable(uuid, obj){
  var $tr = $('<tr><td>' +
                   obj.name +
                   '</td><td><img src="' +
                   obj.photoUrl +
                   '"></td><td>' +
                   obj.twitter +
                   '</td><td>' +
                   obj.phone +
                   '</td><td>' +
                   obj.email +
                   '</td><td><button id="removeRow">Remove</button><tr>');

  $tr.attr('data-uuid', uuid);
  $('tbody').append($tr);
};

//remove row functionality
$('tbody').on('click', '#removeRow', function(evt){
  var $tr = $(evt.target).closest('tr');
  $tr.remove();

  var uuid = $tr.data('uuid'),
      url  = newFbUrl + '/friends/' + uuid + '.json';
  $.ajax(url, {type: 'DELETE'});
});

