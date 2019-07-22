const greet = function (person) {
  if (person === {name: 'Ramon'}) {
    return 'Hey ' + person.name + ', welcome!';
  } else {
    return 'Hey ' + person.name + ', you are not on the guest list :(';
  }
};

const messageEl = document.getElementById('message');

messageEl.innerHTML = greet({name: 'Ramon'});