/* import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
class chittr extends Component {
    constructor(props) {
        super(props);
		this.state = {
		  isLoading: true,
		  chitsData: []
	   }
    }
    render() {
		if(this.state.isLoading){
			return(
				<View>
					<ActivityIndicator/>
				</View>
			)
		}
        return (
            <View style={styles.container}>
                <View style={styles.headerBar}>
                    <View style={styles.userPhoto}/>
                    <Text style={styles.chittrHeaderText}>Chittr</Text>
                    <View style={styles.userPhoto} />
                </View>
				<View style = {styles.chittList}>
					<FlatList
						data={this.state.chitsData}
						renderItem={({item}) => 
							<View style={styles.chitt}>
								<View style>
									<Text style = {styles.userInfoText}>{item.user.given_name + " " + item.user.family_name}</Text>
								</View>
								<View>
									<Text style = {styles.chittText}>{item.chit_content}</Text>
								</View>
								
							</View>
						}
						//keyExtractor={({id}, index) => id}
						keyExtractor={item=>item.id}
					/>
				</View>
            </View>
                
            

        );
    }
	
	getChits(){
		return fetch('http://10.0.2.2:3333/api/v0.0.5/chits')
			.then((response) => response.json())
			.then((responseJson) => {
				this.setState({
					isLoading: false,
					chitsData: responseJson,
				});
			})
			.catch((error) => {console.log(error);});
	}
	
	componentDidMount(){
		this.getChits();
	}
}
const styles = StyleSheet.create({
	//holds the whole page
    container: {
		flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch'
    },
	
	//user info and time stamp at top of chit
	/* chitUserInfoContainer: {
		backgroundColor: 'palevioletred',
	}, */
	
	//content of chit 
	/* chitContentContainer: {
		
		
	}, */
	
	/* //the whole chit//
	chitt: {
		flexDirection: 'column',
		alignItems: 'stretch',
		margin: 5,
		padding: 5,
		borderColor: 'grey',
		borderWidth: 1,
		backgroundColor: 'white'
	}, */
	
	/* // flatlist to hold chitts//
	chittList: {
		flex: 8
	},

	// header at top of screen//
    headerBar: {
		flex: 1,
        flexDirection: 'row',
        backgroundColor: 'palevioletred',
        alignItems: 'center',
        justifyContent: 'space-around'
       
    },

    userPhoto: {
        height: 20,
        width: 20,
        backgroundColor: 'white',
        
    },
	
	userInfoText: {
		fontSize: 15,
		paddingLeft: 5
	}, */
	
	//chit content text//
	/* chittText: {
		fontSize: 25,
		paddingLeft: 5
	}, */

    /* chittrHeaderText: {
        color: 'white',
        fontFamily: 'Courier New',
        fontSize: 30,
    }, */


/* });
export default chittr */ 

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