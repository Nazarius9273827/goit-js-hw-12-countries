const BASE_URL = 'https://restcountries.com/v2';

export default function fetchCountries(searchQuery) {
  return fetch(`${BASE_URL}/name/${searchQuery}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Помилка запиту');
      }
      return response.json();
    })
    .catch(error => console.error('Error:', error));
}
