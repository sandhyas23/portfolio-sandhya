// The menu component
import React,{useState,useEffect} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from "@material-ui/core/MenuItem";
import Switch from "@material-ui/core/Switch";
import SocialMedia from "./SocialMedia";
import GridList from "@material-ui/core/GridList";
import Avatar from "@material-ui/core/Avatar";
import PropTypes from 'prop-types';


//Material ui styles
const useStyles = makeStyles((theme) => ({
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
        },
    },
    appBar: {
        borderBottom: `1px solid`,
        height:95,
        [theme.breakpoints.down('sm')]: {
            height: 200,
        },

    },
    smallAppBar:{
        borderBottom: `1px solid`,
        height:70,
        [theme.breakpoints.down('sm')]: {
            height: 200,
        },
    },

    toolbar: {
        flexWrap: 'wrap',
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
    heroContent: {
        padding: theme.spacing(8, 0, 6),
    },
    cardHeader: {
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
    },
    cardPricing: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginBottom: theme.spacing(2),
    },
}));


// Component MenuItems
const MenuItems = (props)=> {
    const classes = useStyles();

    //State
    const [menu, setMenu] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [state, setState] = useState({});
    const [user,setUser] = useState(null);


    //functions

    // similar to componentDidMount and componentDidUpdate
    useEffect(  () => {
        // call fetchdata() to fetch all initial data
        fetchData();

    },[]);

    // fetch all menu items from backend initially when component is mounted
    async function fetchData() {
        const response = await fetch('/menu',{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        const jsonData =  await response.json();
        console.log("data got in menu",jsonData.menu);
        setMenu(jsonData.menu);


    }

    // fetch loggin user details from backend , set state user and set admin in app component
    useEffect(  () => {
        //console.log("kjkjkjkjkjk");
        fetch('/login/secret',{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => response.json()).then(function(data) {
            console.log(data)
            if(data.success){
                let user = JSON.parse(data.User);
                console.log("this is what we got from secret"+data.User);
                //_this.setState({user: user, role:user.role});
                setUser(user[0]);
                props.handleUser(user[0].isAdmin,user[0]);

            }
        });

    },[]);

    //function to handle menu display change (true or false)
    const handleChange = (event) => {
        if(user === null){
            alert("Login to perform this action!")
        }
        else{
            const menuName = event.target.name;
            console.log(event.target.name,event.target.checked.toString())
            const menuToChangeIndex = menu.findIndex((element,index,array)=>{
                return element.menu === event.target.name;
            });
            menu[menuToChangeIndex].display = event.target.checked;
            setMenu(menu);
            setState({[event.target.name]:event.target.checked})

            console.log(" after change",menu);

            fetch('/menu/display/'+event.target.name,  {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({[menuName]:event.target.checked.toString()})
            }).then( (response)=> {
                response.json().then((data) => {
                    console.log(data);
                });
            })
        }
    };

    //function to set anchor state to open menu dialog
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // function to close menu
    const handleClose = () => {
        setAnchorEl(null);
    };


    //Render component
    return (
        <div>
            <AppBar position="fixed" color="default" elevation={0} className={props.isAdmin ? classes.appBar : classes.smallAppBar}>
                <Toolbar className={classes.toolbar}>
                    <GridList className={classes.toolbarTitle}>
                        <SocialMedia isAdmin={props.isAdmin}/>
                    </GridList>
                    {/*Menu nav items display*/}
                    <nav>
                        {menu.map((item,index,array)=>{
                            return item.display? <Link variant="button" name={item.menu} color="textPrimary"
                                                       data-testid={`visible${item.menu}`}
                                                       className={classes.link}
                                                       onClick={(e)=>props.handleNavItemClick(e)}
                                                       color={props.activeLink ===item.menu ? "secondary" :"primary"}
                                                       key={`visible${item.menu}`}>
                                {item.menu}
                            </Link>
                            : null
                        })}

                    </nav>
                    {/*Menu display items ends*/}

                    {/*FOR ADMIN control<------------------------>*/}
                    { props.isAdmin ?
                        <div>
                            <Button aria-haspopup="true" color="primary" variant="outlined"
                                    onClick={handleClick} className={classes.link}>
                                change menu
                            </Button>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >  {menu.map((element,index,array)=>{
                                return  <MenuItem  key={`menuDisplay${element.menu}${index}`}>
                                    {element.menu}
                                    <Switch
                                        checked={state[element.menu]|| element.display}
                                        onChange={handleChange}
                                        color="primary"
                                        name={element.menu}
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />

                                </MenuItem>

                            })}
                            </Menu>
                        </div>
                        :
                        null
                    }
                    {/*    Admin control end here ------------------------>*/}

                    {/*Login*/}
                    {user === null ?
                        <Button href={"http://www.sandhyasankaran.com/login/auth/google"} data-testid="login"
                                color="primary" variant="outlined" className={classes.link} style={{float:"right"}}>
                            login
                        </Button>
                        :
                        <Button data-testid={"logout-details"}>
                                <Avatar alt="Profile Picture" src={user.image} />

                            <Button href={"http://www.sandhyasankaran.com/login/logout"} data-testid="logout"
                                    color="primary" variant="outlined" className={classes.link} style={{float:"right"}}>
                                logout
                            </Button>
                        </Button>
                    }

                {/*    Login end*/}
                </Toolbar>
            </AppBar>

        </div>
    );
};

MenuItems.propTypes ={
    isAdmin: PropTypes.bool,
    activeLink: PropTypes.string,
    handleNavItemClick: PropTypes.func,
    handleUser:PropTypes.func

};
export default MenuItems

