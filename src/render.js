import i18next from 'i18next';

export default (path, value, form) => {
  const inputField = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');
  if (path === 'error') {
    inputField.classList.add('is-invalid');
    feedback.classList.add('text-danger');
    feedback.classList.remove('text-success');
    feedback.textContent = value;
  }
  if (path === 'input') {
    inputField.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = i18next.t('successMessage');
    form.reset();
  }
};
