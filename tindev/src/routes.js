import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Login from './pages/Login';
import Main from './pages/Main';

export default createAppContainer(
    // does not implements gesture handler to swipe pages
    createSwitchNavigator({ 
        // first page
        Login, 
        // second
        Main, 
    })
);