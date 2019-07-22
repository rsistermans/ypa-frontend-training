const greet = function (person) {
  switch(person.name) {
    case 'Ramon':
    case 'Jan':
    case 'Timo':
      this.name = person.name;
      break;
  }
};

const showGreeting = function(greeting) {
  greeting = greeting || {};
  let messageEl = document.getElementById('message');
  if(greeting.name) {
    messageEl.innerHTML = 'Hello ' + greeting.name + '!';
  } else {
    messageEl.innerHTML = 'Sorry, you are not on the list!';
  }
};


showGreeting(greet({name: 'Ramon'}));