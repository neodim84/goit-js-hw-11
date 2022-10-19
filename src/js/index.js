import '../css/styles.css';
import '../css/gallery.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { getSearchImage, ITEMS_PER_PAGE } from './PixabayAPI';
import { createMarkup } from './createMarkup';

let onClickLoadMoreBtn = null;

const currentImages = {
  page: null,
  data: null,
  value: null,
};

const refs = {
  form: document.querySelector('.search-form'),
  formInput: document.querySelector('.search-form [name="searchQuery"]'),
  formBtn: document.querySelector('.search-form button'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const lightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

refs.form.addEventListener('submit', onSubmitForm);

async function onSubmitForm(evt) {
  evt.preventDefault();

  removeChildren(refs.gallery);
  const inputValue = refs.formInput.value.trim();
  currentImages.value = inputValue;
  if (inputValue === '') {
    Notify.warning(`Please, enter any value in the field.`);
    return false;
  }
  return loadingImages(1, inputValue)();
}

function loadingImages(page, value) {
  currentImages.page = page;
  return async () => {
    removeMoreEvent(onClickLoadMoreBtn);
    let data;

    try {
      data = await getSearchImage({ page, value });
      currentImages.data = data;
    } catch (evt) {
      Notify.failure(evt.message);
    }
    const pagesVal = Math.ceil(data.totalHits / ITEMS_PER_PAGE);

    if (data.totalHits === 0 && page === 1) {
      Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
    }
    if (data.totalHits > 0 && page === 1) {
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }
    if (pagesVal > 0 && page === pagesVal) {
      Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
    }

    renderGalleryList(data.hits);

    showLoadMoreBtn({ data, page, value });
  };
}

function showLoadMoreBtn({ data, page, value }) {
  if (!data) return;
  const moreItems = getIsVisibleLoadMoreBtn({
    totalHits: data.totalHits,
    page,
    perPage: ITEMS_PER_PAGE,
  });

  if (moreItems) {
    addLoadMoreBtn(page, value);
  } else {
    removeLoadMoreBtn();
  }
}

function addLoadMoreBtn(page, value) {
  refs.loadMoreBtn.classList.remove('is-hidden');
  onClickLoadMoreBtn = loadingImages(page + 1, value);
  refs.loadMoreBtn.addEventListener('click', onClickLoadMoreBtn, {
    once: true,
  });
}

function removeLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('is-hidden');
}

function removeMoreEvent(onEvt) {
  if (onEvt) {
    refs.loadMoreBtn.removeEventListener('click', onEvt);
    onEvt = null;
  }
}

function renderGalleryList(images) {
  const templates = images.map(img => createMarkup(img)).join('');
  refs.gallery.insertAdjacentHTML('beforeend', templates);
  lightBox.refresh();
}

function removeChildren(elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
}

function getIsVisibleLoadMoreBtn({ totalHits, page, perPage }) {
  const pages = Math.ceil(totalHits / perPage);
  return pages > page;
}
