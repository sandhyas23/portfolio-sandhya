import React,{useState,useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Switch from "@material-ui/core/Switch/Switch";
import TextField from "@material-ui/core/TextField/TextField";
import {SketchPicker} from "react-color";
import Popover from "@material-ui/core/Popover/Popover";
import PropTypes from "prop-types";
import Work from "./Work";



//Copyright information
function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                sandhyasankaran.com
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

//Material ui styles
const useStyles = makeStyles((theme) => ({
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
        },
    },

    footer: {
        borderTop: `1px solid`,
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
        marginTop: 100,
        paddingTop: 3,
        paddingBottom: 3,
        [theme.breakpoints.up('sm')]: {
            paddingTop: theme.spacing(6),
            paddingBottom: theme.spacing(6),
        },
    },
    link: {
        margin: theme.spacing(1, 1)
    },
     popover : {
        position: 'absolute',
        zIndex: '2',
         top: 500,
         right: 10,
         bottom: '0px'
    }
}));



//Component Footer
const FooterDisplay =(props) =>{
    const classes = useStyles();

    //styles
    //footer
    const [footer,setFooter] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [state, setState] = useState({});
    const [editValue, setEditValue] = useState({});
    //bgColor
    const [viewColor, setViewColor] = useState(null);
    const [bgColor, setBgColor]  = useState('#e6e6e6');
    const [baseColor,setBaseColor] = useState(bgColor); // for cancel button to restore previous value
    //text color
    const [textColor,setTextColor] = useState('black');
    const [message,setMessage] =useState("");

    // similar to componentDidMount and componentDidUpdate
    useEffect(  () => {
        // call fetchdata() to fetch all initial data
        fetchFooterData();
        fetchColorData();

    },[]);

    // fetch all footer items from backend initially when component is mounted
    async function fetchFooterData() {
        const response = await fetch('/footer',{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        const jsonData =  await response.json();
        //console.log("data got in footer",jsonData);
        //footer
        setFooter(jsonData.footer);
    }

    // fetch all bgcolor and textcolor from backend initially when component is mounted
    async function fetchColorData() {
        const response = await fetch('/footer/color',{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        const jsonData =  await response.json();
        console.log("data got in color",jsonData);
        //footer
        setBgColor(jsonData.bgColor);
        setBaseColor(jsonData.bgColor);
        setTextColor(jsonData.textColor);
    }

    //function to handle footer display change
    const handleChange = (event) => {
        let user = props.user;
        if(user === null){
            alert("Login to perform this action!")
        }
        else{
            const footerName = event.target.name;
            // console.log(event.target.name,event.target.checked.toString())
            const footerToChangeIndex = footer.findIndex((element,index,array)=>{
                return element.footerName === event.target.name;
            });
            footer[footerToChangeIndex].display = event.target.checked;
            setFooter(footer);
            setState({[event.target.name]:event.target.checked});

            //console.log(" after change",footer);

            fetch('/footer/display/'+event.target.name,  {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({[footerName]:event.target.checked.toString()})
            }).then( (response)=> {
                response.json().then((data) => {
                    //console.log(data);

                });
            })
        }

    };

    //function to set anchor state to open menu dialog
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // function to close menu
    const handleClose =  ()=> {
        setAnchorEl(null);
    };

    //set display of text area for each footer name
    const handleEditValue=(footer) =>{
        setEditValue({[footer.footerName]:true,value:footer.value});
        //setEditValue({[footer.footerName]:true,value:footer.value});
    };

    //Edit value for each footer name
    const handleText = (event)=>{
        setEditValue({[event.target.name]:true,value:event.target.value});
    };

    //cancel edit footer value
    const handleCancel = (event)=>{
        setEditValue({[event.target.name]:false,value:event.target.value});
    };

    //save footer value
    const handleSave =(footerDetails)=>{
        let user = props.user;
        if(user === null){
            alert("Login to perform this action!")
        }
        else{
            const footerToChangeIndex = footer.findIndex((element,index,array)=>{
                return element.footerName === footerDetails.footerName;
            });
            footer[footerToChangeIndex].value = editValue["value"];
            setFooter(footer);
            //setState({[event.target.name]:event.target.checked});

            fetch('/footer/value/'+footerDetails.footerName,  {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({[footerDetails.footerName]:editValue["value"]})
            }).then( (response)=> {
                response.json().then((data) => {
                    console.log(data);
                    //setBaseState(data.tagLine)
                    //setEditValue({[footerDetails.footerName]:false,value:editValue["value"]});
                    setEditValue({[data.footer.footerName]:false,value:data.footer.value});


                });
            })
        }

    };

    //Background color functions
    const handleColor =(event) =>{
        setViewColor(event.currentTarget);
    };

    const handleChangeComplete = (color) =>{
        //console.log("color",color);
        setBgColor(color.hex);
    };

    const handleCancelBackground = ()=>{
        setBgColor(baseColor);
        setViewColor(null);
    };

    const handleSaveBackground =()=>{
        let user = props.user;
        if(user === null){
            alert("Login to perform this action!")
        }
        else{
            fetch('/footer/bgColor',  {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({bgColor:bgColor})
            }).then( (response)=> {
                response.json().then((data) => {
                    if(data.success){
                        setBgColor(data.bgColor);
                    }
                    setViewColor(null);
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
            fetch('/footer/textColor',  {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({textColor:textColor === "black"? "white" :"black"})
            }).then( (response)=> {
                response.json().then((data) => {
                    if(data.success){
                        setTextColor(data.textColor);
                    }
                    setMessage(data.message);
                    alert(data.message);
                });
            })
        }


    };

    // render component
    return (
        <Container maxWidth="xl" component="footer" className={classes.footer} style={{backgroundColor: bgColor}}>
            <Grid container spacing={5} justify="space-evenly">
                {footer.map((element,index,array) => {
                    return element.display
                        ? <Grid item xs={3} sm={3} key={`grid${element.footerName}`}>
                        <Typography variant="h6"  gutterBottom key={`title${element.footerName}`}
                                     style={{color:textColor}}>
                            {element.footerName.charAt(0).toUpperCase()+element.footerName.slice(1)}
                        </Typography>
                        <ul key={`ul${element.footerName}`}>
                            <li key={`li${element.footerName}`}>
                                    <Typography color="textSecondary" gutterBottom key={`value${element.footerName}`}
                                                style={{color:textColor === "black" ? "grey" :textColor}}>
                                        {element.value}
                                    </Typography>

                            </li>
                        </ul>
                    </Grid>
                        :
                        null
                    })}

                {/*FOR ADMIN control<------------------------>*/}
                { props.isAdmin ?
                    <div>
                        <div>
                            <Button aria-controls="simple-menu" aria-haspopup="true" color="primary"
                                    variant="outlined"
                                    onClick={handleClick} className={classes.link}>
                                change footer here!
                            </Button>
                            <Button href="#" color="primary" variant="outlined"
                                    className={classes.link} onClick={handleColor}>
                                choose background
                            </Button>
                            <Button href="#" color="primary" variant="outlined"
                                    className={classes.link} onClick={handleTextColor}>
                                change text color to white/black
                            </Button>
                        </div>

                        {/*Change footer text values dialog*/}
                        <Popover
                            id="footer"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            anchorReference="anchorPosition"
                            anchorPosition={{ top: 600, left: 200 }}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >  {footer.map((element,index,array)=>{
                            return  <MenuItem  key={`footerName${element.footerName}${index}`}>
                                <Grid container spacing={9}>
                                    <Grid item xs={2} sm={2} md={2}>
                                        {element.footerName}
                                    </Grid>
                                    <Grid item xs={1} sm={1} md={1}>
                                        <Switch
                                        checked={state[element.footerName]|| element.display}
                                        onChange={handleChange}
                                        color="primary"
                                        name={element.footerName}
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={6}>
                                        {editValue[element.footerName]?
                                            <div>
                                                <TextField
                                                    margin="normal"
                                                    fullWidth
                                                    name={element.footerName}
                                                    value={editValue["value"]}
                                                    id="editValue"
                                                    autoComplete="message"
                                                    onChange={handleText}
                                                />
                                                <Link href="#" color="primary"
                                                      className={classes.link} onClick={() =>handleSave(element)}>
                                                    save
                                                </Link>
                                                <Link href="#" color="primary"
                                                      className={classes.link} onClick={handleCancel}>
                                                    cancel
                                                </Link>
                                            </div>

                                            :
                                            <div>
                                                <Typography component="span"  align={"left"} gutterBottom >
                                                    {element.value}
                                                </Typography>
                                                <Link href="#" color="primary"
                                                      className={classes.link} onClick={()=>handleEditValue(element)}>
                                                    edit value
                                                </Link>
                                            </div>


                                        }

                                    </Grid>

                                </Grid>

                            </MenuItem>

                        })}
                        </Popover>
                            {/*Change background color for  footer*/}
                            <Popover
                                id="backgorundColor"
                                anchorEl={viewColor}
                                open={Boolean(viewColor)}
                                onClose={handleCancelBackground}
                                anchorReference="anchorPosition"
                                anchorPosition={{ top: 950, left: 600 }}
                            >
                            <SketchPicker
                                className={classes.sketch}
                                color={bgColor}
                                onChangeComplete={handleChangeComplete }/>
                                <Button href="#" color="primary" variant="outlined"
                                        className={classes.link}
                                        onClick={handleSaveBackground}>
                                    save
                                </Button>
                            </Popover>

                    </div>
                    :
                    null
                }
                {/*    Admin control end here ------------------------>*/}

            </Grid>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>

    );
};

FooterDisplay.propTypes ={
    isAdmin: PropTypes.bool,
    user:PropTypes.object

};

export default FooterDisplay

