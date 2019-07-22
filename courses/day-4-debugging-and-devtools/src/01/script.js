const form = document.getElementsByClassName('calculator')[0];

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const input1 = document.getElementsByClassName('calculator__input')[0];
  const input2 = document.getElementsByClassName('calculator__input')[1];

  const calculation = addValues(input1.value, input2.value);

  let output = document.getElementsByClassName('calculator__output')[0];
  output.value = calculation;

});

function addValues(value1, value2) {
  return value1 + value2;
}