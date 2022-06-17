import 'bootstrap';
import './_custom.scss';
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import render from './render.js';
import ru from './locale.js';

const app = () => {
  const state = {
    input: '',
    feedList: [],
    error: '',
  };

  i18next.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  const form = document.querySelector('form');

  const watchedState = onChange(state, (path, value) => {
    render(path, value, form);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const currentValue = formData.get('url');
    const schema = yup.string()
      .required()
      .url(i18next.t('invalidUrl'))
      .notOneOf(state.feedList, i18next.t('duplicatedUrl'));
    schema.validate(currentValue).then(() => {
      watchedState.feedList.push(currentValue);
      watchedState.input = currentValue;
    })
      .catch((err) => {
        watchedState.error = err.errors;
      });
  });
};

app();
