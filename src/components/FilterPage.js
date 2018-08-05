import React, { Component } from 'react';

class FilterPage extends Component {

    state = {
        query: ''
    }

    updateQuery = (query) => {
        this.setState({ query: query })
    }

    componentDidUpdate() {
        // Trigger filter button indication when filter window is closed,
        // but filter still applied
        !this.props.isFilterOpen && this.props.indication(this.state.query)
    }

    render() {
        const { isFilterOpen, markerList } = this.props;

        const { query } = this.state;

        return (
            <aside className={`filter-page ${isFilterOpen && 'visible'}`}>
                <form
                    className="filter-places-input-wrapper"
                    onSubmit={ (e) => e.preventDefault() }
                >
                    <input
                        className="filter-input"
                        type="text"
                        placeholder="Enter text to filter places"
                        value={query}
                        onChange={(event) => this.updateQuery(event.target.value)}
                    />
                    <button
                        className="clear-btn" aria-label="Clear filter" onClick={() => this.setState({query: ''})}>X</button>
                </form>
                {markerList.map(marker => {
                    marker.setVisible(false)

                    if (marker.title.toLowerCase().indexOf(query.toLocaleLowerCase()) !== -1) {
                        marker.setVisible(true)
                        return (
                            <div
                                key={marker.id}
                                className="location-btn-wrapper"
                            >
                                <button
                                    className="location-btn btn"
                                    onClick={() => {
                                        const GM = window.google.maps;
                                        marker.setAnimation(GM.Animation.BOUNCE);
                                        setTimeout(() => {
                                            marker.setAnimation(null);
                                        }, 1500);
                                        GM.event.trigger(marker, 'click')
                                    }}
                                >
                                    {marker.title}
                                </button>
                            </div>
                        )
                    }

                    return false
                })}

            </aside>
        )
    }
}

export default FilterPage;