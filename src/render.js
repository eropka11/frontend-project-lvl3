import i18next from 'i18next';

export default (path, value, form) => {
  const inputField = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');
  const feedsHeader = document.querySelector('#feeds-header');
  const ulForFeeds = document.querySelector('#feeds-list');
  const postsHeader = document.querySelector('#posts-header');
  const ulForPosts = document.querySelector('#posts-list');

  if (path === 'error') {
    inputField.classList.add('is-invalid');
    feedback.classList.add('text-danger');
    feedback.classList.remove('text-success');
    feedback.textContent = value;
  }
  if (path === 'feed') {
    if (value.id === 1) {
      feedsHeader.textContent = 'Фиды';
    }
    const liForFeed = document.createElement('li');
    liForFeed.classList.add('list-group-item', 'border-0', 'border-end-0');
    ulForFeeds.prepend(liForFeed);

    const feedNameHeader = document.createElement('h3');
    feedNameHeader.classList.add('h6', 'm-0');
    feedNameHeader.textContent = value.name;
    liForFeed.append(feedNameHeader);

    const pForDescription = document.createElement('p');
    pForDescription.classList.add('m-0', 'small', 'text-black-50');
    pForDescription.textContent = value.description;
    liForFeed.append(pForDescription);
  }
  if (path === 'posts') {
    if (value[0].feedId === 1) {
      postsHeader.textContent = 'Посты';
    }
    let i = value.length;
    value.reverse().map((post) => {
      const liForPost = document.createElement('li');
      liForPost.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

      const aElementForPost = document.createElement('a');
      aElementForPost.setAttribute('href', post.link);
      aElementForPost.setAttribute('target', '_blank');
      aElementForPost.setAttribute('rel', 'noopener noreferrer');
      aElementForPost.dataset.id = i;
      aElementForPost.classList.add('fw-bold');
      aElementForPost.textContent = post.name;

      const buttonForPost = document.createElement('button');
      buttonForPost.setAttribute('type', 'button');
      buttonForPost.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      buttonForPost.dataset.id = i;
      buttonForPost.dataset.bsToggle = 'modal';
      buttonForPost.dataset.bsTarget = '#modal';
      buttonForPost.textContent = 'Просмотр';

      liForPost.append(aElementForPost, buttonForPost);
      ulForPosts.prepend(liForPost);
      i -= 1;
      return liForPost;
    });
  }
  if (path === 'input') {
    inputField.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = i18next.t('successMessage');
    form.reset();
    inputField.focus();
  }
};
