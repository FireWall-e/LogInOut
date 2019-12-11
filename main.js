'use strict';
const App = (() => {
    const formSubmit = () => {
        let accessLevel;
        document.querySelectorAll('.form-input').forEach(i => {
            switch(i.id) {
                case 'login':
                    if (i.value === 'admin@email.com') {
                        accessLevel = 'admin';
                    }
                    else if (i.value === 'user@email.com') {
                        accessLevel = 'user';
                    }
                    else {
                        alert('Неверное имя пользователя!');
                    }
                break;
                case 'password':
                    if (accessLevel && i.value.length > 7 && (i.value === 'adminadmin' || i.value === 'useruser')) { 
                        auth(accessLevel);
                    }
                    else {
                        alert('Неверный пароль!');
                    }
                break;
            }
        });
    };
    
    const auth = (accessLevel) => {
        localStorage.setItem('accessLevel', accessLevel);
        let href;
        let locationPaths = location.href.split('/');
        if (locationPaths[locationPaths.length - 1].indexOf('.') > -1) {
            locationPaths.length--;
            href = locationPaths.join('/');
        }
        if (href) {
            location.href = href + '/' + accessLevel + '/index.html';
        }
        else {
            location.href += accessLevel + '/index.html';
        }
    }
    
    return {
        formSubmit: formSubmit
    };
})();