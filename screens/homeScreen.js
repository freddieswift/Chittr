import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity, Button, AsyncStorage } from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';


const _TOKEN = 'token';
const _ID = 'user_id';

class homeScreen extends Component {
	_isMounted = false;
	_menu = null;
	
	setMenuRef = ref => {
		this._menu = ref;
	};
	
	hideMenu = () => {
		this._menu.hide();
	};
	
	showMenu = () => {
		this._menu.show();
	};
	
	logoutOption = () => {
		this.logoutCall();
		this._menu.hide();
	};
	
	myAccount = () => {
		this.props.navigation.navigate('userProfile', {user_id: this.state.id});
		this._menu.hide();
	}
	
	
	
    constructor(props) {
        super(props);
		this.state = {
		  isLoading: true,
		  chitsData: [],
		  token: '',
		  loggedIn: false,
		  id: ''
	   }
	   
	   
	   
    } 
	
	componentDidMount(){
		this._isMounted = true;
		this.getChits();
		this.getToken();
		this.getID();
		
		const {navigation} = this.props;
		navigation.addListener ('willFocus', () => {
			this.getToken();
			this.getID();
		});
	}
	
	componentWillUnmount(){
		this._isMounted = false;
	}
	
	
	getChits(){
		return fetch('http://10.0.2.2:3333/api/v0.0.5/chits')
			.then((response) => response.json())
			.then((responseJson) => {
				if (this._isMounted){
					this.setState({
					isLoading: false,
					chitsData: responseJson,
					});
				}
				
			})
			.catch((error) => {console.log(error);});
	}
	
	async getID(){
		if (this._isMounted){
			try{
				let id = await AsyncStorage.getItem(_ID)
				if(id){
					this.setState({id: id})
				}
			}
			catch(error){
				console.log(error.message)
			}
		}
	}
	
	async getToken(){
		if (this._isMounted){
			try{
				let token = await AsyncStorage.getItem(_TOKEN)
				if(token){
					this.setState({token: token})
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
	}
	
	async deleteData(){
		try{
			await AsyncStorage.removeItem(_TOKEN)
			await AsyncStorage.removeItem(_ID)
			//to make button change back to login
			this.setState({loggedIn: false});
		}
		catch(error){
			console.log(error.message)
		}
	}
	
	async logoutCall(){
		try{
			const response = await fetch("http://10.0.2.2:3333/api/v0.0.5/logout",
			{
				method: 'POST',
				headers:{
					"Content-Type": "application/json",
					"X-Authorization" : this.state.token
				},
			});
			
			const status = await response.status;
			
			if (status == 400){
				Alert.alert('Unable To Logout','Please try again')
			}
			
			else if (status == 200){
				this.deleteData();
			}
			
			else {
				Alert.alert("Unable to logout, please try again")
			}
		}
		catch(error){
			console.log(error)
		}
		
		
		
	}
	
    render() {
		
		const loggedIn = this.state.loggedIn;
		
		let loginOptionsButton;
		
		if (loggedIn){
			
			loginOptionsButton = 
			<View>
				<Menu
					ref={this.setMenuRef}
					button ={<Button title="Options" onPress={this.showMenu}></Button>}
				>
					<MenuItem onPress={this.logoutOption}>Log Out</MenuItem>
					<MenuItem onPress={this.myAccount}>My Account</MenuItem>
				</Menu>
			</View>
		}
		else{
			loginOptionsButton = <Button
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
						{loginOptionsButton}
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
						keyExtractor={({id}, index) => id}
						//keyExtractor={item=>item.id}
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
	
	menuButton: {
		backgroundColor: 'blue'
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
