
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import homeScreen from './screens/homeScreen';
import loginScreen from './screens/loginScreen';
import signUpScreen from './screens/signUpScreen';


const AppStackNav = createStackNavigator({
	
	home: { screen: homeScreen, navigationOptions: {headerShown: false}},
	login: { screen: loginScreen, navigationOptions: {headerShown: false}},
	signUp: { screen: signUpScreen, navigationOptions: {headerShown: false}}
	
	
});

const AppContainer = createAppContainer(AppStackNav)

export default AppContainer;