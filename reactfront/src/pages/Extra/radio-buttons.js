import React from 'react';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

class FormControlLabelPosition extends React.Component {
  state = {
    value: 'female'
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

 
render() {
    return <FormControl component="fieldset">
      <RadioGroup name="user-type" value={this.value} onChange={this.handleChange} row={true}>
        <FormControlLabel value="job-seeker" control={<Radio />} label="I am looking for a job" />
        <FormControlLabel value="company" control={<Radio />} label="I am looking for employees" />
      </RadioGroup>
    </FormControl>;
  }
}

export default FormControlLabelPosition;

