import React, { Component } from 'react';
import Ionicon from 'react-ionicons';
import PropTypes from 'prop-types';

class CategorySelect extends Component {

  constructor(props) {
    super(props)
  }

  selectCategory = (e, categoryItem) => {
    this.props.onSelectCategory(categoryItem)
    e.preventDefault();
  }

  render() {
    const { category, selectedCategory } = this.props;
    const selectedCategoryId = selectedCategory && selectedCategory.id

    return (
      <div className='category-select-component'>
        <div className='row text-center'>
          {
            category.map((item, index) => {
              const iconColor = (item.id === selectedCategoryId ? '#fff' : '#555')
              const backColor = (item.id === selectedCategoryId ? '#347eff' : '#efefef')
              const activeClassName = (selectedCategoryId === item.id) ?
              'category-item col-3 active' :
              'category-item col-3'
              return(
                <div 
                  className={activeClassName}
                  key={index}
                  onClick={(e) => { this.selectCategory(e, item) }}
                >
                  <Ionicon
                    className='rounded-circle'
                    fontSize='50px'
                    color={iconColor}
                    style={{background: backColor, padding: '5px'}}
                    icon={item.iconName}
                  />
                  <p>{ item.name }</p>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

CategorySelect.propTypes = {
  
}
export default CategorySelect;