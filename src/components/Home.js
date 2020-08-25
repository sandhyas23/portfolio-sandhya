import React,{useState,useEffect} from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField/TextField";
import PropTypes from "prop-types";


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    main: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(2),
    },
    text:{
        [theme.breakpoints.down('sm')]: {
            fontSize:'medium'

        },
    },
    title: {
        [theme.breakpoints.down('sm')]: {
            fontSize: 'large',
            fontWeight:'bold'

        },
    }
}));

const Home=(props)=>{
    const classes = useStyles();
    const [aboutMe,setAboutMe] = useState("");
    const [baseState,setBaseState] = useState(aboutMe); // for cancel button to restore previous value
    const [viewTextArea, setViewTextArea] = useState(false);


    // similar to componentDidMount and componentDidUpdate
    useEffect(  () => {
        // call fetchdata() to fetch all initial data
        fetchData();

    },[]);

    // fetch all aboutME items from backend initially when component is mounted
    async function fetchData() {
        const response = await fetch('/home',{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        const jsonData =  await response.json();
        console.log("data got in home",jsonData);
        //about me
        setAboutMe(jsonData.aboutMe);
        setBaseState(jsonData.aboutMe);


    }

    const handleChange=(event)=>{
        setAboutMe(event.target.value)
    };

    const handleEditAboutMe =()=>{
        setViewTextArea(true);
    };

    const handleCancel =()=>{
        setAboutMe(baseState);
        setViewTextArea(false);
    };

    const handleSave =()=>{
        let user = props.user;
        if(user === null){
            alert("Login to perform this action!")
        }
        else{
            fetch('/home',  {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({aboutMe:aboutMe})
            }).then( (response)=> {
                response.json().then((data) => {
                    //console.log(data);
                    //setBaseState(data.tagLine)
                    setViewTextArea(false);
                });
            })
        }
    };


    return (
        <div>
            <Typography variant="h2" component="h1" gutterBottom className={classes.title}>
                About Me
            </Typography>
            {viewTextArea ?
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="aboutMe"
                        value={aboutMe}
                        id="tagLine"
                        autoComplete="message"
                        multiline
                        rows={2}
                        rowsMax={4}
                        onChange={handleChange}
                    />
                </form> :
                <Typography variant="h5" component="h2" gutterBottom className={classes.text}>
                    {aboutMe}
                </Typography>
            }

            {/*Admin control*/}
            {props.isAdmin
                ?
                !viewTextArea
                    ?
                <Button href="#" color="primary" variant="outlined"
                        className={classes.link} onClick={handleEditAboutMe}>
                    edit about me
                </Button>
                    :
                    <div>
                        <Button href="#" color="primary" variant="outlined"
                                className={classes.link} onClick={handleCancel}>
                            cancel
                        </Button>
                        <Button href="#" color="primary" variant="outlined" className={classes.link}
                                onClick={handleSave}>
                            save
                        </Button>
                    </div>
                :
                null
            }

        {/*    End of Admin control*/}
        </div>
    );
};

Home.propTypes ={
    isAdmin: PropTypes.bool,
    user:PropTypes.object

};

export default Home
