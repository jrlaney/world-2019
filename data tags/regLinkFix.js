const regBtn = document.querySelectorAll('.reg-link');
const correctRegBtn = document.getElementById("ctl00_hlNavRegister");

for (let index = 0; index < regBtn.length; index++) {
     regBtn[index].href=correctRegBtn.href;
}