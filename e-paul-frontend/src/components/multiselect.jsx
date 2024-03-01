import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();
const groupOptions = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
]

export default function MultiSelect() {
    return (
        <Select
            placeholder='Geräte auswählen'
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={[groupOptions[4], groupOptions[5]]}
            isMulti
            options={groupOptions}
        />
    );
}