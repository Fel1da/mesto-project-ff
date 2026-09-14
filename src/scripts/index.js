import '../pages/index.css';

import { initialCards } from './cards.js';
import {
  createCard,
  handleLikeCard,
  handleDeleteCard,
} from './card.js';
import { openModal, closeModal, handleOverlayClick } from './modal.js';

/* DOM-элементы страницы */

const placesList = document.querySelector('.places__list');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const editProfileButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');

const popups = document.querySelectorAll('.popup');

const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const popupImagePic = popupImage.querySelector('.popup__image');
const popupImageCaption = popupImage.querySelector('.popup__caption');

const editForm = popupEdit.querySelector('.popup__form');
const nameInput = editForm.querySelector('.popup__input_type_name');
const descriptionInput = editForm.querySelector('.popup__input_type_description');

const addCardForm = popupNewCard.querySelector('.popup__form');
const placeNameInput = addCardForm.querySelector('.popup__input_type_card-name');
const placeLinkInput = addCardForm.querySelector('.popup__input_type_url');

/* Обработчики */

function handleCloseButtonClick(evt) {
  const popup = evt.target.closest('.popup');
  if (popup) closeModal(popup);
}

function handleOpenEditProfile() {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;
  openModal(popupEdit);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;
  closeModal(popupEdit);
}

function handleOpenNewCard() {
  addCardForm.reset();
  openModal(popupNewCard);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const cardData = {
    name: placeNameInput.value,
    link: placeLinkInput.value,
  };

  const newCard = createCard(
    cardData,
    handleLikeCard,
    handleDeleteCard,
    handleImageClick
  );

  placesList.prepend(newCard);
  addCardForm.reset();
  closeModal(popupNewCard);
}

function handleImageClick(evt) {
  const image = evt.target;
  popupImagePic.src = image.src;
  popupImagePic.alt = image.alt;
  popupImageCaption.textContent = image.alt;
  openModal(popupImage);
}

/* Инициализация */

// Открытие попапов
editProfileButton.addEventListener('click', handleOpenEditProfile);
addCardButton.addEventListener('click', handleOpenNewCard);

// Отправка форм
editForm.addEventListener('submit', handleEditFormSubmit);
addCardForm.addEventListener('submit', handleAddCardSubmit);

// Закрытие попапов: оверлей + крестик (для всех попапов)
popups.forEach((popup) => {
  popup.addEventListener('click', handleOverlayClick);
  popup.querySelector('.popup__close').addEventListener('click', handleCloseButtonClick);
});

// Первичная отрисовка карточек из массива
initialCards.forEach((cardData) => {
  const card = createCard(
    cardData,
    handleLikeCard,
    handleDeleteCard,
    handleImageClick
  );
  placesList.append(card);
});