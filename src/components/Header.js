import React, { Component } from 'react';

import FilterPage from './FilterPage';

class Header extends Component {

    state = {
        isFilterOpen: false,
        filterIndicateEnabled: false
    }

    // To indicate that filter has been applied when FilterPage is hidden
    changeFilterBtnState = (query) => {
        if (query && !this.state.filterIndicateEnabled) {
            this.setState({ filterIndicateEnabled: true })
        }
    }

    render() {
        const { isFilterOpen, filterIndicateEnabled: indicate } = this.state;
        const { markerList } = this.props;

        return (
            <header className="header">
                <button
                    className={`filter-btn btn filtered-${indicate}`}
                    onClick={() => this.setState({ isFilterOpen: !isFilterOpen, filterIndicateEnabled: false })}
                >
                    {isFilterOpen ? 'Hide filter' : 'Show filter'}
                    <span className={`filter-indicate-${indicate}`}>●</span>
                </button>

                <h1 className="header-title">Some interesting places in Moscow</h1>

                {<FilterPage
                    isFilterOpen={isFilterOpen}
                    markerList={markerList}
                    indication={this.changeFilterBtnState}
                />}

                {/* For shadow to be above FilterPage*/}
                <div className="header-shadow"></div>
            </header>
        );
    }
}

export default Header;