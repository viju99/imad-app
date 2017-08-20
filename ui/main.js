//counter code
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
