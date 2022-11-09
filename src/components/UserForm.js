import { TextField } from "@mui/material";
import { WhatsApp, AccountCircle, ChevronRightRounded } from "@mui/icons-material";
import InputAdornment from '@mui/material/InputAdornment'
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { incremented } from '../store/store';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { useState } from "react";

function UserForm(props) {
    const dispatch = useDispatch();
    const increment = () => {
        setTimeout(() => dispatch(incremented()), 600);
    }

    const [phNum, SetphNum] = useState('');
    const [userName, SetUserName] = useState('');
    const [ageGroup, SetAgeGroup] = useState(0);
    const [gender, SetGender] = useState('MALE');
    const handleChange = (event) => {
        SetphNum(event.target.value);
    }

    const handleNameChange = (event) => {
        SetUserName(event.target.value);
    }


    function handleSubmit(name, num, age, gender) {
        props.SetUserData(name, num, age, gender);
        increment();
    }

    return (
        <div className="user-details">

            <ValidatorForm
                onSubmit={() => handleSubmit(userName, phNum, ageGroup, gender)}

            >
                <TextValidator
                    label="Whatsapp Number*"
                    onChange={handleChange}
                    variant='filled'
                    name="phNum"
                    type="tel"
                    value={phNum}
                    validators={['required', 'isNumber', 'matchRegexp:^[0-9]{10}$']}
                    errorMessages={['This field is required', 'Please enter a vaild number', 'Please enter a vaild number']}
                    sx={{
                        backgroundColor: '#ffffff',
                        '& .MuiInputBase-root': {
                            backgroundColor: '#ffffff'
                        }
                    }} InputProps={{
                        inputMode: 'numeric', pattern: '[0-9]*',
                        startAdornment: (
                            <InputAdornment position="start">
                                <WhatsApp />
                            </InputAdornment>
                        ),
                    }} style={{ marginTop: '2em' }}
                />


                <TextField variant="filled" label="Name"
                    sx={{
                        backgroundColor: '#ffffff',
                        '& .MuiInputBase-root': {
                            backgroundColor: '#ffffff'
                        }
                    }}
                    InputProps={{
                        inputMode: 'numeric', pattern: '[0-9]*',
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        ),
                    }} style={{ marginTop: '1em' }}
                    value={userName}
                    onChange={handleNameChange}
                >

                </TextField>
                <div className="gender-container ">
                    Select your gender
                    <div className="gender-selector">
                        <div className="selecotr-item">
                            <input type="radio" id="male" name="gender"
                                className="selector-item_radio" defaultChecked={gender === 'MALE' ? true : false} />
                            <label onClick={() => SetGender('MALE')} htmlFor="male" className="selector-item_label gender-label">Male</label>
                        </div>
                        <div className="selecotr-item">
                            <input type="radio" id="female" name="gender"
                                className="selector-item_radio" />
                            <label onClick={() => SetGender('FEMALE')} htmlFor="female" className="selector-item_label gender-label">Female</label>
                        </div>
                    </div>
                </div>

                <div className="age-container ">
                    Select your age group
                    <div className="age-selector">
                        <div className="selecotr-item">
                            <input type="radio" id="age-1" name="selector"
                                className="selector-item_radio" defaultChecked={ageGroup === 0 ? true : false} />
                            <label onClick={() => SetAgeGroup(0)} htmlFor="age-1" className="selector-item_label">5-20</label>
                        </div>
                        <div className="selecotr-item">
                            <input type="radio" id="age-2" name="selector"
                                className="selector-item_radio" />
                            <label onClick={() => SetAgeGroup(1)} htmlFor="age-2" className="selector-item_label">21-40</label>
                        </div>
                        <div className="selecotr-item">
                            <input type="radio" id="age-3" name="selector"
                                className="selector-item_radio" />
                            <label onClick={() => SetAgeGroup(2)} htmlFor="age-3" className="selector-item_label">41-60</label>
                        </div>
                        <div className="selecotr-item">
                            <input type="radio" id="age-4" name="selector"
                                className="selector-item_radio" />
                            <label onClick={() => SetAgeGroup(3)} htmlFor="age-4" className="selector-item_label">60+</label>
                        </div>
                    </div>
                </div>

                <div className="terms">By submitting you agree to the <a rel="noreferrer" target="_blank" href="https://extraa.in/terms.html">Terms & Conditions & Privacy
                    Policy</a>
                </div>

                <Button type="submit" fullWidth variant='contained' endIcon={<ChevronRightRounded />}>Get Coupon</Button>
            </ValidatorForm>



        </div>
    );
}

export default UserForm;