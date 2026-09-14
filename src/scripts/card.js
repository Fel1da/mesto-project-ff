const cardTemplate = document.querySelector('#card-template').content;

export function createCard(cardData, handleLike, handleDelete, handleImageClick) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  likeButton.addEventListener('click', handleLike);
  deleteButton.addEventListener('click', handleDelete);
  cardImage.addEventListener('click', handleImageClick);

  return cardElement;
}

export function handleLikeCard(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}

export function handleDeleteCard(evt) {
  evt.target.closest('.card').remove();
}