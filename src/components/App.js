import React from 'react';
import SearchBar from './SearchBar';
import omdb from '../api/omdb';
import { ToastContainer, ToastStore } from 'react-toasts'
import 'react-toastify/dist/ReactToastify.css';
import './App.css'


class App extends React.Component {
    state = { movies: [], selectedMovieList: [], text: '', loading: false, nominate: false };


    componentDidMount() {
        const nominatedMovies = JSON.parse(localStorage.getItem('selected_nominations')) || '';
        this.setState({ selectedMovieList : nominatedMovies})
    }
    
    
    onTermSubmit = async movie => {
        this.setState({loading: true})
        const response = await omdb(movie)
        if (response) { this.setState({ loading: false, movies: response.data.Search, selectedMovieList: [], text: movie }) }
    }

    saveToLocalStorage = (items) =>{
        localStorage.setItem('selected_nominations', JSON.stringify(items));
    };

    onSelectMovie = selected => {
        this.setState({nominate: true})
        this.setState({ selectedMovieList: [...this.state.selectedMovieList, selected] })
        this.saveToLocalStorage([...this.state.selectedMovieList, selected]);
    }

    onDeleteMovie = (id) => {
        this.setState({
            selectedMovieList: this.state.selectedMovieList.filter(movie => { return movie.imdbID !== id })
        })
        this.saveToLocalStorage(this.state.selectedMovieList)
    }
    render() {
        const { selectedMovieList, text, loading, nominate } = this.state;
        return (
            <div>
                <h1>The Shoppies</h1>
                <SearchBar onFormSubmit={this.onTermSubmit} />
                {text && <p id="result">Result search for {text}</p>}
                <div className="main-div">
                {loading ?
                 <h2>Loading...</h2> :
                (<div>{this.state.movies.map(movie => {
                        return (
                            <div className="gen">
                                <img alt="" className="ui image" src={movie.Poster} />
                                <div className="mini-div">
                                    <p>{movie.Title} ({movie.Year})</p><br />
                                    <button
                                        onClick={() => {
                                            this.onSelectMovie(movie)
                                            if (selectedMovieList.length === 4) {
                                                ToastStore.success("You have nominated 5 movies", 3000)
                                            }
                                        }}
                                        disabled={!!selectedMovieList.find(s => s.imdbID === movie.imdbID)}
                                        style={{ backgroundColor: !!selectedMovieList.find(s => s.imdbID === movie.imdbID) && 'gray' }}
                                    >Nominate</button>
                                </div>
                                <div>
                                    <ToastContainer store={ToastStore} position={ToastContainer.POSITION.TOP_BOTTOM} />
                                </div>
                            </div>
                        )
                    })}
                    </div>)}
                    <div>
                    {nominate && <h2>Nominated Movies</h2>}
                    {this.state.selectedMovieList.length > 0 && this.state.selectedMovieList.map(movie => {
                            return (
                                <div className="gen">
                                    <img alt="" className="ui image" src={movie.Poster} />
                                    <div className="mini-div">
                                        <p>{movie.Title} ({movie.Year})</p><br />
                                        <button id="remove" onClick={() => {
                                            this.onDeleteMovie(movie.imdbID)
                                            ToastStore.warning("Nominations Removed", 1000)
                                        }}>Remove</button>
                                        <div>
                                            <ToastContainer store={ToastStore} position={ToastContainer.POSITION.TOP_RIGHT} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div ></div>
                </div>
            </div>
        )
    }
}
export default App;
