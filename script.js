/********************
 * links
 *
 * {@link} - https://www.heropatterns.com/
 * {@link} - https://fonts.google.com/
 * {@link} - https://www.w3schools.com/cssref/pr_pos_vertical-align.asp
 * {@link} - https://fontawesome.com/icons?d=gallery
 * {@link} - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label
 * {@link} - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
 * {@link} - https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event
 * {@link} - https://www.w3schools.com/jsref/event_preventdefault.asp
 * {@link} - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
 * {@link} - https://regexr.com/
 * {@link} - https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
 * {@link} - https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 * {@link} - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
 * {@link} - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
 * {@link} - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
 **********************/

const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];


//show modal, focus on input 
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}



//modal event listners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

//validate form 
function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);

    if (!nameValue || !urlValue) {
        alert('please submit values for both fields')
        return false;
    }

    if (!urlValue.match(regex)) {
        alert('please provide a valid web adress');
        return false;
    }

    //valid
    return true;

}


//build bookmarks dom
function buildBookmarks() {

    //remove all bookmark elemets
    bookmarksContainer.textContent = '';

    //build items
    bookmarks.forEach((bookmark) => {
        const { name, url } = bookmark;
        //console.log(name, url);

        //item
        const item = document.createElement('div');
        item.classList.add('item');

        //close item
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'deletebookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);

        //favicon - link container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        //favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'favicon');
        //link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;

        //appent to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}


//fetch bookmarks
function fetchBookmarks() {
    //get bookmarks from local storage if available
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        //create bookmarks array in local storage
        bookmarks = [
            {
                name: 'google',
                url: 'https://google.com',
            },
        ];

        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        //console.log(bookmarks);
    }
    buildBookmarks();

}


//delete bookmarks
function deleteBookmark(url) {
    //    console.log('delete url ' , url);
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.url === url) {
            bookmarks.splice(i, 1);
        }
    });

    //update bookmarks array in local storage, re-populate dom
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

//handle data from form
function storeBookmark(e) {
    //console.log(e);
    e.preventDefault();
    //console.log(e);
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    //console.log(nameValue, urlValue);

    // add 'https://' if not there
    if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
        urlValue = `https://${urlValue}`;
    }
    //console.log(nameValue, urlValue);

    // validate
    if (!validate(nameValue, urlValue)) {
        return false;
    }

    const bookmark = {
        name: nameValue,
        url: urlValue,
    };

    bookmarks.push(bookmark);
    //console.log(bookmarks);


    // set bookmarks in localStorage, fetch, reset input fields
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    //console.log(bookmarks);
    //console.log(JSON.stringify(bookmarks));
    fetchBookmarks();

    bookmarkForm.reset();
    websiteNameEl.focus();

}

//event listener
bookmarkForm.addEventListener('submit', storeBookmark);

//on load, fetch bookmraks
fetchBookmarks(); 