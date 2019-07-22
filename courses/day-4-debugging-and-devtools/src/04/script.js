const greet = function (person) {
  let message;
  switch(person.name) {
    case 'Jan':
      message = 'Hey Jan, welcome!';
    case 'Ramon':
      message = 'Hey Ramon, welcome!';
    case 'Timo':
      message = 'Hey Timo, welcome!';
    default:
      message = 'Hey ' + person.name + ', you are not on the guest list :(';
  }
  return message;
};

const messageEl = document.getElementById('message');

messageEl.innerHTML = greet({name: 'Ramon'});