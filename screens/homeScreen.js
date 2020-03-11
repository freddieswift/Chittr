import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Button, AsyncStorage } from 'react-native';



class homeScreen extends Component {
    constructor(props) {
        super(props);
		this.state = {
		  isLoading: true,
		  chitsData: [],
		  token: '',
		  loggedIn: false
	   }
    }
    render() {
		
		//console.log("start of render")
		console.log("this.token1: ", this.token)
		console.log("this.loggedIn1: ", this.loggedIn)
		if(this.state.isLoading){
			return(
				<View>
					<ActivityIndicator/>
				</View>
			)
		}
	
		//console.log("reached this.getData(token)")
		//this.getData('token')
		//console.log("reached this.getData(loggedIn)")
		//this.getData('loggedIn')
		
		
		//console.log("this.token: ", this.token)
		//console.log("this.loggedIn2: ", this.loggedIn)
		
        return (
            <View style={styles.container}>
                <View style={styles.headerBar}>
					<View>
						<Button
							onPress={() => this.props.navigation.navigate('login')}
							title="Login"
						/>
					</View>
					<Text style={styles.chittrHeaderText}>Chittr</Text>	
					<View>
						<Button
							title="Search"
							onPress={ () => {this.setState({token: this.getData('token')}); }}
						/>
					</View>
					
					
					
				</View>
				<View style = {styles.chittList}>
					<FlatList
						data={this.state.chitsData}
						renderItem={({item}) => 
							<View style={styles.chitt}>
								<View >
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
	
	async getData(key){
		//console.log("inside getData", key)
		try{
			const retrievedToken = await AsyncStorage.getItem(key) || 'none';
			//console.log("rt", retrievedToken)
			if (key == 'token'){
				//console.log("setting token inside getData")
				this.token = retrievedToken
			}else if (key == 'loggedIn'){
				//console.log("setting loggedIn inside getData")
				this.loggedIn = true
			}
		} catch(error){
			console.log(error.message);
		}
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
	
	
	//the whole chit
	chitt: {
		flexDirection: 'column',
		alignItems: 'stretch',
		margin: 5,
		padding: 5,
		borderColor: 'grey',
		borderWidth: 1,
		backgroundColor: 'white'
	},
	
	// flatlist to hold chitts
	chittList: {
		flex: 8
	},

	// header at top of screen
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
	},
	
	//chit content text
	chittText: {
		fontSize: 25,
		paddingLeft: 5
	},

    chittrHeaderText: {
        color: 'white',
        fontFamily: 'Courier New',
        fontSize: 30,
    },


});
export default homeScreen;
