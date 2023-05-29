import React from 'react';
import { List } from 'antd';

import FoodEntry from './FoodEntry';

const Foods = (props) => {

    return (
        <List
            size="large"
            pagination={{
                onChange: page => {
                    // console.log(page);
                },
                pageSize: 10,
            }}
            dataSource={props.data}
            style={{ minHeight: '800px' }}
            renderItem={item => {
                return (
                    <FoodEntry id={item[0]} meal={item[1]} date={item[2]}
                        isAuthenticated={props.isAuthenticated} />
                );
            }}
        />
    )
}

export default Foods;