'use strict';

const signUpButton = document.getElementById('sign-up_link'),
   signInButton = document.getElementById('sign-in_link'),
   container = document.getElementById('container'),
   regInfoAlert = document.getElementById('reg-info-alert'),
   regName = document.getElementById('reg-name'),
   regLogin = document.getElementById('reg-login'),
   regPass = document.getElementById('reg-pass'),
   authInfoAlert = document.getElementById('auth-info-alert'),
   authLogin = document.getElementById('auth-login'),
   authPass = document.getElementById('auth-pass'),
   regBtn = document.getElementById('reg-btn'),
   authBtn = document.getElementById('auth-btn'),
   regForm = document.getElementById('reg-form'),
   regInputs = regForm.querySelectorAll('input'),
   usersList = document.querySelector('.users-list'),
   userName = document.getElementById('user-name');

let db = [];
if (localStorage.users) {
   db = JSON.parse(localStorage.users);
}


const userNameHandler = () => {
   let userData = regName.value.split(' ');
   if (userData.length < 2) {
      console.error(`Введите имя и фамилию через пробел`);
      return false;
   } else if (userData.length > 2) {
      console.error(`Введите только имя и фамилию`);
      return false;
   } else {
      return (regName.value.split(' '));
   }
};
const loginHandler = (value) => {
   if (value.length < 3 || value === '') {
      console.error(`Логин должен быть такой то`);
      return false;
   } else {
      return value;
   }
}
const paswordHandler = (value) => {
   if (value.length < 3 || value === '') {
      console.error(`Пароль должен быть такой то`);
      return false;
   } else {
      return value;
   }
}
const dateHandler = () => {
   let todayDay = new Date();
   let regDate = todayDay.toLocaleString('ru', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
   });
   let regTime = todayDay.toLocaleString('ru', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
   });
   let formatedDate = regDate + ', ' + regTime;
   return formatedDate;
}
const renderUsersList = () => {
   let table = usersList.querySelector('tbody');
   // удаляем со страницы перед рендером
   while (table.firstChild) {
      table.removeChild(table.firstChild);
   }

   if (db) {
      db.forEach(e => {
         let newUser = document.createElement('tr');
         usersList.style.display = 'block';
         newUser.innerHTML = `
            <td>${e.firstName}</td>
            <td>${e.lastName}</td>
            <td class='login'>${e.login}</td>
            <td>${e.password}</td>
            <td>${e.regDate}</td>
            <td><button class='delete-user'>&#10006;</button></td>
      `;
         table.append(newUser);
      })
   }
}
const pushToDb = () => {
   localStorage.users = JSON.stringify(db);
}
const addUser = () => {
   let newUser = {
      firstName: userNameHandler()[0],
      lastName: userNameHandler()[1],
      login: loginHandler(regLogin.value),
      password: paswordHandler(regPass.value),
      regDate: dateHandler()
   };

   if (Object.values(newUser).every(v => v)) {
      userName.innerText = newUser.firstName;
      regInputs.forEach(e => e.value = '');
      db.push(newUser);
      renderUsersList();
      pushToDb();
   } else {
      return;
   }
};

const findKey = (e) => {
   let id = e.target.parentNode.closest('tr');
   id = id.childNodes
   id.forEach((e) => {
      if (e.className === 'login') {
         id = e.innerText;
      }
   })
   return id;
}

const deleteUser = (event) => {
   const itemKey = findKey(event);
   db.forEach((e, i) => {
      if (itemKey === e.login) {
         db.splice(i, 1)
      }
   });
   if (db.length < 1) {
      usersList.style.display = 'none';
   }
   pushToDb();
   renderUsersList();
}
const loginUser = () => {
   if (db.length) {
      const valuesHandler = () => {
         let trueValue;
         db.forEach((e) => {
            if (e.login === authLogin.value && e.password === authPass.value) {
               console.log('e.firstName: ', e.firstName);
               trueValue = e.firstName;
            }
         })
         return trueValue
      }

      let name = valuesHandler();
      console.log('name: ', name);
      if (name) {
         userName.innerText = name;
      } else {
         alert('Пользователь не найден');
      }
   } else {
      alert('Нет зарегистрированных пользователей!')
   }
}
renderUsersList()


document.addEventListener('click', (event) => {
   if (event.target.closest('.delete-user')) {
      deleteUser(event);
   }
})

regBtn.addEventListener('click', (e) => {
   e.preventDefault()
   addUser();
});
authBtn.addEventListener('click', (e) => {
   e.preventDefault()
   loginUser();
});

signUpButton.addEventListener('click', () => {
   container.classList.add("right-panel-active");
});
signInButton.addEventListener('click', () => {
   container.classList.remove("right-panel-active");
});

