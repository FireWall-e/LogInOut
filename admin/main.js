'use strict';
const App = (() => {
    const data = {
        content: {}
    };

    const q = selector => {
        return document.querySelectorAll(selector);
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

    const getContentId = () => {
        const content = q('.content')[0];
        return content.children.length ? +content.firstElementChild.dataset.contentId + 1 : 1;
    };

    const addContent = (id, content = {
        title: '',
        note: ''
    }, position = 'afterbegin') => {
        id = id || getContentId();
        data.content[id] = {};
        data.content[id] = content;

        q('.content')[0].insertAdjacentHTML(position,
            `
                <div data-content-id="${id}" class="content-item">
                    <div class="content-text">
                    <input class="content-text__item content-title" value="${content.title}" onkeyup="App.contentChange(event)"/>
                    <textarea class="content-text__item content-note" onkeyup="App.contentChange(event)">${content.note}</textarea>
                    </div>
                    <div class="content-manage">
                        <button class="content__button button-save" onclick="App.saveContent(event.target)" title="Сохранить">💾</button>
                        <button class="content__button button-discard" onclick="App.discardContentChange(event.target)" title="Отменить">❌</button>
                        <button class="content__button button-delete" onclick="App.deleteContent(event.target)" title="Удалить">🗑️</button>
                    </div>
                </div>
             `
        );
    };

    const discardContentChange = button => {
        const id = button.parentNode.parentNode.dataset.contentId;
        const title = data.content[id].title;
        const note = data.content[id].note;

        q('[data-content-id="' + id + '"]')[0].classList.remove('edited');
        if (title) {
            q('[data-content-id="' + id + '"] .content-title')[0].value = title;
        }
        if (note) {
            q('[data-content-id="' + id + '"] .content-note')[0].value = note;
        }
    };

    const contentChange = event => {
        const textElement = event.target;
        const elementType = textElement.classList.contains('content-title') ? 'title' : 'note';
        const elementValue = textElement.value;
        const siblingElement = textElement.nextElementSibling || textElement.previousElementSibling;
        const siblngType = siblingElement.classList.contains('content-note') ? 'note' : 'title';
        const siblingValue = siblingElement.value;
        const contentId = textElement.parentNode.parentNode.dataset.contentId;
        const contentItem = textElement.parentNode.parentNode;
       
        if (data.content[contentId][elementType] !== elementValue || data.content[contentId][siblngType] !== siblingValue) {
            contentItem.classList.add('edited');
        }
        else {
            contentItem.classList.remove('edited');
        }
    };

    const saveContent = button => {
        const text = button.parentNode.previousElementSibling;
        const title = text.children[0].value;
        const note = text.children[1].value;
        const contentItem = button.parentNode.parentNode;
        const id = contentItem.dataset.contentId;
        const content = {
            title: title,
            note: note
        };

        contentItem.classList.remove('edited');
        localStorage.setItem('content-' + id, JSON.stringify(content));
        data.content[id] = content;
    };

    const deleteContent = button => {
        button.parentNode.parentNode.remove();
        localStorage.removeItem('content-' + button.parentNode.parentNode.dataset.contentId);
    };

    const logout = () => {
        let paths;
        localStorage.removeItem('accessLevel');
        location.href = ((paths = location.href.split('/')) && (paths.length-=2) && (paths.join('/') + '/index.html'));
    };

    retrieveContent();

    return {
        addContent: addContent,
        discardContentChange: discardContentChange,
        contentChange: contentChange,
        deleteContent: deleteContent,
        saveContent: saveContent,
        logout: logout
    }
})();