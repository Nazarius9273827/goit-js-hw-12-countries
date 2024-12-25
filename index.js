import './styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import { alert, notice } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
  input: document.querySelector('#search-input'),
  results: document.querySelector('#results'),
};

refs.input.addEventListener('input', debounce(onInputChange, 500));

function onInputChange(event) {
  const searchQuery = event.target.value.trim();

  if (!searchQuery) {
    clearResults();
    return;
  }

  fetchCountries(searchQuery)
    .then(countries => {
      clearResults();
      if (countries.length > 10) {
        showNotification('Введіть більш специфічний запит.');
      } else if (countries.length >= 2 && countries.length <= 10) {
        renderCountryList(countries);
      } else if (countries.length === 1) {
        renderCountryDetails(countries[0]);
      }
    })
    .catch(() => {
      showNotification('Країну не знайдено. Спробуйте ще раз.');
      clearResults();
    });
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => `<li>${country.name}</li>`)
    .join('');
  refs.results.innerHTML = `<ul>${markup}</ul>`;
}

function renderCountryDetails(country) {
  const { name, capital, population, languages, flag } = country;
  const languagesList = languages.map(lang => lang.name).join(', ');

  const markup = `
    <div>
      <h2>${name}</h2>
      <p><strong>Столиця:</strong> ${capital}</p>
      <p><strong>Населення:</strong> ${population}</p>
      <p><strong>Мови:</strong> ${languagesList}</p>
      <img src="${flag}" alt="Прапор ${name}" width="200">
    </div>
  `;
  refs.results.innerHTML = markup;
}

function clearResults() {
  refs.results.innerHTML = '';
}

function showNotification(message) {
  alert({
    text: message,
    delay: 2000,
  });
}