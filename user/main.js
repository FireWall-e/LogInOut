'use strict';
const App = (() => {
    const q = selector => {
        return document.querySelectorAll(selector);
    };

    const logout = () => {
        let paths;
        localStorage.removeItem('accessLevel');
        location.href = ((paths = location.href.split('/')) && (paths.length-=2) && (paths.join('/') + '/index.html'));
    };

    const retrieveContent = () => {
        for (let i = 0; i < localStorage.length; i++) {
            const id = i + 1;
            const content = localStorage['content-' + id];
            if (content) {
                addContent(id, JSON.parse(content));
            }
        }
    }

    const addContent = (id, content, position = 'afterbegin') => {
        q('.content')[0].insertAdjacentHTML(position,
            `
                <div data-content-id="${id}" class="content-item">
                    <div class="content-text">
                    <input class="content-text__item content-title" value="${content.title}" onkeyup="App.contentChange(event)" disabled/>
                    <textarea class="content-text__item content-note" onkeyup="App.contentChange(event)" disabled>${content.note}</textarea>
                    </div>
                </div>
             `
        );
    };

    retrieveContent();

    return {
        logout: logout
    }
})();