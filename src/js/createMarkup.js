export const createMarkup = ({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) => {
  return `
  <a class="card" href="${largeImageURL}">
    <img class='card__img' src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info__item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info__item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info__item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info__item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
  </a>
  `;
};
