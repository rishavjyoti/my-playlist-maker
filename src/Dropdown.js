import React from 'react'

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const Dropdown = (props) => {

    const dropdownChanged = e => {
        props.changed(e.target.value);
    }  

    return(
        <div>
            <FormControl gutterbottom>
            <InputLabel>Genre</InputLabel>
                <Select value={props.selectedValue} onChange={dropdownChanged}>
                    {props.options.map((item, idx) => 
                        <MenuItem key={idx} value={item.id}>
                            {item.name}
                        </MenuItem>)
                    }
                </Select>
            </FormControl>
        </div>
    );
}

export default Dropdown;
