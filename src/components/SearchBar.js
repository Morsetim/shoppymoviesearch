import React from 'react';
import './App.css'

class SearchBar extends React.Component{
    state = {search: ''};

    onInputChange = (e) => this.setState({ search: e.target.value})

    onFormSubmit = e => {
        e.preventDefault();
        this.props.onFormSubmit(this.state.search);        
    }
 render(){
     return(
         <div className="search-bar ui segment">
         <form onSubmit={this.onFormSubmit} className="ui form">
         <div className="field">
             <label>Movie title</label><br/>
             <input type="text" 
             placeholder="Select a movie"
             value={this.state.search}                           
             onChange={this.onInputChange}/>
         </div>
     </form>
         </div>
         
     )
 }
}


export default SearchBar;