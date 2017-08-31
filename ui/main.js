//counter code
/*
var button = document.getElementById('counter');
button.onclick = function() {
  
  //Create a request object
  var request = new XMLHttpRequest();
  
  //Capture the response and store it in a variable
  request.onreadystatechange = function() {
      if(request.readyState === XMLHttpRequest.DONE) {
          //Take some action
          if (request.status === 200){
              var counter = request.responseText;
              var span = document.getElementById('count');
              span.innerHTML = counter.toString();
          }
      }
  };
  
  //Make a request
  request.open('GET', 'http://viju99.imad.hasura-app.io/counter', true);
  request.send(null);
};
*/
console.log('here');
var submit = document.getElementById('submit_btn');
submit.onclick = function() {
  console.log('reached function');
  //Create a request object
  var request = new XMLHttpRequest();
  
  //Capture the response and store it in a variable
  request.onreadystatechange = function() {
      if(request.readyState === XMLHttpRequest.DONE) {
          //Take some action
          if (request.status === 200){
              console.log("User logged in successfully");
              alert('Logged in successfully');
          }
          else if(request.status === 403) {
              alert('username/password is incorrect');
          }else if(request.status === 500) {
              alert('something went wrong on the server');
          }
      }
  };
  
  //Make a request
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  console.log(username);
  console.log(password);
  request.open('POST', 'http://viju99.imad.hasura-app.io/login', true);
  request.setRequestHeader('Content-Type','application/json');
  request.send(JSON.stringify({username: username, password: password}));
};
  
  