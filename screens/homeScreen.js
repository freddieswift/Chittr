import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Button, AsyncStorage } from 'react-native';

const _TOKEN = 'token';

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
	
	componentDidMount(){
		this.getChits();
		this.getToken();
		
		const {navigation} = this.props;
		navigation.addListener ('willFocus', () => {
			this.getToken();
		});
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
	
	async getToken(){
		try{
			let token = await AsyncStorage.getItem(_TOKEN)
			console.log("token is:", token)
			if(token){
				this.setState({loggedIn: true});
			}
			else{
				this.setState({loggedIn: false});
			}
		}
		catch(error){
			console.log(error.message)
		}
	}
	
	async deleteToken(){
		try{
			await AsyncStorage.removeItem(_TOKEN)
			//to make button change back to login
			this.setState({loggedIn: false});
		}
		catch(error){
			console.log(error.message)
		}
	}
	
	logout(){
		this.deleteToken();
	}
	
    render() {
		
		const loggedIn = this.state.loggedIn;
		
		let loginLogoutButton;
		
		if (loggedIn){
			loginLogoutButton = <Button
				onPress={() => this.logout()}
				title="Logout">
			</Button>
		}
		else{
			loginLogoutButton = <Button
				onPress={() => this.props.navigation.navigate('login')}
				title="Login">
			</Button>
		}
		
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
					<View>
						{loginLogoutButton}
					</View>
					<Text style={styles.chittrHeaderText}>Chittr</Text>	
					<View>
						<Button
							title="Search"
							onPress={ () => this.props.navigation.navigate('search')}
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
