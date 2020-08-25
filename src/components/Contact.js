import React,{useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


const Contact =(props) =>{
    const classes = useStyles();

    //states
    const [open , setOpen] = useState(false);
    const [message,setMessage] = useState({fromEmail:"",content:"",website:"",name:""});
    const [confirmation,setConfirmation] = useState("");

    //functions
    const handleClickOpen = () => {
        fetch('/contact',  {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({message:message})
        }).then( (response)=> {
            response.json().then((data) => {
                console.log(data);
                if(data.success){
                    setConfirmation(data.message);
                    setOpen(true);

                }
            });
        })

    };

    const handleClose = () => {
        setOpen(false);
        setMessage({fromEmail:"",content:"",website:"",name:""})
    };

    const handleChange =(event) =>{
        setMessage({ ...message,[event.target.name]:event.target.value});
    }
    return( <Container component="main" maxWidth="xs">
        <div className={classes.paper}>

            {/*Display confirmation dialog*/}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Email Confirmation"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {confirmation}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
            {/*end of confirmation dialog*/}


            {/*Display the form*/}
            <Avatar className={classes.avatar}>
                <ContactMailIcon />
            </Avatar>
            <form className={classes.form} noValidate>
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    value={message.name}
                    onChange={handleChange}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    error={message.fromEmail.length <1}
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="fromEmail"
                    autoComplete="email"
                    value={message.fromEmail}
                    onChange={handleChange}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="website"
                    label="Website"
                    id="website"
                    autoComplete="website"
                    value={message.website}
                    onChange={handleChange}
                />
                <TextField
                    variant="outlined"
                    required
                    margin="normal"
                    fullWidth
                    name="content"
                    label="Message"
                    id="message"
                    autoComplete="message"
                    multiline
                    rows={2}
                    rowsMax={4}
                    value={message.content}
                    onChange={handleChange}
                />
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={handleClickOpen}
                    disabled={message.fromEmail.length <1}
                >
                    Send
                </Button>
            </form>
        </div>
    </Container>
    );
}

export default Contact