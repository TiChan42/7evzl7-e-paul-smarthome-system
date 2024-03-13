import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

export default function MultiSelect({ Bezeichnung, groupOptions }) {
    return (
        <Select
            placeholder={`${Bezeichnung} auswählen`}            
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={[]}
            isMulti
            options={groupOptions}
        />
    );
}