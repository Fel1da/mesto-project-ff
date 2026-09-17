import '../pages/index.css';

import {
  getUserInfo,
  getInitialCards,
  updateUserInfo,
  updateAvatar,
  addCard,
} from './api.js';
import {
  createCard,
  handleLikeCard,
  handleDeleteCard,
} from './card.js';
import { openModal, closeModal, handleOverlayClick } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';

/* Настройки валидации */

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
};

/* DOM-элементы */

const placesList = document.querySelector('.places__list');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');
const editProfileButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');
const editAvatarButton = document.querySelector('.profile__image-edit-button');

const popups = document.querySelectorAll('.popup');

const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupAvatar = document.querySelector('.popup_type_avatar');
const popupImage = document.querySelector('.popup_type_image');
const popupImagePic = popupImage.querySelector('.popup__image');
const popupImageCaption = popupImage.querySelector('.popup__caption');

const editForm = popupEdit.querySelector('.popup__form');
const nameInput = editForm.querySelector('.popup__input_type_name');
const descriptionInput = editForm.querySelector('.popup__input_type_description');

const addCardForm = popupNewCard.querySelector('.popup__form');
const placeNameInput = addCardForm.querySelector('.popup__input_type_card-name');
const placeLinkInput = addCardForm.querySelector('.popup__input_type_url');

const avatarForm = popupAvatar.querySelector('.popup__form');
const avatarInput = avatarForm.querySelector('.popup__input_type_avatar');

/* Состояние приложения */

let currentUserId = null;

/* Вспомогательные функции */

function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = 'Сохранение...';
    button.disabled = true;
  } else {
    button.textContent = button.dataset.originalText || button.textContent;
    button.disabled = false;
  }
}

/* Обработчики попапов */

function handleCloseButtonClick(evt) {
  const popup = evt.target.closest('.popup');
  if (popup) {
    closeModal(popup);
  }
}

function handleOpenEditProfile() {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;
  clearValidation(editForm, validationConfig);
  openModal(popupEdit);
}

function handleOpenNewCard() {
  addCardForm.reset();
  clearValidation(addCardForm, validationConfig);
  openModal(popupNewCard);
}

function handleOpenAvatar() {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(popupAvatar);
}

function handleImageClick(cardData) {
  popupImagePic.src = cardData.link;
  popupImagePic.alt = cardData.name;
  popupImageCaption.textContent = cardData.name;
  openModal(popupImage);
}

/* Обработчики форм */

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = editForm.querySelector(validationConfig.submitButtonSelector);
  setButtonLoading(submitButton, true);

  updateUserInfo(nameInput.value, descriptionInput.value)
    .then((user) => {
      profileTitle.textContent = user.name;
      profileDescription.textContent = user.about;
      closeModal(popupEdit);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonLoading(submitButton, false);
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitButton = addCardForm.querySelector(validationConfig.submitButtonSelector);
  setButtonLoading(submitButton, true);

  addCard(placeNameInput.value, placeLinkInput.value)
    .then((cardData) => {
      const card = createCard(
        cardData,
        handleLikeCard,
        handleDeleteCard,
        handleImageClick,
        currentUserId
      );
      placesList.prepend(card);
      addCardForm.reset();
      closeModal(popupNewCard);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonLoading(submitButton, false);
    });
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = avatarForm.querySelector(validationConfig.submitButtonSelector);
  setButtonLoading(submitButton, true);

  updateAvatar(avatarInput.value)
    .then((user) => {
      profileImage.style.backgroundImage = `url(${user.avatar})`;
      avatarForm.reset();
      closeModal(popupAvatar);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonLoading(submitButton, false);
    });
}

/* Инициализация приложения */

enableValidation(validationConfig);

editProfileButton.addEventListener('click', handleOpenEditProfile);
addCardButton.addEventListener('click', handleOpenNewCard);
editAvatarButton.addEventListener('click', handleOpenAvatar);

editForm.addEventListener('submit', handleEditFormSubmit);
addCardForm.addEventListener('submit', handleAddCardSubmit);
avatarForm.addEventListener('submit', handleAvatarFormSubmit);

popups.forEach((popup) => {
  popup.addEventListener('click', handleOverlayClick);
  popup
    .querySelector('.popup__close')
    .addEventListener('click', handleCloseButtonClick);
});

Promise.all([getUserInfo(), getInitialCards()])
  .then(([user, cards]) => {
    currentUserId = user._id;

    profileTitle.textContent = user.name;
    profileDescription.textContent = user.about;
    profileImage.style.backgroundImage = `url(${user.avatar})`;

    cards.forEach((cardData) => {
      const card = createCard(
        cardData,
        handleLikeCard,
        handleDeleteCard,
        handleImageClick,
        currentUserId
      );
      placesList.append(card);
    });
  })
  .catch((err) => {
    console.error(err);
  });