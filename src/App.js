import Footer from "./components/Footer";
import Header from "./components/Header";
import Question from "./components/Question";
import MCQ4 from "./components/MCQ4";
import Splash from "./components/Splash";
import UserForm from "./components/UserForm";
import Coupon from "./components/Coupon";
import OtpInput from 'react18-otp-input';
import PageNotFound from "./components/PageNotFound";
import { useSelector, useDispatch } from "react-redux";
import { Fade, Slide } from "@mui/material";
import Rating from '@mui/material/Rating';
import { useState, useEffect } from "react";
import { decremented, incremented } from './store/store';
import { useNavigate, useParams } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import md5 from "md5";
import { useCookies } from 'react-cookie'
import BottomCoupon from "./components/BottomCoupon";
import './App.css';
import ComeBackLater from "./components/ComeBackLater";


let qAndA = [];
function App() {

    //.................... Normal JS ........................\\
    const [couponCooldown, SetCouponCooldown] = useState(false);
    const [dataLoaded, SetDataLoaded] = useState(false);
    const [fetchError, SetFetchError] = useState(false);
    const [questions, SetQuestions] = useState([]);
    const [apiResponse, SetApiResponse] = useState({});
    const [brandLogo, SetBrandLogo] = useState('');
    const [brandName, SetBrandName] = useState('');
    const [submitObj, SetSubmitObj] = useState({});
    const [userLogged, SetUserLoggedIn] = useState(0);
    const [userGender, SetUserGender] = useState(null);

    const [otpError, SetOtpError] = useState(false);
    const pageIndex = useSelector((state) => state.pageIndex);
    let progress = pageIndex * 100 / (questions.length + 1 - userLogged);
    const commonQuestion = 'Rate your overall experience'
    const [rating, setRating] = useState(0);
    // const [cookies, setCookie] = useCookies(['extraaUserID', 'couponLock']);
    const [otp, setOtp] = useState('');
    const [otpValid, SetOtpValid] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [disablePointer, setDisablePointer] = useState(false);


    let answers = [];
    let userData = {};
    const SALT = process.env.REACT_APP_MSG + "$$$" + process.env.REACT_APP_MSG2;
    // console.log(SALT);
    let params = useParams();
    let accessToken = md5(SALT + params.branch_id);

    let pathURL = process.env.REACT_APP_ENDPOINT;


    function responseToQuestion(apiResponse) {
        SetBrandLogo(encodeURI(apiResponse.parameters.retailer_logo));
        SetBrandName(apiResponse.parameters.retailer_name);
        let qs = [];
        apiResponse.parameters.questions.forEach(question => {
            let q = question.label;
            let type = question.question_type;
            let qOptions = []
            if (question.options) {
                question.options.forEach(option => {
                    qOptions.push(option.options);
                });
            } else if (question.question_type == "SCALE5") {
                for (let i = 1; i < 6; i++) {
                    qOptions.push(i);
                }
            }

            qs.push({ "label": q, "type": type, "options": qOptions });
        });
        if (qAndA == []) {
            for (let i = 0; i < apiResponse.parameters.questions.length; i++) {
                answers.push('');
                qAndA.push('');
            }
        }

        SetQuestions(qs);

    }

    let formData = new FormData();

    formData.append('branch_id', params.branch_id);
    formData.append('access_token', accessToken);

    useEffect(() => {
        // console.log(process.env.PUBLIC_URL);
        fetch(pathURL + '/getquestions/', {
            method: "POST",
            body: formData,

        })
            .then(data => {

                data.json().then(res => {
                    // console.log(res);
                    SetApiResponse(res);
                    responseToQuestion(res);
                    SetDataLoaded(true);
                    if (localStorage.getItem('extraaUserID')) {
                        localStorage.removeItem('extraaUserID');
                    }
                    if (localStorage.getItem('extraaUID')) {
                        SetUserLoggedIn(1);
                    }
                    // if (cookies.ExtraaUserID) {
                    //     // User already logged -----------------------
                    //     SetUserLoggedIn(1);

                    //     // console.log('User Id is ' + cookies.extraaUserID)
                    // }
                })


            })
            .catch(err => {
                // Catch and display errors
                console.log(err);
                SetFetchError(true);
            });
    }, []);



    function SetAnswer(ans, qIndex) {
        if (ans && qIndex) {
            // console.log(apiResponse);
            let qId = apiResponse.parameters.questions[qIndex - 1].question_id;
            let qType = apiResponse.parameters.questions[qIndex - 1].question_type;
            // console.log("question type: " + qType);
            // console.log("answer: " + ans-1);
            qAndA[qIndex - 1] =
            {
                "question_id": qId,
                "question_type": qType,
                "answer": [ans - 1]
            };
            answers[qIndex - 1] = ans - 1;
            // console.log(qAndA);
        }
    }





    async function setUserForm(name, num, age, gender) {
        userData.name = name;
        userData.number = num;
        userData.ageRange = age;

        let subObj = {
            "branch_id": params.branch_id,
            "access_token": accessToken,
            "common_question_answer": rating,
            "user_name": userData.name,
            "phone_number": userData.number,
            "email_id": null,
            "gender": gender,
            "pincode": "0",
            "age_range": userData.ageRange,
            "questions_and_ans": qAndA
        }
        SetSubmitObj(subObj);

        // console.log(subObj);

    }

    async function setUserData(name, num, age, gender) {
        let OtpFormData = new FormData();
        let OtpAccessToken = md5(SALT + num);
        // SetUserGender(gender);
        setUserForm(name, num, age, gender);
        OtpFormData.append('phone_number', num);
        OtpFormData.append('access_token', OtpAccessToken);
        OtpFormData.append('gender', gender);
        OtpFormData.append('user_name', name);
        OtpFormData.append('age_range', age);
        fetch(pathURL + '/check-login', {
            method: "POST",
            body: OtpFormData

        }).then(data => {

            data.json().then(res => {

            })
        }).catch(err => {
                console.log(err);
            });


        // console.log(OtpAccessToken);
        // fetch('https://api.genderize.io?name=' + name, {
        //     method: 'GET',
        // })
        //     .then((data) => {
        //         data.json()
        //             .then(res => {
        //                 let gender;
        //                 if(res.gender){
        //                      gender = res.gender.toUpperCase();
        //                 } else{
        //                     gender = null;
        //                 }


        //                 SetUserGender(gender);
        //                 setUserForm(name, num, age, gender);



        //                 OtpFormData.append('phone_number', num);
        //                 OtpFormData.append('access_token', OtpAccessToken);
        //                 OtpFormData.append('gender', gender);
        //                 OtpFormData.append('user_name', name);
        //                 OtpFormData.append('age_range', age);

        //                 fetch(pathURL + '/check-login', {
        //                     method: "POST",
        //                     body: OtpFormData

        //                 })
        //                     .then(data => {


        //                         data.json().then(res => {


        //                         })


        //                     })
        //                     .catch(err => {

        //                         console.log(err);
        //                     });

        //             })

        //     })

        //     .catch((error) => {
        //         console.error('Error:', error);
        //         const gender = null;

        //         SetUserGender(gender);
        //         setUserForm(name, num, age, gender);



        //         OtpFormData.append('phone_number', num);
        //         OtpFormData.append('access_token', OtpAccessToken);
        //         OtpFormData.append('gender', gender);
        //         OtpFormData.append('user_name', name);
        //         OtpFormData.append('age_range', age);

        //         fetch(pathURL + '/check-login', {
        //             method: "POST",
        //             body: OtpFormData

        //         })
        //             .then(data => {


        //                 data.json().then(res => {


        //                 })


        //             })
        //             .catch(err => {

        //                 console.log(err);
        //             });

        //     });






    }

    function SendOTP() {
        let num = submitObj.phone_number;

        let OtpFormData = new FormData();
        let OtpAccessToken = md5(SALT + num);
        console.log(SALT + num);
        OtpFormData.append('phone_number', num);
        OtpFormData.append('access_token', OtpAccessToken);

        fetch(pathURL + '/check-login', {
            method: "POST",
            body: OtpFormData,

        })
            .then(data => {

                // console.log(data.json());
                data.json().then(res => {
                    // console.log(res);

                })


            })
            .catch(err => {
                // Catch and display errors
                console.log(err);
            });
    }


    function CheckOTP(otp) {

        let OtpFormData = new FormData();
        let OtpAccessToken = md5(SALT + submitObj.phone_number + otp);

        OtpFormData.append('phone_number', submitObj.phone_number);
        OtpFormData.append('access_token', OtpAccessToken);
        OtpFormData.append('login_otp', otp);

        // console.log(submitObj.phone_number);
        fetch(pathURL + '/verify-otp', {
            method: "POST",
            body: OtpFormData,

        })
            .then(data => {

                // console.log(data.json());
                data.json().then(res => {
                    // console.log(res);
                    if (res.success == "true") {
                        let d = new Date();
                        d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
                        localStorage.setItem('extraaUID', res.parameters.id);
                        // setCookie('ExtraaUserID', res.parameters.id, { path: "/", expires: d });
                        increment();
                    } else {
                        SetOtpError(true);

                    }

                })


            })
            .catch(err => {
                // Catch and display errors
                console.log(err);
            });

    }



    function initSubmitObj(val) {
        let subObj = {
            "branch_id": params.branch_id,
            "access_token": accessToken,
            "common_question_answer": val,
            "user_id": localStorage.getItem('extraaUID'),
            "email_id": null,
            "pincode": "0",
            "questions_and_ans": qAndA
        }
        SetSubmitObj(subObj);
    }



    // --------------------React JS -------------------------------------------

    // console.log(cookies.extraaUserID);


    const decrement = () => {
        dispatch(decremented());
    }
    const increment = () => {
        dispatch(incremented());

        // console.log("Cookies set")
    }
    onpopstate = () => {
        decrement();
    };

    function handleOtpChange(val) {
        setOtp(val);
        SetOtpError(false);
        if (/^\d{4}$/.test(val)) {
            SetOtpValid(true);

        } else {
            SetOtpValid(false);
        }
    }



    return (
        <div className="App">
            {dataLoaded ?
                <div>
                    {/*------------------- Header------------------- */}
                    {pageIndex < questions.length + 3 - userLogged &&
                        <Header brand_name={brandName} logo={brandLogo}></Header>
                    }
                    {/* ----------------- Splash ----------------------- */}
                    {pageIndex == 0 && couponCooldown == false && <Splash></Splash>}
                    {couponCooldown && <ComeBackLater />}
                    {/* ---------------- Questions and Answers -------------------- */}
                    {pageIndex < questions.length + 1 && pageIndex > 0 &&
                        <Fade in>
                            <div>
                                <Question question={questions[pageIndex - 1].label}></Question>
                                <MCQ4 options={questions[pageIndex - 1].options} questionType={questions[pageIndex - 1].type} SetAnswer={SetAnswer}></MCQ4>
                            </div>
                        </Fade>
                    }
                    {/* ------------------------- Common Question -------------------------- */}
                    {pageIndex == questions.length + 1 &&
                        <div>
                            <Question question={commonQuestion}></Question>
                            <div className="fiveStar">
                                <Rating style={{ pointerEvents: disablePointer ? 'none' : 'auto' }}
                                    name="star-rating"
                                    size="large"
                                    value={rating}
                                    onChange={(event, newValue) => {
                                        if (newValue > 0) {
                                            initSubmitObj(newValue);
                                            setDisablePointer(true);
                                        }
                                        setRating(newValue);
                                        if (newValue > 0) {
                                            setTimeout(() => increment(), 600);
                                            setTimeout(() => setDisablePointer(false), 600);
                                        }
                                    }}
                                />
                            </div>
                            {userLogged > 0 &&
                                <BottomCoupon></BottomCoupon>
                            }
                        </div>
                    }
                    {/*---------------- User form ------------- */}
                    {pageIndex == questions.length + 2 && userLogged <= 0 &&

                        <Fade in>
                            <div>
                                <UserForm SetUserData={setUserData}></UserForm>
                                <BottomCoupon></BottomCoupon>
                            </div>
                        </Fade>
                    }
                    {/* ----------------------- OTP -------------------- */}
                    {pageIndex == questions.length + 3 && userLogged <= 0 &&

                        <Fade in>
                            <div className={otpError ? "otp-container wrong" : "otp-container"} >
                                <div className="otp-text">
                                    Please enter your OTP
                                </div>

                                <OtpInput
                                    inputStyle="inputStyle"
                                    numInputs={4}
                                    onChange={(value) => handleOtpChange(value)}
                                    isInputNum={true}
                                    shouldAutoFocus
                                    value={otp}

                                />
                                {otpError &&
                                    <p className="otpText"> OTP does not match!</p>
                                }

                                <Button disabled={!otpValid} onClick={() => CheckOTP(otp)} variant="contained">Verify</Button>
                                <Fade >
                                    <div className="otp-resend">
                                        <span>Didn't receive it?</span>
                                        <Button variant="text" onClick={() => SendOTP()}>Resend</Button>
                                    </div>
                                </Fade>
                            </div>
                        </Fade>
                    }
                    {/* ------------------------------- Coupon ------------------------------------ */}
                    {pageIndex == questions.length + 4 - userLogged * 2 &&
                        <Fade in>
                            <div className="coupon-screen">
                                <Coupon
                                    formData={submitObj}
                                />
                            </div>
                        </Fade>
                    }

                    {pageIndex < questions.length + 2 &&

                        <Footer progress={progress}
                            FooterContent={pageIndex < questions.length + 2 - userLogged && !couponCooldown}
                            Questions={questions.length + 2 - pageIndex - userLogged}
                            Counter={pageIndex > 0}
                        />
                    }
                </div>
                :
                <Fade in>
                    <div style={{ width: '100%', height: '90vh', display: "flex", justifyContent: "center", alignItems: "center" }}>

                        {fetchError ? <PageNotFound message='Oops.. Something went wrong' /> : <CircularProgress />}
                    </div>
                </Fade>

            }
        </div>
    );
}



export default App;


