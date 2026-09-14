export function openModal(modalElement) {
  modalElement.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscClose);
}

export function closeModal(modalElement) {
  modalElement.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscClose);
}

export function handleOverlayClick(evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(evt.currentTarget);
  }
}

function handleEscClose(evt) {
  if (evt.key !== 'Escape') return;
  const openedPopup = document.querySelector('.popup_is-opened');
  if (openedPopup) closeModal(openedPopup);
}