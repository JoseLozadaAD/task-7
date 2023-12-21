const countdown = document.querySelector('.countdown');
const btn = document.querySelector('.btn');

let count = Number(countdown.textContent);

btn.addEventListener('click', () => {
  count += 1;
  countdown.textContent = count;
});

console.log('test.js');
