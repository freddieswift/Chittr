
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import homeScreen from './screens/homeScreen';
import loginScreen from './screens/loginScreen';
import signUpScreen from './screens/signUpScreen';
import searchScreen from './screens/searchScreen';
import userProfile from './screens/userProfile';
import followersScreen from './screens/followersScreen';
import editProfileScreen from './screens/editProfileScreen';

const AppStackNav = createStackNavigator({
	
	home: { screen: homeScreen, navigationOptions: {headerShown: false}},
	login: { screen: loginScreen, navigationOptions: {headerShown: false}},
	signUp: { screen: signUpScreen, navigationOptions: {headerShown: false}},
	search: { screen: searchScreen, navigationOptions: {headerShown: false}},
	userProfile: { screen: userProfile, navigationOptions: {headerShown: false}},
	followers: { screen: followersScreen, navigationOptions: {headerShown: false}},
	editProfile: { screen: editProfileScreen, navigationOptions: {headerShown: false}},
});

const AppContainer = createAppContainer(AppStackNav)

export default AppContainer;