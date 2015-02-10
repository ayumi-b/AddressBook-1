/* jshint browser: true, jquery: true */
'use strict'

function hello(){
 return 'world';
};

var firebaseUrl = "https://bookofcontacts.firebaseio.com/friends.json";
var $tbody = $('tbody');

//when page loads, add data from firebase to table
$(document).ready(function setUpPage() {
  console.log("the page is set");

  $('.fillOutForm').hide();

  $.get(firebaseUrl, function(res){
    Object.keys(res).forEach(function(uuid){
      addRowToTable(uuid, res[uuid]);
    });

  });

//show contact form 
$('#pleaseAddMe').on('click', function toggled() {
  console.log("add the clicked items");
  $('.fillOutForm').toggle();
  });
});

//once clicked, the info is placed on the table
$('#sendMyInfo').on('click',  function(event) {
  event.preventDefault();

  var name     = $('#name').val(),
      url      = $('#photo').val(),
      twitter  = $('#twitter').val(),
      phone    = $('#phone').val(),
      email    = $('#email').val(),
      $tbody   = $('tbody'),
      $tr      = $('<tr><td>' +
                   name +
                   '</td><td><img src="' +
                   url +
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
                                   photoURL: url,
                                   twitter: twitter,
                                   phone: phone,
                                   email: email});
  
  $.post(firebaseUrl, friendToAdd, function(res) {
    $tr.attr('data-uuid', res.name);
    $('tbody').append($tr);

  //clear out fields once placed
  $('#name').val("");
  $('#photo').val("");
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
                   obj.url +
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

  var uuid = $tr.data('uuid');
  var url = "https://bookofcontacts.firebaseio.com/friends/" + uuid + '.json';
  $.ajax(url, {type: 'DELETE'});
});

