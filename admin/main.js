'use strict';
const App = (() => {
    const data = {};

    const q = selector => {
        return document.querySelectorAll(selector);
    };

    const retrieveContent = () => {
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key) && /^content-[0-9]+$/.exec(key)){
                const content = Object.assign({ id: key.split('-')[1] }, JSON.parse(localStorage[key]));
                console.log('content is ', content);
                addContent(content);
            }
        }
    }

    const getContentId = () => {
        const content = q('.content')[0];
        return content.children.length ? +content.lastElementChild.dataset.contentId + 1 : 1;
    };

    const addContent = (content = {
        id: '',
        title: '',
        note: ''
    }, position = 'beforeend') => {
        q('.content')[0].insertAdjacentHTML(position,
            `
                <div data-content-id="${content.id || getContentId()}" class="content-item">
                    <div class="content-text">
                    <input class="content-text__item content-title" value="${content.title}" onkeyup="App.contentChange(event)" onclick="App.captureText(event)" />
                    <textarea class="content-text__item content-note" onkeyup="App.contentChange(event)" onclick="App.captureText(event)">${content.note}</textarea>
                    </div>
                    <div class="content-manage">
                        <button class="content__button button-save" onclick="App.saveContent(event.target)">💾</button>
                        <button class="content__button button-delete" onclick="App.deleteContent(event.target)">🗑️</button>
                    </div>
                </div>
             `
        );
    };

    const captureText = event => {
        const textElement = event.target;
        const elementType = textElement.classList.contains('content-title') ? 'title' : 'note';
        // data.content = {
        //     id: event.target.parentNode.dataset.contentId,
        //     title: 
        // }
        // console.log(textElement);
        const contentId = textElement.parentNode.parentNode.dataset.contentId;
        // if (data.content) {}
        data.content = {};
        data.content.id = contentId;
        data.content[elementType] = textElement.value;
        console.log('data is ', data);
        // data.capturedText = event.target.value;
        // console.log('event ', event,'target', event.target, 'event.target.textContent', event.target.textContent);
        // console.log('captureText event is ', event);
    };

    const contentChange = event => {
        // console.log(event);
        // const contentText = event.target.textContent;
        // console.log(event.target.value, '---------------', event.target.textContent,'--------------', data.capturedText);
        const saveButton = event.target.parentNode.nextElementSibling.children[0];
        console.log('saveButton is ', saveButton);
        if (event.target.value !== data.capturedText) {
            saveButton.classList.add('show');
        }
        else {
            saveButton.classList.remove('show');
        }
    };

    const saveContent = button => {
        // button = button.target;
        button.classList.remove('show');
        const text = button.parentNode.previousElementSibling;
        localStorage.setItem('content-' + button.parentNode.parentNode.dataset.contentId, JSON.stringify({
            title: text.children[0].value,
            note: text.children[1].value
        }));
        console.log(localStorage);
    };

    const deleteContent = button => {
        // button = button.target;
        button.parentNode.parentNode.remove();
        // console.log('id is ', button.parentNode.parentNode.dataset.contentId);
        localStorage.removeItem('content-' + button.parentNode.parentNode.dataset.contentId);
        console.log(localStorage);
    };

    retrieveContent();

    return {
        addContent: addContent,
        captureText: captureText,
        contentChange: contentChange,
        deleteContent: deleteContent,
        saveContent: saveContent
    }
})();