// The Work component - Pst all works with thumbnail,title,description
import React ,{useState,useEffect} from "react";
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Radio from '@material-ui/core/Radio';
import AppBar from "@material-ui/core/AppBar";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import Input from "@material-ui/core/Input";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import PropTypes from "prop-types";
import MenuItems from "./MenuItems";


//Material ui styles
const useStyles = makeStyles((theme) => ({
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
        height:200
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
}));

// Component Work
const Work =(props) =>{
    const classes = useStyles();

    //STATES
    const [categories ,setCategories] = useState([]);
    const [allProjects, setAllProjects] = useState([]);
    const [activeLink,setActiveLink] = useState("all");
    //Catgeory add,edit,delete
    const [open, setOpen] = useState(false);
    const [categoryOption,setCategoryOption] = useState("add");
    const [categoryName, setCategoryName] = useState("");
    const [newCategoryName, setNewCategoryName] = useState("");
    const [message,setMessage] = useState("");
    //project add,edit,delete
    const [openProjectDialog, setOpenProjectDialog] = useState(false);
    const [projectOption,setProjectOption] = useState("add");
    const [projectObject,setProjectObject] = useState({title:"",url:"",description:"",category:[],_id:null});

    //image
    const [imageFile,setImageFile] = useState(null);


    //FUNCTIONS
    // similar to componentDidMount and componentDidUpdate
    useEffect(  () => {
        // call fetchdata() to fetch all initial data
        fetchCategoriesData();
        fetchProjectsData();

    },[]);

    // fetch all work items from backend initially when component is mounted
    async function fetchCategoriesData() {
        const response = await fetch('/work/categories',{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        const jsonData =  await response.json();
        //console.log("data got in categior",jsonData);
        //categories
        setCategories(jsonData.categories);
    }
    // get all work details
    async function fetchProjectsData() {
        const response = await fetch('/work/projects',{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        const jsonData =  await response.json();
        console.log("data got in project",jsonData);
        //projects
        setAllProjects(jsonData.work);
    }

    // get specific works for a category
    const fetchSpecificProjectsData =async (currentCategoryName)=> {
        const response = await fetch('/work/projects/'+currentCategoryName,{
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        const jsonData =  await response.json();
        //console.log("data got for specific cat",jsonData);
        //categories
        setAllProjects(jsonData.work.projects);

    }

    // function to display all work when a category is clicked
    const handleCategoryLink =async (currentCategoryName) => {
        //console.log("currentCategoryName",currentCategoryName);
        if (currentCategoryName === "all") {
            fetchProjectsData();
            setActiveLink("all");
        } else {
            fetchSpecificProjectsData(currentCategoryName);
            setActiveLink(currentCategoryName);
        }
    };

    // function to open the dialog to add/delete/edit category or project
    const handleOpen = (categoryOrProject,option,project) => {
        if(categoryOrProject === "category"){
            setOpen(true);
        }
        else if(categoryOrProject === "project"){
            if(option === "add") setProjectOption("add") ;

            else if (option === "edit"){
                setProjectOption("edit");
                console.log("rpoekect details:",project);
                const categoryArray =[];
                project.category.forEach((element,index,array)=>{
                   const cat = categories.find((item) => element === item["_id"]);
                   if(cat !== undefined) categoryArray.push(cat.name)
                });
                setProjectObject({title:project.title,url:project.url,description:project.description,
                    category:categoryArray,_id:project["_id"]})
            }

            else if(option === "delete"){
                setProjectOption("delete");
                setProjectObject({_id:project["_id"]})
            }
            setOpenProjectDialog(true);
        }

    };

    // function to close the dialog to add/delete/edit category or project
    const handleClose = (categoryOrProject) => {
        if(categoryOrProject === "category"){
            setCategoryOption("add");
            setNewCategoryName("");
            setCategoryName("");
            setOpen(false);
        }
        else if(categoryOrProject === "project"){
            setOpenProjectDialog(false);
            setProjectObject({title:"",url:"",description:"",category:[]});
            setImageFile(null);
            if(projectOption === "edit" || projectOption === "delete") handleCategoryLink(activeLink);

        }
        setMessage ("");


    };

    // START OF FUNCTIONS FOR ADD/EDIT/DELETE CATEGORIES
    //function to set state when a category is selected for edit and delete category
    const handleCategoryOption = (event) => {
        setCategoryOption((event.target.value));
        setNewCategoryName("");
        setCategoryName("");
        setMessage ("");
    };
    //function to set state category name
    const handleChange = (option,event) =>{
        if(option === "edit"){
            setNewCategoryName(event.target.value);
        }
        else{
            setCategoryName(event.target.value);
        }

    };
    // function to add a category
    const handleAdd = () =>{
        let user = props.user;
        if(user === null){
            alert("Login to perform this action!")
        }
        else{
            fetch('/work/categories',  {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({category:categoryName})
            }).then( (response)=> {
                response.json().then((data) => {
                    //console.log(data);
                    if(data.success){
                        categories.push(data.category);
                        //setCategories(categories);
                    }
                    setMessage(data.message);
                    setNewCategoryName("");
                    setCategoryName("");

                });
            })
        }

    };
    //function to edit category
    const handleEdit = () =>{
        let user = props.user;
        if(user === null){
            alert("Login to perform this action!")
        }
        else{
            fetch('/work/categories/'+categoryName,  {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({newCategory:newCategoryName})
            }).then( (response)=> {
                response.json().then((data) => {
                    //console.log(data);
                    if(data.success){
                        //console.log("category edites:",data.work);
                        const indexToChange = categories.findIndex((element,index,array)=>{
                            return element.name === categoryName
                        });
                        categories[indexToChange].name = data.work.name;
                        //setCategories(categories);
                    }
                    setMessage(data.message);
                    setNewCategoryName("");
                    setCategoryName("");

                });
            })
        }
    };
    //function to delete a category
    const handleDelete = () =>{
        let user = props.user;
        if(user === null){
            alert("Login to perform this action!")
        }
        else{
            fetch('/work/category'+categoryName,  {
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({category:categoryName})
            }).then( (response)=> {
                response.json().then((data) => {
                    //console.log(data);
                    if(data.success){
                        //console.log("category edites:",data.work);
                        const indexToChange = categories.findIndex((element,index,array)=>{
                            return element.name === data.deletedCategory.name
                        });
                        categories.splice(indexToChange,1);
                        //setCategories(categories);
                    }
                    setMessage(data.message);
                    setNewCategoryName("");
                    setCategoryName("");

                });
            })
        }

    };
    // END OF FUNCTIONS FOR ADD/EDIT/DELETE CATEGORIES


    // START OF FUNCTIONS FOR ADD/EDIT/DELETE PROJECT WORKS
    // function set state for project object with details of selected project work
    const handleChangeProjectDetails = (event) => {
        console.log("event change in project add",event.target.name,event.target.value);
        setProjectObject({ ...projectObject,[event.target.name]:event.target.value});
    };

    // function to add or edit a project work
    const handleAddProject =(addOrEdit) =>{
        let user = props.user;
        if(user === null){
            alert("Login to perform this action!")
        }
        else{
            //call to add a new project work
            if(addOrEdit === "add"){
                fetch('/work/addProject',  {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({category:projectObject.category,title:projectObject.title,
                        url:projectObject.url,description:projectObject.description})
                }).then( (response)=> {
                    response.json().then((data) => {
                        //console.log(data);
                        if(data.success){
                            //console.log("imageFile:",imageFile);
                            if(imageFile !== null){
                                //console.log("jffjhfjdhfjdhfdj");
                                uploadImage(data.project["_id"])
                            }
                            allProjects.push(data.project);
                            //setCategories(categories);
                        }
                        setMessage(data.message);
                        setProjectObject({title:"",url:"",description:"",category:[]})

                    });
                })
            }
            //call to edit a new project work
            else if(addOrEdit === "edit"){
                fetch('/work/editProject/'+projectObject["_id"],  {
                    method: 'PUT',
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({category:projectObject.category,title:projectObject.title,
                        url:projectObject.url,description:projectObject.description})
                })
                    .then( (response)=> {
                        response.json().then((data) => {
                            if(data.success){
                                console.log("in put: ",data);
                                if(imageFile !== null){uploadImage(projectObject["_id"]);}
                                const indexToChange = allProjects.findIndex((element,index,array)=>{
                                    return element["_id"] === projectObject["_id"];
                                });
                                allProjects[indexToChange] = data.project;
                            }
                            setMessage(data.message);
                            setProjectObject({title:"",url:"",description:"",category:[]});

                        });
                    })
            }
        }
    };

    // function to delete a new project work
    const handleDeleteProject =() =>{
        let user = props.user;
        if(user === null){
            alert("Login to perform this action!")
        }
        else{
            fetch('/work/deleteProject/'+projectObject["_id"],  {
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json"
                },
            }).then( (response)=> {
                response.json().then((data) => {
                    //console.log(data);
                    if(data.success){
                        //console.log("category edites:",data.work);
                        const indexToChange = allProjects.findIndex((element,index,array)=>{
                            return element["_id"] === data.deletedProject["_id"]
                        });
                        allProjects.splice(indexToChange,1);
                        //setCategories(categories);
                    }
                });
                handleClose("project")
            })
        }

    };
    // END OF FUNCTIONS FOR ADD/EDIT/DELETE PROJECT WORKS

    // Image functions
    const handleImageUpload =(event)=>{
        setImageFile(event.target.files[0]);

    };

    const uploadImage =(projectId) =>{
        const formData = new FormData();
        formData.append('workImage', imageFile);
        fetch(`/work/upload/`+projectId,{
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
               handleDefaultImage(projectId,"true")
            }
        });
    };

    const handleDefaultImage =(projectId,booleanString)=>{
        fetch('/work/image/'+projectId,  {
            method: 'PUT',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({image:booleanString})
        }).then( (response)=> {
            response.json().then((data) => {
                //console.log("handle image:"+data);
                const indexToChange = allProjects.findIndex((item,index,array)=>{
                    return item["_id"] === projectId
                })
                allProjects[indexToChange].image = data.image;
                if(booleanString === "false"){
                    setMessage("Image changed to default pic");
                }

            });
        })
    };



    //Render the component
    return(
        <Container className={classes.cardGrid} maxWidth="md">

            {/*START OF CATEGORIES DISPLAY AND FUNCTIONALITY*/}
            {/*Display categories*/}
            <AppBar position="static" color="default" className={classes.appBar}>
                    <nav>
                        <Link variant="button" color={activeLink ==="all" ? "secondary" :"primary"}
                              onClick={()=>handleCategoryLink("all")} className={classes.link}>
                            all
                        </Link>
                        {categories.map((element,index,array)=>{
                            return <Link key={`category${element.name}`} variant="button" name={element.menu}
                                         color={activeLink ===element.name ? "secondary" :"primary"}
                                         onClick={()=>handleCategoryLink(element.name)}
                                         className={classes.link}>
                                {element.name}
                                </Link>
                        })}

                        {/*ADMIN FUNCTIONALITY TO DISPLAY ADD,EDIT OR DELETE CATEGORY DIALOG*/}
                        {props.isAdmin ?
                            <Button aria-haspopup="true" color="primary" variant="outlined" className={classes.link}
                                    onClick={() => handleOpen("category")}>
                                change category details here!
                            </Button>
                            :
                            null
                        }

                    </nav>

                {/*ADMIN FUNCTIONALITY TO ADD A NEW PROJECT*/}
                {props.isAdmin ?
                    <Button aria-haspopup="true" color="primary" variant="outlined" className={classes.link}
                            onClick={() => handleOpen("project","add")}>
                        add new project
                    </Button>
                    :
                    null
                }

                {/*Dialog for Add ,Edit, Delete Category */}
                <Dialog onClose={()=> handleClose("category")} aria-labelledby="simple-dialog-title" open={open}>
                    <DialogTitle id="simple-dialog-title">Change Category details</DialogTitle>
                    <FormLabel className={classes.formControl}>Choose an option</FormLabel>
                    {/* eslint-disable-next-line react/jsx-no-undef */}
                    <RadioGroup
                        name="category option"
                        aria-label="category option"
                        value={categoryOption}
                        onChange={handleCategoryOption}
                        className={classes.formControl}
                        row
                    >
                        {["add","edit","delete"].map((value) => (
                            <FormControlLabel
                                key={value}
                                value={value}
                                control={<Radio />}
                                label={value.charAt(0).toUpperCase()+value.slice(1)}
                            />
                        ))}
                    </RadioGroup>
                    {/*Toggle display based option "add" or "edit/delete" is selected*/}
                    {categoryOption === "add" ?
                        <div className={classes.formControl}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="category"
                                label="Category"
                                name="categoryName"
                                value={categoryName}
                                onChange={(e)=>handleChange("add",e)}
                                autoFocus
                            />
                            <Button color="primary" variant="outlined" onClick={handleAdd} disabled={categoryName.length<1}>
                                add
                            </Button>
                        </div>

                        :
                        <div className={classes.formControl}>
                            <InputLabel htmlFor="category-native-simple">Category</InputLabel>
                                <Select
                                    native
                                    value={categoryName}
                                    onChange={(e)=>handleChange("add",e)}
                                >
                                    {categories.map((element,index,array)=>{
                                        return <option key={`cat${element.name}${index}`}
                                            value={element.name}>{element.name}</option>
                                    })}
                                </Select>
                        {/*display text field and edit button if option "edit" is selected or
                        delete button if "delete is selected. The dropdown remains for both*/}
                            {categoryOption === "edit"
                                ?
                                <div>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        id="category"
                                        label="New category name"
                                        name="newCategoryName"
                                        value={newCategoryName}
                                        onChange={(e)=>handleChange("edit",e)}
                                        autoFocus
                                    />
                                    <Button color="primary" variant="outlined" className={classes.link}
                                            onClick={handleEdit} disabled={newCategoryName.length<1}>
                                        edit
                                    </Button>
                                </div>
                                :

                                <Button color="primary" variant="outlined" className={classes.link}
                                        onClick={handleDelete}>
                                    delete
                                </Button>
                            }
                        </div>
                       }
                    {/*display appropriate message after a add,edit,delete category is done*/}
                    <Typography  align="center"  gutterBottom color={"secondary"}>
                        {message}
                    </Typography>
                </Dialog>
                {/*END OF CATEGORIES DISPLAY AND FUNCTIONALITY*/}

                {/*START OF PROJECTS WORK DISPLAY AND FUNCTIONALITY*/}
                {/*Dialog for Add ,Edit, Delete each project work */}
                <Dialog open={openProjectDialog} onClose={()=> handleClose("project")} >
                    <DialogTitle id="simple-dialog-title">
                        {projectOption === "add" ? "Add a new project" : projectOption === "edit" ?
                            "Change project details" : "Delete Project"}
                    </DialogTitle>
                    {/*display confirmation dialog when a project is deleted, or display respective fields to add or delete project work*/}
                    {projectOption === "delete" ?
                        <div>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Are you sure you want to delete this project?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={()=> handleClose("project")} color="primary">
                                    No
                                </Button>
                                <Button onClick={handleDeleteProject} color="primary" autoFocus>
                                    Yes
                                </Button>
                            </DialogActions>
                        </div>
                        :
                        projectOption === "add" || projectOption === "edit" ?
                        <div>
                            <form className={classes.formControl} noValidate autoComplete="off">
                                <div>
                                    <TextField  id="standard-required" label="Title"
                                                name={"title"}
                                                value={projectObject.title}
                                                onChange={handleChangeProjectDetails} />
                                    <TextField  id="standard-disabled" label="url"
                                                name={"url"}
                                                value={projectObject.url}
                                                onChange={handleChangeProjectDetails}   />
                                    <TextField
                                        margin="normal"
                                        label="Description"
                                        fullWidth
                                        name="description"
                                        id="description"
                                        value={projectObject.description}
                                        rows={2}
                                        rowsMax={4}
                                        multiline
                                        onChange={handleChangeProjectDetails}
                                    />
                                    <InputLabel id="demo-mutiple-checkbox-label">Categories</InputLabel>
                                    <Select
                                        labelId="demo-mutiple-checkbox-label"
                                        fullWidth
                                        id="demo-mutiple-checkbox"
                                        multiple
                                        name={"category"}
                                        value={projectObject.category}
                                        onChange={handleChangeProjectDetails}
                                        renderValue={(selected) => selected.join(', ')}
                                        input={<Input />}

                                    >
                                        {categories.map((element,index,array) => (
                                            <MenuItem key={`checkCat${element.name}${index}`} value={element.name}>
                                                <Checkbox checked={projectObject.category.indexOf(element.name) > -1} />
                                                <ListItemText primary={element.name} />
                                            </MenuItem>
                                        ))}
                                    </Select>

                                    <InputLabel style={{paddingTop:5}}>Choose image for thumbnail</InputLabel>
                                    <input type={"file"} accept="image/*" name={"imageFile"} className={classes.link}
                                           onChange={handleImageUpload} />
                                    {/* Dsiplay option to change default image only when editing a project work*/}
                                    {projectOption === "edit"  ?
                                    <Button color="primary"
                                            onClick={()=>handleDefaultImage(projectObject["_id"],"false")}>
                                        Upload the default image
                                    </Button>
                                        :
                                        null
                                    }
                                </div>
                                <Button color="primary" variant="outlined" className={classes.link}
                                        onClick={()=>handleAddProject(projectOption)} disabled={projectObject.category.length < 1}>
                                    save this project
                                </Button>
                            </form>
                            {/*Display appropriate message when a project work id added,edited or deleted*/}
                            <Typography  align="center"  gutterBottom color={"secondary"}>
                                {message}
                            </Typography>
                        </div>
                        :
                            null

                        }

                </Dialog>
                {/*END OF PROJECTS WORK DISPLAY AND FUNCTIONALITY*/}


                {/*Display projects based on category selected*/}
            </AppBar>
            <Grid container spacing={4}>
                {allProjects.map((project,index,array) => (
                    <Grid item key={`grid${project.title}${index}`} xs={12} sm={6} md={4}>
                        <Card className={classes.card} key={`card${project.title}${index}`}>
                            <CardMedia
                                key={`cardMedia${project.title}${index}`}
                                className={classes.cardMedia}
                                image={
                                    project.image ?
                                    `http://www.sandhyasankaran.com/static/media/project${project["_id"]}.jpg` :
                                    require(`../images/default.jpg`)
                                }
                                title="Image title"
                            />
                            <CardContent className={classes.cardContent}>
                                {project.title !== undefined ?
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {project.title}
                                    </Typography>:
                                null }
                                {project.url !== undefined ?
                                    <Link gutterBottom component="a">
                                        {project.url}
                                    </Link>
                                    :
                                    null}
                                {project.description !== undefined ?
                                    <Typography>
                                        {project.description}
                                    </Typography>
                                    :
                                    null}
                            </CardContent>

                            {/*ADMIN FUNCTIONALITY TO DISPLAY EDIT OR DELETE PROJECT WORK DIALOG*/}
                            {props.isAdmin ?
                                <CardActions>
                                    <Button size="small" color="primary"
                                            onClick={()=>handleOpen("project","edit",project)}>
                                        edit
                                    </Button>
                                    <Button size="small" color="primary"
                                            onClick={()=>handleOpen("project","delete",project)}>
                                        delete
                                    </Button>
                                </CardActions>
                                :
                                null
                            }

                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

Work.propTypes ={
    isAdmin: PropTypes.bool,
    user:PropTypes.object

};

export default Work