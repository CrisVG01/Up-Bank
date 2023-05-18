import { useContext, useState } from 'react';
import { AppBar, Box, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Menu as MenuIcon, Add, PieChart, Logout, Home } from '@mui/icons-material/';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/user.context';

const NavBar = () => {
  const [show, setShow] = useState(false);
  const toggleDrawer = (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setShow(show => !show);
  };
  return (
    <>

      <AppBar position="static"  style={{ textDecoration: "none", backgroundColor : "#570E1F" }} >
        <Toolbar>
      <img src="https://portal.up.edu.mx/images/roble_blanco.png" alt="UP-Bank-Logo" border="0" height="100rem" />

         
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: "none", color: "white" }}>
            UP Bank
          </Typography>
          {/* <Button color="success" variant="contained" startIcon={<Add />} component={Link} to="/new">Add Expense</Button> */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
        
      </AppBar>
      <TemporaryDrawer show={show} setShow={setShow} toggleDrawer={toggleDrawer} />
      
    </>
  );
};

const TemporaryDrawer = (props) => {
  const { show, toggleDrawer } = props;
  const { logOutUser } = useContext(UserContext);

  const logOut = async () => {
    await logOutUser();
    window.location.reload(true);
    return;
  }

  const navLinks = [
    {
      text: 'Home',
      Icon: Home,
      link: '/',
    },
    {
      text: 'Add Expense',
      Icon: Add,
      link: '/new',
    },
    {
      text: 'Logout',
      Icon: Logout,
      action: logOut,
    },
  ];

  const DrawerList = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
      style={{ textDecoration: "none", backgroundColor : "#570E1F" }}
     
    >
      
      <List  style={{ textDecoration: "none", backgroundColor : "#570E1F" }}>
      <img src="https://portal.up.edu.mx/images/roble_blanco.png" alt="UP-Bank-Logo" border="0" width="100%" />

        {
          navLinks.map(({ text, Icon, link, action }) => {
            return link ?
              <Link to={link} style={{ textDecoration: "none", color: "white" }} key={text}>
                <ListItem button>
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              </Link>
              :
              <ListItem button onClick={action} key={text}>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
          })
        }
      </List>
    </Box>
  );

  return (
    <div >
      <Drawer
        open={show}
        onClose={toggleDrawer}
        
      >
        {<DrawerList />}
      </Drawer>
    </div>
  );
}

export default NavBar;