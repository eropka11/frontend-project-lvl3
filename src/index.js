import 'bootstrap';
import './_custom.scss';
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import render from './render.js';
import ru from './locale.js';

const app = () => {
  const state = {
    input: '',
    error: '',
    feed: '',
    posts: '',
    addedUrls: [],
    addedPosts: [],
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

  const xmlParse = (xml) => {
    const parser = new DOMParser();
    return parser.parseFromString(xml, 'application/xml');
  };

  const getPosts = (postsList) => {
    const postsData = [];
    postsList.forEach((post) => {
      const postData = {
        name: post.querySelector('title').textContent,
        description: post.querySelector('description').textContent,
        link: post.querySelector('link').textContent,
        id: state.addedPosts.length + 1,
      };
      const namesOfAddedPosts = state.addedPosts.map((addedPost) => addedPost.name);
      if (!namesOfAddedPosts.includes(postData.name)) {
        postsData.push(postData);
        watchedState.addedPosts.push(postData);
      }
    });
    if (postsData.length > 0) {
      watchedState.posts = postsData;
    }
  };

  const updater = () => {
    state.addedUrls.map((url) => {
      axios({
        method: 'get',
        url: `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`,
      }).then((response) => {
        const parsedRss = xmlParse(response.data.contents);
        if (parsedRss.querySelector('parsererror') !== null) {
          return;
        }
        const posts = parsedRss.querySelectorAll('item');
        getPosts(posts);
      });
      return 1;
    });
    window.setTimeout(updater, 5000);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const currentValue = formData.get('url');
    const schema = yup.string()
      .required()
      .url(i18next.t('invalidUrl'))
      .notOneOf(state.addedUrls, i18next.t('duplicatedUrl'));
    schema.validate(currentValue).then(() => {
      axios({
        method: 'get',
        url: `https://allorigins.hexlet.app/get?url=${encodeURIComponent(currentValue)}`,
      }).then((response) => {
        const parsedRss = xmlParse(response.data.contents);
        if (parsedRss.querySelector('parsererror') !== null) {
          watchedState.error = i18next.t('notValidRss');
          return;
        }
        watchedState.input = currentValue;
        const channelName = parsedRss.querySelector('channel > title').textContent;
        const channelDescription = parsedRss.querySelector('channel > description').textContent;
        const feed = {
          name: channelName,
          description: channelDescription,
          id: state.addedUrls.length + 1,
        };
        watchedState.feed = feed;
        const posts = parsedRss.querySelectorAll('item');
        getPosts(posts);
        watchedState.addedUrls.push(currentValue);
      })
        .catch((err) => {
          watchedState.error = err.errors;
        });
    })
      .catch((err) => {
        watchedState.error = err.errors;
      });
  });
  window.setTimeout(updater, 5000);
};

app();
