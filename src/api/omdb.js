import axios from 'axios';

export default (movieName) => 
axios.get(`https://www.omdbapi.com/?i=tt3896198&apikey=f22882b3&type=movie&s=${movieName}`)