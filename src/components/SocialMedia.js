import React,{useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from '@fortawesome/free-brands-svg-icons';
import Button from "@material-ui/core/Button";
import Popover from '@material-ui/core/Popover';
import MenuItem from "@material-ui/core/MenuItem";
import Switch from "@material-ui/core/Switch/Switch";
import TextField from "@material-ui/core/TextField/TextField";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import PropTypes from "prop-types";
import Work from "./Work";
library.add(fab);

//Material ui styles
const useStyles = makeStyles((theme) => ({
    flexContainer : {
        display: 'flex',
        flexDirection: 'row',
        padding: 0,
    },
    form: {
        width: '75%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
        marginLeft:theme.spacing(5)
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },

}));



// Componenet social media
const SocialMedia =(props) =>{
    const classes = useStyles();

    //STATES
    const [socialMedia,setSocialMedia] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [state, setState] = useState({});
    const [editLink, setEditLink] = useState({});

    // similar to componentDidMount and componentDidUpdate
    useEffect(  () => {
        // call fetchdata() to fetch all initial data
        fetchData();

    },[]);

    //FUNCTIONS
    // fetch all banner items from backend initially when component is mounted
    async function fetchData() {
        const response = await fetch('/socialMedia',{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        const jsonData =  await response.json();
        //console.log("data got in social media",jsonData);
        //socialmedia
        setSocialMedia(jsonData.socialMedia);
    }

    //function to set anchor state to open social media dialog
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // function to close social media dialog
    const handleClose = () => {
        setAnchorEl(null);
        //setEditLink({[event.target.name]:false,link:event.target.value})

    };


    //function to set state for social media name with its link
    const handleEditClick = (socialMedia) =>{
        setEditLink({[socialMedia.iconName]:true,link:socialMedia.link});
    };

    //function to handle social media display change
    const handleChange = (event) => {
        let user = props.user;
        if(user === null){
            alert("Login to perform this action!")
        }
        else{
            const iconName = event.target.name;
            //console.log(event.target.name,event.target.checked.toString())
            const iconToChangeIndex = socialMedia.findIndex((element,index,array)=>{
                return element.iconName === event.target.name;
            });
            socialMedia[iconToChangeIndex].display = event.target.checked;
            setSocialMedia(socialMedia);
            setState({[event.target.name]:event.target.checked})

            //console.log(" after change",socialMedia);

            fetch('/socialMedia/display/'+event.target.name,  {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({[iconName]:event.target.checked.toString()})
            }).then( (response)=> {
                response.json().then((data) => {
                    //console.log(data);

                });
            })
        }

    };

    // function to set state for which social media link to edit
    const handleLink =(event)=>{
        setEditLink({[event.target.name]:true,link:event.target.value})
    };

    // function to save the link provided for a social media icon
    const handleSaveLink =(currentSocialMedia)=>{
        let user = props.user;
        if(user === null){
            alert("Login to perform this action!")
        }
        else{
            const iconToChangeIndex = socialMedia.findIndex((element,index,array)=>{
                return element.iconName === currentSocialMedia.iconName;
            });
            socialMedia[iconToChangeIndex].link = editLink["link"];
            setSocialMedia(socialMedia);
            //setState({[event.target.name]:event.target.checked})

            //console.log(" after change",socialMedia);

            fetch('/socialMedia/link/'+currentSocialMedia.iconName,  {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({[currentSocialMedia.iconName]:editLink["link"]})
            }).then( (response)=> {
                response.json().then((data) => {
                    //console.log(data);
                    setEditLink({[currentSocialMedia.iconName]:false,link:editLink["link"]});

                });
            })
        }

    };

    // function handle the click of cancel button while editing a social media link
    const handleCancel =(event) =>{
        setEditLink({[event.target.name]:false,link:event.target.value});
    };

    // Render component
    return(
        <div>
        {/*    display all the socisl media that has display true*/}
        <List position="fixed" className={classes.flexContainer}>
            {socialMedia.map((element,index,array)=>{
                return element.display ?
                    <ListItem key={`listItem${element.iconName}`}>
                        <a href={element.link} target="_blank">
                            <FontAwesomeIcon icon= {["fab",`${element.iconName.toLowerCase()}`]}
                                             size="2x"
                                             color={element.iconName ==="pinterest" || element.iconName === "youTube"
                                                 ? "red"
                                                 :
                                                 element.iconName === "gitHub" ? "black" :"steelblue"}/>
                        </a>
                    </ListItem> :
                    null
            })}
        </List>
            {/*FOR ADMIN control, display change social media button*/}
            { props.isAdmin ?
                <div>
                    <Button aria-haspopup="true" color="primary" variant="outlined"
                            onClick={handleClick} className={classes.link}>
                        change social media display!
                    </Button>
                    {/* dialog to change display and link of a social media icon*/}
                    <Popover
                        id="simple-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >  {socialMedia.map((element,index,array)=>{
                        return  <MenuItem  key={`socialMedia${element.iconName}${index}`}>
                            <Grid container spacing={10}>
                                {/*display of social media icons*/}
                                <Grid item xs={2} sm={2} md={2}>
                                    {element.iconName}
                                </Grid>
                                {/*change social media display (true or false)*/}
                                <Grid item xs={1} sm={1} md={1}>
                                    <Switch
                                        checked={state[element.iconName]|| element.display}
                                        onChange={handleChange}
                                        color="primary"
                                        name={element.iconName}
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />
                                </Grid>
                                {/*display of social media url links*/}
                                <Grid item xs={6} sm={6} md={6}>
                                    {editLink[element.iconName]?
                                        <div>
                                            <TextField
                                                margin="normal"
                                                fullWidth
                                                name={element.iconName}
                                                value={editLink["link"]}
                                                id="link"
                                                autoComplete="message"
                                                onChange={handleLink}
                                            />
                                            <Link href="#" color="primary"
                                                    className={classes.link} onClick={()=>handleSaveLink(element)}>
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
                                                {element.link}
                                            </Typography>
                                            <Link href="#" color="primary"
                                                    className={classes.link} onClick={()=>handleEditClick(element)}>
                                                edit link
                                            </Link>
                                        </div>

                                    }
                                </Grid>

                            </Grid>
                        </MenuItem>

                    })}
                    </Popover>
                </div>
                :
                null
            }
        </div>

    );
};

SocialMedia.propTypes ={
    isAdmin: PropTypes.bool,
    user:PropTypes.object

};

export default SocialMedia