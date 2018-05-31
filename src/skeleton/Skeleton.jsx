import React from 'react'
// import './style.css'
class Skeleton extends React.Component {
    tabs() {
        const tabs = []
        for (let i = 0; i < 7; i++) {
            tabs.push(
                <li className="skeleton-tabs-item" key={i}>
                    <span></span>
                </li>
            )
        }
        return tabs
    }
    productions() {
        const productions = []
        for (let i = 0; i < 5; i++) {
            productions.push(
                <div className="skeleton-productions" key={i}></div>
            )
        }
        return productions
    }
    render() {
        return (
            <div className="skeleton page">
                <div className="skeleton-nav"></div>
                <div className="skeleton-swiper"></div>
                <ul className="skeleton-tabs">
                    {this.tabs()}
                </ul>
                <div className="skeleton-banner"></div>
                {this.productions()}
            </div>
        )
    }
}

export default Skeleton