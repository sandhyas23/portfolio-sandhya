//Main App file
import React, {useState, useCallback} from 'react';
import MenuItems from './components/MenuItems'
import FooterDisplay from './components/FooterDisplay'
import Banner from './components/Banner'
import CssBaseline from '@material-ui/core/CssBaseline';
import Home from './components/Home'
import {makeStyles} from "@material-ui/core";
import Blog from "./components/Blog";
import Work from "./components/Work";
import Contact from "./components/Contact";
import Container from "@material-ui/core/Container";


//Material UI styles
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
}));


 const App = () => {
     const classes = useStyles();
     //state
    const [title, setTitle] = useState("Sandhya Sankaran");
    const[isAdmin,setAdmin] = useState(false);
    const [user,setUser] = useState(null);
     const [activeLink,setActiveLink] = useState("home");

     //functions
     // similar to componentDidMount and componentDidUpdate


    //function to set title ad active link from menuItems component
    const handleNavItemClick = useCallback(
        (event) => {
            console.log("menu clicked" ,event.target.name );
            setTitle(event.target.name);
            setActiveLink(event.target.name);
        },
        []
    );

     //function to set admin from menuItems component
     const handleUser = useCallback(
         (boolean,user) => {
             //console.log("menu clicked" ,event.target.name );
             setAdmin(boolean);
             setUser(user);
         },
         []
     );

   // Render component
    return(
        <div>
            <CssBaseline />
            {/*The menu nav header display*/}
            <MenuItems handleNavItemClick={handleNavItemClick} isAdmin={isAdmin} activeLink={activeLink} user={user}
                        handleUser={handleUser}/>
            <div className={classes.root}>
                {/*The banner display -title and tagline with photo*/}
                <Banner title={title} isAdmin={isAdmin} user={user}/>
                <Container component="main" className={classes.main} maxWidth="md">
                            {
                                title === "home" || title === "Sandhya Sankaran" ? <Home isAdmin={isAdmin} user={user}/> :
                                    title === "work" ? <Work isAdmin={isAdmin} user={user}/> :
                                        title === "contact" ? <Contact isAdmin={isAdmin}/> :
                                            <Blog isAdmin={isAdmin} user={user}/>
                            }
                </Container>
            </div>
            <FooterDisplay isAdmin={isAdmin} user={user}/>
        </div>
    );
};


export default App