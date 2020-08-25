// The Banner component - Title and tagline of owner with photo
import React, {useEffect, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { deepPurple } from '@material-ui/core/colors';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField/TextField";
import { SketchPicker } from 'react-color';
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Dialog from "@material-ui/core/Dialog/Dialog";
import PropTypes from "prop-types";
import Work from "./Work";

//Material ui styles
const useStyles = makeStyles((theme) => ({
    heroContent: {
        width:'100%',
        padding: theme.spacing(8, 0, 6),
        marginTop:95,
        [theme.breakpoints.down('sm')]: {
            marginTop: 200,
            fontSize:'20%'

        },
    },
    large: {
        width: theme.spacing(10),
        height: theme.spacing(10),
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: "purple",
        [theme.breakpoints.down('sm')]: {
            width: theme.spacing(5),
            height: theme.spacing(5),

        },
    },
    noAdminBanner: {
        width:'100%',
        padding: theme.spacing(8, 0, 6),
        marginTop:70,
        [theme.breakpoints.down('sm')]: {
            marginTop: 200,
            fontSize:'20%'

        },
    },
    form: {
        width: '75%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
        marginLeft:theme.spacing(5)
    },
    link: {
        margin: theme.spacing(1, 1),
        [theme.breakpoints.down('sm')]: {
           fontSize:'7px'

        },

    },
    sketch:{
        marginLeft: 25
    },
    text:{
        [theme.breakpoints.down('sm')]: {
            fontSize:'small'

        },
    },
    title: {
        [theme.breakpoints.down('sm')]: {
            fontSize: 'large'

        },
    },
    formControl: {
        margin: theme.spacing(3),
        minWidth: 120,
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        }
    },
}));

// Component Banner
const Banner =(props)=>{
    const classes = useStyles();

    //States
    const ownerName = "Sandhya Sankaran";
    //tagline
    const [tagLine,setTagLine] = useState("");
    const [baseState,setBaseState] = useState(tagLine); // for cancel button to restore previous value
    const [viewTextArea, setViewTextArea] = useState(false);
    //image
    const [imageFile,setImageFile] = useState(null);
    const [viewUploadedImage,setViewUploadedImage] = useState(false);
    //bgColor
    const [viewColor, setViewColor] = useState(false);
    const [bgColor, setBgColor]  = useState('#e6e6e6');
    const [baseColor,setBaseColor] = useState(bgColor); // for cancel button to restore previous value
    //text color
    const [textColor,setTextColor] = useState('black');
    const [message,setMessage] = useState("");



    // similar to componentDidMount and componentDidUpdate
    useEffect(  () => {
        // call fetchdata() to fetch all initial data
        fetchData();

    },[]);

    // fetch all banner items from backend initially when component is mounted
    async function fetchData() {
        const response = await fetch('/banner',{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        const jsonData =  await response.json();
        //console.log("data got in banner",jsonData);
        //Tagline
        setTagLine(jsonData.tagLine);
        setBaseState(jsonData.tagLine);
        //image
        setViewUploadedImage(jsonData.image);
        //bgColor
        setBgColor(jsonData.bgColor);
        setBaseColor(jsonData.bgColor);
        //textcolor
        setTextColor(jsonData.textColor);


    }

    // TagLine functions
    const handleEditTagLine = () => {
        setViewTextArea(true);
    };

    const handleCancel = () =>{
        setTagLine(baseState);
        setViewTextArea(false);
    };

    const handleChange = (event)=>{
        setTagLine(event.target.value);
    };

    const handleSave = () =>{
        let user = props.user;
        if(user === null){
            alert("Login to perform this action!")
        }
        else{
            fetch('/banner',  {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({tagLine:tagLine})
            }).then( (response)=> {
                response.json().then((data) => {
                    if(data.success){
                        setTagLine(data.tagLine);
                    }
                    //console.log(data);
                    //setBaseState(data.tagLine)
                    //setViewTextArea(false);
                    setMessage(data.message);

                });
            })
        }

    };

    // Image functions
    const handleImageUpload = (event)=>{
        let user = props.user;
        if(user === null){
            alert("Login to perform this action!")
        }
        else{
            setImageFile(event.target.files[0]);
            const formData = new FormData();
            formData.append('myImage', event.target.files[0]);
            fetch(`/banner/upload`,{
                method: 'POST',
                // headers:{
                //     'Content-type': 'multipart/form-data'
                // },
                body: formData
            }).then( response => response.json()).then(data => {
                if(!data.success){
                    alert(data.message);
                }
                else{
                    handleDefaultImage("true");
                }
            });
        }

    };


    const handleDefaultImage =(booleanString)=>{
        let user = props.user;
        if(user === null){
            alert("Login to perform this action!")
        }
        else{
            fetch('/banner/image',  {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({image:booleanString})
            }).then( (response)=> {
                response.json().then((data) => {
                    console.log(data);
                    //alert("image changed");
                    setViewUploadedImage(data.image);
                    if(booleanString === "false"){
                        setMessage("Image changed to default pic");
                    }
                    else{
                        setMessage("Image changed!");
                    }

                });
            })
        }
        //setImageFile(null);
    };

    //Background color functions
    const handleColor =() =>{
        setViewColor(!viewColor);
    };

    const handleChangeComplete = (color) =>{
        //console.log("color",color);
        setBgColor(color.hex);
    };

    const handleCancelBackground = ()=>{
        setBgColor(baseColor);
        setViewColor(!viewColor);
    };

    const handleSaveBackground =()=>{
        let user = props.user;
        if(user === null){
            alert("Login to perform this action!")
        }
        else{
            fetch('/banner/bgColor',  {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({bgColor:bgColor})
            }).then( (response)=> {
                response.json().then((data) => {
                    //console.log(data);
                    setBgColor(data.bgColor);
                    setViewColor(false);

                });
            })
        }

    };

    //Text color functions
    const handleTextColor =() =>{
        let user = props.user;
        if(user === null){
            alert("Login to perform this action!")
        }
        else{
            textColor === "black" ? setTextColor("white") : setTextColor("black");
            fetch('/banner/textColor',  {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({textColor:textColor === "black"? "white" :"black"})
            }).then( (response)=> {
                response.json().then((data) => {
                    //console.log(data);
                    setTextColor(data.textColor);
                });
            })
        }
    };



// render component
    return(
        <Container maxWidth="xl" className={props.isAdmin? classes.heroContent : classes.noAdminBanner}
                   style={{backgroundColor: bgColor}}>
            <Grid container spacing={4}>
                <Grid item xs={7} sm={7} md={9}>
                    <Typography component="h1" variant="h2" align="center"  gutterBottom style={{color:textColor}}
                                className={classes.title}>
                        {props.title === "home"? "Sandhya Sankaran" : props.title.charAt(0).toUpperCase()+props.title.slice(1)}
                    </Typography>
                    <div>

                            <Typography variant="h5" align="center" paragraph className={classes.text}
                                        style={{color:textColor === "black" ? "grey" :textColor,marginLeft:25}}>
                                {tagLine}
                            </Typography>


                        {/*ADMIN controls --------------->*/}

                        { props.isAdmin ?
                                    <div>
                                        {!viewColor ?
                                            <div>
                                                <Button href="#" color="primary" variant="outlined"
                                                        className={classes.link} onClick={handleEditTagLine}>
                                                    edit data and image
                                                </Button>
                                                <Button href="#" color="primary" variant="outlined"
                                                        className={classes.link} onClick={handleColor}>
                                                    choose background
                                                </Button>
                                                <Button href="#" color="primary" variant="outlined"
                                                        className={classes.link} onClick={handleTextColor}>
                                                    Change text color to white/black
                                                </Button>
                                            </div> :
                                            <div>
                                                <Button href="#" color="primary" variant="outlined"
                                                        className={classes.link} onClick={handleCancelBackground}>
                                                    cancel
                                                </Button>
                                                <Button href="#" color="primary" variant="outlined"
                                                        className={classes.link}
                                                        onClick={handleSaveBackground}>
                                                    save
                                                </Button>
                                            </div>
                                        }
                                    </div>

                            :
                            null
                        }

                        {/*end of admin control ------------>*/}
                    </div>
                    { viewColor ?
                        <SketchPicker
                            className={classes.sketch}
                            color={bgColor}
                            onChangeComplete={handleChangeComplete }/>
                        :
                        null
                    }
                </Grid>

                <Grid item xs={5} sm={5} md={3}>
                    {viewUploadedImage ?
                        <Avatar alt="SS" className={classes.large } src="http://www.sandhyasankaran.com/static/media/bannerImage.jpg" />
                        :
                        <Avatar alt="SS" className={classes.large }>
                            {ownerName.split(" ")[0][0].toUpperCase()+
                            ownerName.split(" ")[1][0].toUpperCase()}
                        </Avatar>

                    }


                {/*    ADMIN CONTROL*/}
                    {props.isAdmin ?
                        <Dialog open={viewTextArea} onClose={handleCancel} >
                            <DialogTitle id="simple-dialog-title">
                                Edit Banner details
                            </DialogTitle>
                                    <div>
                                        <form className={classes.formControl} noValidate autoComplete="off">
                                            <div>
                                                <TextField
                                                    margin="normal"
                                                    fullWidth
                                                    name="tagLine"
                                                    value={tagLine}
                                                    id="tagLine"
                                                    autoComplete="message"
                                                    multiline
                                                    rows={2}
                                                    rowsMax={4}
                                                    onChange={handleChange}
                                                />

                                                <InputLabel style={{paddingTop: 5}}>Choose image for banner</InputLabel>
                                                <input type={"file"} accept="image/*" name={"imageFile"} className={classes.link}
                                                       onChange={handleImageUpload}/>
                                                {viewUploadedImage ?
                                                    <Button href="#" color="primary" variant="outlined"
                                                            className={classes.link} onClick={()=>handleDefaultImage("false")}>
                                                        use default image
                                                    </Button>
                                                :
                                                null
                                                }


                                            </div>
                                            <Button color="primary" variant="outlined" className={classes.link}
                                                    onClick={handleSave}
                                                    disabled={tagLine.length < 1 || tagLine === baseState}>
                                                save
                                            </Button>
                                        </form>

                                        <Typography align="center" gutterBottom color={"secondary"}>
                                            {message}
                                        </Typography>
                                    </div>

                        </Dialog>

                        :
                        null
                    }
                {/*End of admin control*/}
                </Grid>
            </Grid>
        </Container>
    );
};

Banner.propTypes ={
    isAdmin: PropTypes.bool,
    user:PropTypes.object

};

export default Banner;
