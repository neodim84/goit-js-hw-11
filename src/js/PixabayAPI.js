import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '30593718-dfa03c896511ade713d6a5a4d';
export const ITEMS_PER_PAGE = 40;

export async function getSearchImage({ value, page = 1 }) {
  const options = {
    params: {
      key: API_KEY,
      q: value,
      page: page,
      per_page: ITEMS_PER_PAGE,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  };
  const { data } = await axios.get(`${BASE_URL}`, options);
  return data;
}
