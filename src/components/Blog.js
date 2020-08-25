import React,{useState,useEffect} from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions/CardActions";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import TextField from "@material-ui/core/TextField/TextField";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import ReactMarkdown from 'react-markdown/with-html';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Toolbar from "@material-ui/core/Toolbar";
import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded';
import PropTypes from "prop-types";
import Work from "./Work";


//Material ui styles
const useStyles = makeStyles((theme) => ({
    cardGrid: {
        paddingTop: theme.spacing(6),
        paddingBottom: theme.spacing(6),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
        height:200,
    },
    cardContent: {
        flexGrow: 1,
    },
    flexContainer : {
        display: 'flex',
        flexDirection: 'row',
        padding:0
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    link: {
        margin: theme.spacing(1, 1.5),
        '& .MuiListItem-button': {
            margin: theme.spacing(1, 1.5)
        }
    },
    appBar:{
        margin: theme.spacing(0,0,3,0),
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(3),
        minWidth: 120,
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        }
    },
    comment:{
        backgroundColor: '#e6e6e6',
        padding: theme.spacing(2, 2, 2, 2),
        border: '1px solid #ced4da',
        borderRadius: theme.spacing(1),
        width: '100%',
        overflow: 'auto',
        overflowX: 'auto',
        overflowY: 'auto'

    }
}));


// Component Blog
const Blog = (props) =>{
    const classes = useStyles();
    //STATES
    //blog add,edit,delete
    const [blogs ,setBlogs] = useState([]);
    const [open,setOpen] = useState(false);
    const [blogOption , setBlogOption] = useState("add");
    const [blogObject,setBlogObject] = useState({_id:null,topic:"",content:"",comments:[],likes:[]});
    const [message,setMessage] = useState("");
    //image state
    const [imageFile,setImageFile] = useState(null);
    // state to view blog
    const [viewBlog,setViewBlog] = useState(false);
    //comment state
    const [comment,setComment] = useState("");


    //FUNCTIONS
    // similar to componentDidMount and componentDidUpdate
    useEffect(  () => {
        // call fetchdata() to fetch all initial data
        fetchBlogs();
    },[]);

    // fetch all blog items from backend initially when component is mounted
    async function fetchBlogs() {
        const response = await fetch('/blog',{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        const jsonData =  await response.json();
        console.log("data got in blog",jsonData);
        //categories
        setBlogs(jsonData.blog);
    }

    // START OF FUNCTIONS FOR ADD/EDIT/DELETE BLOG
    // function to open dialog based on options "add", "edit" or "delete" selected
    const handleOpen = (option,blogDetails) => {
        if (option === "add") {
            setBlogOption("add");
        }
        else if(option === "edit"){
            setBlogOption("edit");
            setBlogObject({_id:blogDetails._id,topic:blogDetails.topic,content:blogDetails.content,
                comments: blogDetails.comments,likes:blogDetails.likes})
        }
        else if(option === "delete"){
            setBlogOption("delete");
            setBlogObject({_id:blogDetails._id});
        }
        setOpen(true);

    };

    // function to close dialog for add, edit delete blog
    const handleClose = () =>{
        setBlogs(blogs);
        setOpen(false);
        setBlogObject({topic:"",content:"",_id:null});
        setImageFile(null);
        setMessage("");

    };

    // function set state for blog object with details of selected blog
    const handleChangeBlogDetails =(event) =>{
        setBlogObject({...blogObject,[event.target.name]:event.target.value})
    };

    // function to set state for blog object "content" based on markdown uploaded
    const handleContent =(e) =>{
        let reader = new FileReader();
        let file = e.target.files[0];

        if (e.target.value.length !== 0) {
            reader.onloadend = async (e) => {
                // The file's text will be printed here

                setBlogObject({...blogObject,content:e.target.result})
                console.log("this.state.content: ",blogObject.content);
            };

            reader.readAsText(file);
        }
        else{
            setBlogObject({...blogObject,content:blogObject.content});
        }

    };

    // function to add or edit a new blog
    const handleSaveBlog =(addOrEdit) => {
        let user = props.user;
        if(user === null){
            alert("Login to perform this action!")
        }
        else{
            // call to add a new blog
            if (addOrEdit === "add") {
                fetch('/blog', {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({topic: blogObject.topic, content: blogObject.content})
                }).then((response) => {
                    response.json().then((data) => {
                        console.log("create blog",data);
                        if (data.success) {
                            //console.log("imageFile:",imageFile);
                            if (imageFile !== null) {
                                //console.log("jffjhfjdhfjdhfdj");
                                uploadImage(data.blog["_id"])
                            }
                            blogs.push(data.blog);
                            //setCategories(categories);
                        }
                        setMessage(data.message);
                        setBlogObject({topic: "", content: "", comments: [], likes: []})

                    });
                })
            }
            // call to edit a new blog
            else if(addOrEdit === "edit"){
                fetch('/blog/'+blogObject["_id"],  {
                    method: 'PUT',
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({topic:blogObject.topic, content:blogObject.content})
                })
                    .then( (response)=> {
                        response.json().then((data) => {
                            if(data.success){
                                console.log("in put: ",data);
                                if(imageFile !== null){uploadImage(blogObject["_id"]);}
                                const indexToChange = blogs.findIndex((element,index,array)=>{
                                    return element["_id"] === blogObject["_id"];
                                });
                                blogs[indexToChange] = data.blog;
                            }
                            setMessage(data.message);
                            setBlogObject({topic:"",content:""});

                        });
                    })
            }
        }

    };

    // function to delete a blog
    const handleDeleteBlog =() =>{
        let user = props.user;
        if(user === null){
            alert("Login to perform this action!")
        }
        else{
            fetch('/blog/'+blogObject["_id"],  {
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json"
                },
            }).then( (response)=> {
                response.json().then((data) => {
                    //console.log(data);
                    if(data.success){
                        console.log("category deleted:",data);
                        const indexToChange = blogs.findIndex((element,index,array)=>{
                            return element["_id"] === data.deletedBlog["_id"]
                        });
                        console.log("index:",indexToChange);
                        blogs.splice(indexToChange,1);
                        //console.log("blogs",cc);
                        //setBlogs(blogs);
                        //setMessage(data.message);
                    }
                });
            });
            handleClose();
        }

    };
    // END OF FUNCTIONS FOR ADD/EDIT/DELETE BLOG

   // handle image functions
    const handleImageUpload =(event) =>{
        setImageFile(event.target.files[0]);
    };

    const uploadImage =(blogId) =>{
        const formData = new FormData();
        formData.append('blogImage', imageFile);
        fetch(`/blog/upload/`+blogId,{
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
                handleDefaultImage(blogId,"true")
            }
        });
    };

    const handleDefaultImage =(blogId,booleanString)=>{
        fetch('/blog/image/'+blogId,  {
            method: 'PUT',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({image:booleanString})
        }).then( (response)=> {
            response.json().then((data) => {
                //console.log("handle image:"+data);
                const indexToChange = blogs.findIndex((item,index,array)=>{
                    return item["_id"] === blogId
                })
                blogs[indexToChange].image = data.image;
                if(booleanString === "false"){
                    setMessage("Image changed to default pic");
                }

            });
        })
    };



    // function when a blog "View" button is clicked
    const viewArticle =(blogDetails) =>{
        console.log("blogDetails: ",blogDetails);
        setViewBlog(!viewBlog);
        if(blogDetails!== null){
            setBlogObject({_id:blogDetails._id,topic:blogDetails.topic,content:blogDetails.content,
                comments: blogDetails.comments,likes:blogDetails.likes})
        }

    };

    // COMMENT FUNCTIONS
    // function to set state for comment text
    const handleCommentChange =(event) =>{
        setComment(event.target.value);
    };

    // function to add a new comment
    const addComment = () =>{
        let user = props.user;
        if(user === null){
            setMessage("Login to comment")
        }
        else{
            fetch(`/blog/comment/${blogObject._id}`,{
                method:'POST',
                headers: {
                    "Content-type": "application/json",
                    'Accept': 'application/json'
                },
                body: JSON.stringify({profileId:props.user.googleId,name:props.user.displayName,
                    image:props.user.image,
                    comment:comment})
            }).then(response => response.json()).then(data =>{
                //console.log(data);
                if(data.success){
                    console.log("in post comments: ",data);
                    //if(imageFile !== null){uploadImage(blogObject["_id"]);}
                    const indexToChange = blogs.findIndex((element,index,array)=>{
                        return element["_id"] === blogObject["_id"];
                    });
                    const newBlog = data.blog;
                    blogs[indexToChange] = newBlog;
                    blogObject.comments.push(newBlog.comments[newBlog.comments.length - 1]);
                    setComment("");
                }

                setMessage(data.message);
            })
        }
    };

    // function to delete a comment
    const deleteComment =(index,id,profileId) =>{
        if(window.confirm("Are you sure?")){
            let user = props.user;
            if(user === null){
                alert("Login to comment");
            }
            else{

                fetch(`/comments/${blogObject._id}`,{
                    method:'DELETE',
                    headers: {
                        "Content-type": "application/json",
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({id:id,profileId:profileId})
                }).then(response => response.json()).then(data =>{
                    //console.log(data);
                    if(data.success){
                        console.log("in post comments: ",data);
                        //if(imageFile !== null){uploadImage(blogObject["_id"]);}
                        const indexToChange = blogs.findIndex((element,index,array)=>{
                            return element["_id"] === blogObject["_id"];
                        });
                        const newBlog = data.blog;
                        blogs[indexToChange] = newBlog;
                        blogObject.comments.splice(1);

                    }

                    setMessage(data.message);
                })
            }
        }

    };

    // LIKE FUNCTIONS
    // function to add or remove a like
    const handleLike =(blog) =>{
        let user = props.user;
        if(user === null){
            setMessage("Login to like");
        }
       else{
        let blogDetails = null;
        if(blog == null){
             blogDetails = blogObject;
        }
        else{
            blogDetails = blog;
        }

        if(blogDetails.likes.find((element,index,array)=> {
            // if user is not found add like
                return element === props.user.googleId }) === undefined)
            {
                fetch(`/blog/like/${blogDetails._id}`,{
                    method:'POST',
                    headers: {
                        "Content-type": "application/json",
                        'Accept': 'application/json'

                    },
                    body: JSON.stringify({profileId:props.user.googleId })
                }).then(response => response.json()).then(data => {
                    if (data.success) {
                        console.log("in post like: ", data);
                        //if(imageFile !== null){uploadImage(blogObject["_id"]);}
                        const indexToChange = blogs.findIndex((element, index, array) => {
                            return element["_id"] === blogDetails["_id"];
                        });
                        const newBlog = data.blog;
                        blogs[indexToChange] = newBlog;
                        blogDetails.likes.push(props.user.googleId );
                    }
                    setMessage(data.message);
                });

            }
            // if user is found remove like
            else{
                //console.log('jhjfhdjfhdjfhdjhdjfhdjfhdjfhd');
                fetch(`/blog/like/${blogDetails._id}`,{
                    method:'DELETE',
                    headers: {
                        "Content-type": "application/json",
                        'Accept': 'application/json'

                    },
                    body: JSON.stringify({profileId:props.user.googleId })
                }).then(response => response.json()).then(data =>{
                    if (data.success) {
                        console.log("in delete like: ", data);

                        const indexToChange = blogs.findIndex((element, index, array) => {
                            return element["_id"] === blogDetails["_id"];
                        });
                        const newBlog = data.deletedLikes;
                        blogs[indexToChange] = newBlog;
                       const cc =  blogDetails.likes.filter((element,index,array) =>{
                            return element !== props.user.googleId
                       });
                       console.log('cc',cc);
                        blogDetails.likes = cc;
                    }
                    setMessage(data.message);
                })
            }
        }
    };

    // Render component
    return (
        <Container className={classes.cardGrid} maxWidth="md">
            {/*View the blog when the "View" button is clicked*/}
            {viewBlog ?
                <div>
                    <Button aria-haspopup="true" color="primary" variant="outlined" className={classes.link}
                            onClick={()=>viewArticle(null)}>
                        back
                    </Button>
                    <Typography variant="h4" component="h2" align={"center"}>
                        {blogObject.topic}
                    </Typography>
                    {/*display blog content by markdown converter*/}
                    <ReactMarkdown source={blogObject.content} />
                    {/*display the number of comments and like functionality*/}
                    <div className={"commentDiv"}>
                        <Toolbar>
                            <Typography variant={"body2"} variantMapping={{body2 : 'span'}}>
                                <strong>{`${blogObject.comments.length} Comments `}</strong>
                            </Typography>
                        <div style={{marginLeft: 'auto'}}>
                            {blogObject.likes.length}
                            <IconButton onClick={()=>handleLike(null)}
                                        color={blogObject.likes.includes(props.user.googleId) ? 'primary' : 'default'}>
                            <ThumbUpAltIcon/>
                            </IconButton>

                        </div>
                        </Toolbar>

                        {/*display all the comments*/}

                        <List className={classes.list}>
                                {blogObject.comments.map(( element, index, array)  => {
                                       return  <ListItem key={`commentList${element.profileId}${index}`}>
                                            <ListItemAvatar>
                                                <Avatar variant="rounded" alt="Profile Picture" src={element.image} />
                                            </ListItemAvatar>
                                           <div className={classes.comment}>
                                               <Typography style={{ display: "flex", justifyContent: "space-between", fontSize:'small'}}
                                                           color="textSecondary">
                                                   {element.name}
                                                   <span>{new Date(element.date).toLocaleString()}</span>
                                               </Typography>

                                               <Typography key={`comment${element.profileId}${index}`}

                                                           variant={"body1"} color={"textPrimary"}>
                                                   {element.comment}
                                               </Typography>
                                           </div>
                                               {/* display delete button for comment for ADMIN and the user who posted the comment*/}
                                               {props.isAdmin ?
                                                   <Button  color="primary" variant="outlined" className={classes.link}
                                                            onClick={()=>deleteComment(index,element._id,element.profileId)}>
                                                       delete
                                                   </Button> :
                                               null}
                                        </ListItem>
                                })}
                            {/*    Text box for posting a comment*/}
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar alt="Profile Picture" >..</Avatar>
                                </ListItemAvatar>
                                    <TextField className="comment"
                                               label="Comment"
                                               multiline
                                               rows={2}
                                               column={14}
                                               rowsMax={4}
                                               variant="outlined"
                                               onChange={handleCommentChange}
                                               name={"comment"}
                                               value={comment}
                                               fullWidth
                                    />
                            </ListItem>
                            <ListItem>
                                    <Button  color="primary" variant="outlined" className={classes.link}
                                    onClick={addComment}>
                                        add comment
                                    </Button>
                            </ListItem>

                            </List>
                    </div>
                </div>
                :
                <div>
                {/*    THE MAIN BLOG PAGE - DISPLAY ALL BLOGS AND ITS FUNCTIONALITIES*/}
                {
                    props.isAdmin ?
                        <Button aria-haspopup="true" color="primary" variant="outlined" className={classes.link}
                                onClick={() => handleOpen("add")}>
                            add a new blog content
                        </Button>
                        :
                        null
                }
            {/*Dialog to add, edit and delete a blog*/}
                <Dialog open={open} onClose={handleClose} >
                <DialogTitle id="simple-dialog-title">
                {blogOption === "add" ? "Add a new blog post" : blogOption === "edit" ?
                    "Change blog details" : "Delete blog"}
                </DialogTitle>
                {blogOption === "delete" ?
                    <div>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete this blog?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                No
                            </Button>
                            <Button onClick={handleDeleteBlog} color="primary" autoFocus>
                                Yes
                            </Button>
                        </DialogActions>
                    </div>
                    :
                    blogOption === "add" || blogOption === "edit" ?
                        <div>
                            <form className={classes.formControl} noValidate autoComplete="off">
                                <div>
                                    <TextField id="standard-required" label="Topic"
                                               name={"topic"}
                                               value={blogObject.topic}
                                               onChange={handleChangeBlogDetails}/>

                                    <InputLabel id="demo-mutiple-checkbox-label">Choose markdown for
                                        content</InputLabel>
                                    <input type={"file"} accept=".md" name={"content"} className={classes.link}
                                           onChange={handleContent}/>

                                    <InputLabel style={{paddingTop: 5}}>Choose image for thumbnail</InputLabel>
                                    <input type={"file"} accept="image/*" name={"imageFile"} className={classes.link}
                                           onChange={handleImageUpload}/>
                                    {/*display  default image button only when blog is edited*/}
                                    {blogOption === "edit" ?
                                        <Button color="primary"
                                                onClick={() => handleDefaultImage(blogObject["_id"], "false")}>
                                            Upload the default image
                                        </Button>
                                        : null
                                    }
                                </div>
                                <Button color="primary" variant="outlined" className={classes.link}
                                        onClick={() => handleSaveBlog(blogOption)}
                                        disabled={blogObject.topic.length < 1}>
                                    save this blog
                                </Button>
                            </form>
                            {/*Display appropriate message for add, edit, delete blog*/}
                            <Typography align="center" gutterBottom color={"secondary"}>
                                {message}
                            </Typography>
                        </div>
                        : null

                }

                </Dialog>

            {/*display all blogs */}
                <Grid container spacing={4}>
                {blogs.map((blog, index, array) => (
                    <Grid item key={`grid${blog.topic}${index}`} xs={12} sm={6} md={4}>
                        <Card className={classes.card} key={`card${blog.topic}${index}`}>
                            <CardHeader
                                key={`cardHeader${blog.topic}${index}`}
                                title={blog.topic}
                                subheader={new Date(blog.updatedAt).toLocaleDateString()}
                                action={props.isAdmin ?
                                        <div>
                                            <Button size="small" color="primary" onClick={() => handleOpen("edit", blog)}>
                                                edit
                                            </Button>
                                            <Button size="small" color="primary" onClick={() => handleOpen("delete", blog)}>
                                                delete
                                            </Button>
                                        </div>
                                        :
                                        null
                                }
                            />
                            <CardMedia
                                key={`cardMedia${blog.topic}${index}`}
                                className={classes.cardMedia}
                                image={
                                    blog.image ?
                                        `http://www.sandhyasankaran.com/static/media/blog${blog["_id"]}.jpg` :
                                    require(`../images/default.jpg`)}
                                title="Image title"
                            />
                            <CardContent className={classes.cardContent}>
                                {blog.content !== undefined ?
                                    <Typography>
                                        {blog.content.slice(0, 25)}
                                    </Typography>
                                    :
                                    null}
                            </CardContent>
                            <CardActions>
                                <Button size="large" color="primary" onClick={() => viewArticle(blog)}>
                                    view
                                </Button>
                                    {/*display total comments count fpr each blog*/}
                                    {`${blog.comments.length} comments  `}
                                    <MoreHorizRoundedIcon color={"secondary"} size={"large"}/>

                                {/*display total likes count for each blog and like button to like or unlike*/}
                                {blog.likes.length}
                                    <ThumbUpAltIcon onClick={() => handleLike(blog)}
                                                    color={blog.likes.includes(props.user.googleId ) ? 'primary' :
                                                        'inherit'}/>

                            </CardActions>
                        </Card>
                    </Grid>
                ))}

                </Grid>
                </div>
            }

        </Container>
    );
};

Blog.propTypes ={
    isAdmin: PropTypes.bool,
    user:PropTypes.object

};

export default Blog;