import React,{useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import { db,auth } from './Firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button,Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';

function getModalStyle() {
  const top = 50; 
  const left = 50; 

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    
  
    },
  }),
); 


 function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const[posts, setPosts]=useState([]);
  const[open,setOpen] = useState(false);
  const[openSignIn, setOpenSignIn]= useState(false);
  const[openimageupload, setImageupload] = useState(false);
  const[username, setUsername] = useState('');
  const[password, setPassword] = useState('');
  const[email,setEmail] = useState('');
  const[user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) =>{
      if (authUser){
          console.log(authUser);
          setUser(authUser);
      }else{
        setUser(null);

      }
    })
    return () =>{
      unsubscribe();
    }
  },[user, username]);
  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot =>{
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post:doc.data()
      })));
    })
  },[]);
  const SignUp = (event) =>{
       auth
       .createUserWithEmailAndPassword(email,password)
       .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
       })
       .catch((error)=> alert(error.message));
        setOpen(false);

  }

  const SignIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
      setOpenSignIn(false);
  }

  const imagemodal = (event) => {
    event.preventDefault();

  }
  
  return (
    <div className="App">
    
    <Modal
      open={open}
      onClose={()=> setOpen(false)}
      
    >
      <div style={modalStyle} className={classes.paper}>
      <form className="app__signup">
           <center>
         <img
         className="app__headerimage"
         src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
         alt=""
        />
        </center>
        <Input
           type="text"
           placeholder="username"
           value={username}
           onChange={(e) => setUsername(e.target.value)}
        />
      
        <Input
           type="text"
           placeholder="email"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
        />
        
         <Input
           type="password"
           placeholder="password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
        />
  
        <Button type="submit" onClick={SignUp}>Sign Up</Button>
       
      </form>
     
        
      </div>
    </Modal>
 
    <Modal
      open={openSignIn}
      onClose={()=> setOpenSignIn(false)}
      
    >
      <div style={modalStyle} className={classes.paper}>
      <form className="app__signup">
           <center>
         <img
         className="app__headerimage"
         src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
         alt=""
        />
         </center>
        <Input
           type="text"
           placeholder="email"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
        />
      
         <Input
           type="password"
           placeholder="password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
        />
      
        <Button type="submit" onClick={SignIn}>Sign In</Button>
       
      </form>
     
        
      </div>
    </Modal>

  {/*image upload Modal */}
    
    <Modal
      open={openimageupload}
      onClose={()=> setImageupload(false)}
      
    >
      <div style={modalStyle} className={classes.paper}>
      
        {user?.displayName ? (
       <ImageUpload username={user.displayName} modalclose={setImageupload}/>
      ): ( 
      <center>
         <h3>SignUp to Upload</h3>
      </center>   
      )}
      </div>
    </Modal>


    <div className="app__header">
      <img
        className="app__headerimage"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt=""
    
        />
        {user ? (
      <Button onClick={()=> auth.signOut()}>Logout</Button>
      ): (
      <div className="app__logincontainer">
      <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
      <Button onClick={() => setOpen(true)}>Sign Up</Button>
      </div>
      )
    
     }
     </div>
     

      
<div className="app__posts">
  <div className="app__postsleft">
    {
        posts.map(({id,post}) => (
          <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageurl={post.imageurl} />
          ))
      }
  </div>
 { /*<div className="app__postsright">
  <InstagramEmbed
    url='https://www.instagram.com/p/CDdtAuojAJe/?utm_source=ig_web_copy_link'
    maxWidth={320}
    hideCaption={false}
    containerTagName='div'
    protocol=''
    injectScript
    onLoading={() => {}}
    onSuccess={() => {}}
    onAfterRender={() => {}}
    onFailure={() => {}}
  />
  </div>*/}
   
</div>
     

      
        
        
      <div className="div__icon">
      <center>
      <AddAPhotoIcon  onClick={() => setImageupload(true)} className="icon">

      </AddAPhotoIcon >
      </center>
      </div>
    </div>
  );
}

export default App;
