import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Colors } from '../utility';

const ColorsArr = Object.keys(Colors).map(key => Colors[key]);

const CustomPieChart = ({ title, categoryData }) => {
  
  if (categoryData.length === 0) {
    return <h3 className='text-center mx-3'>{title} 还没有任何数据</h3>
  }

  return (
    <div className='pie-chart-component'>
      <h3 className='text-center mt-3'>{title}</h3>
      <ResponsiveContainer width={'100%'} height={300}>
        <PieChart>
          <Pie dataKey="value" isAnimationActive={false} data={categoryData} cx={'50%'} cy={'50%'} outerRadius={100} fill={Colors.blue} label>
          {
            categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={ColorsArr[index % ColorsArr.length]} />)
          }
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

CustomPieChart.propTypes = {
  title: PropTypes.string,
  categoryData: PropTypes.array
}

export default CustomPieChart;
