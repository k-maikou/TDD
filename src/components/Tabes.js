import React from 'react';
import PropType from 'prop-types';

export class Tabes extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activeIndex: props.activeIndex
    }
  }

  tabChange = (event, index) => {
    event.preventDefault();
    this.setState({
      activeIndex: index
    })
    this.props.onTabChange(index)
  }

  render() {
    const { children } = this.props;
    const { activeIndex } = this.state;
    return(
      <ul className='nav nav-tabs nav-fill my-4'>
        { React.Children.map(children, (child, index) => {
          const activeClassName = (activeIndex === index) ? 'nav-link active' : 'nav-link';
          return (
            <li className="nav-item">
              <a 
                href="#" 
                className={activeClassName}
                onClick={(event) => { this.tabChange(event, index) }}
              >
                { child }
              </a>
            </li>
          )
        }) }
      </ul>
    )
  }
}

Tabes.propType = {
  activeIndex: PropType.number.isRequired,
  onTabChange: PropType.func.isRequired
}

export const Tab = ({ children }) => {
  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  )
}
