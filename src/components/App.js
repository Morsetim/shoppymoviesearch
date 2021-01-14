import React from 'react';
import SearchBar from './SearchBar';
import omdb from '../api/omdb';
import { ToastContainer, ToastStore } from 'react-toasts'
import 'react-toastify/dist/ReactToastify.css';
import './App.css'


class App extends React.Component {
    state = { movies: [], selectedMovieList: [], text: '', loading: false };


    onTermSubmit = async movie => {
        this.setState({loading: true})
        const response = await omdb(movie)
        if (response) { this.setState({ loading: false, movies: response.data.Search, selectedMovieList: [], text: movie }) }
    }

    onSelectMovie = selected => {
        this.setState({ selectedMovieList: [...this.state.selectedMovieList, selected] })
    }

    onDeleteMovie = (id) => {
        this.setState({
            selectedMovieList: this.state.selectedMovieList.filter(movie => { return movie.imdbID !== id })
        })
    }
    render() {
        const { selectedMovieList, text, loading } = this.state;
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
                                    <ToastContainer store={ToastStore} position={ToastContainer.POSITION.TOP_CENTER} />
                                </div>
                            </div>
                        )
                    })}
                    </div>)}
                    <div>
                        {this.state.selectedMovieList.map(movie => {
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
