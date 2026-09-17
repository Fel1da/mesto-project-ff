import { likeCard, unlikeCard, deleteCard } from './api.js';

const cardTemplate = document.querySelector('#card-template').content;

export function createCard(
  cardData,
  handleLike,
  handleDelete,
  handleImageClick,
  currentUserId
) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;

  if (cardData.likes.some((user) => user._id === currentUserId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  if (cardData.owner._id === currentUserId) {
    deleteButton.addEventListener('click', () => {
      handleDelete(cardData._id, cardElement);
    });
  } else {
    deleteButton.remove();
  }

  likeButton.addEventListener('click', () => {
    handleLike(cardData._id, likeButton, likeCount);
  });

  cardImage.addEventListener('click', () => {
    handleImageClick(cardData);
  });

  return cardElement;
}

export function handleLikeCard(cardId, likeButton, likeCount) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');
  const toggleLike = isLiked ? unlikeCard : likeCard;

  toggleLike(cardId)
    .then((updatedCard) => {
      likeButton.classList.toggle('card__like-button_is-active');
      likeCount.textContent = updatedCard.likes.length;
    })
    .catch((err) => {
      console.error(err);
    });
}

export function handleDeleteCard(cardId, cardElement) {
  deleteCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.error(err);
    });
}